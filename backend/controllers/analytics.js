const Event = require('../models/Event');

exports.trackEvent = async (req, res, next) => {
  try {
    // Add organization from authenticated user
    req.body.organization = req.user.organization;
    
    // Create event in database
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const { 
      name, 
      startDate, 
      endDate, 
      userId,
      limit = 100, 
      page = 1 
    } = req.query;

    const query = { organization: req.user.organization };
    
    if (name) query.name = name;
    if (userId) query.userId = userId;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const events = await Event.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: events
    });
  } catch (err) {
    next(err);
  }
};

exports.getOverview = async (req, res, next) => {
  try {
    const orgId = req.user.organization;
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Get total events today
    const todayEvents = await Event.countDocuments({
      organization: orgId,
      timestamp: { $gte: today }
    });

    // Get unique users today
    const todayUsers = await Event.distinct('userId', {
      organization: orgId,
      timestamp: { $gte: today },
      userId: { $exists: true, $ne: null }
    });

    // Get total events this week
    const weekEvents = await Event.countDocuments({
      organization: orgId,
      timestamp: { $gte: lastWeek }
    });

    // Get total events this month
    const monthEvents = await Event.countDocuments({
      organization: orgId,
      timestamp: { $gte: lastMonth }
    });

    // Get event breakdown
    const eventBreakdown = await Event.aggregate([
      { 
        $match: { 
          organization: orgId,
          timestamp: { $gte: lastWeek } 
        } 
      },
      { 
        $group: { 
          _id: '$name', 
          count: { $sum: 1 } 
        } 
      },
      { 
        $sort: { count: -1 } 
      },
      { 
        $limit: 5 
      }
    ]);

    // Get daily events for last 7 days
    const dailyEvents = await Event.aggregate([
      {
        $match: {
          organization: orgId,
          timestamp: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get monthly user growth (last 5 months)
    const monthlyUsers = await Event.aggregate([
      {
        $match: {
          organization: orgId,
          timestamp: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)) }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$timestamp" },
            year: { $year: "$timestamp" }
          },
          users: { $addToSet: "$userId" }
        }
      },
      {
        $project: {
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                { case: { $eq: ["$_id.month", 12] }, then: "Dec" }
              ]
            }
          },
          users: { $size: "$users" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format results
    const overview = {
      totalEventsToday: todayEvents,
      uniqueUsersToday: todayUsers.length,
      totalEventsThisWeek: weekEvents,
      totalEventsThisMonth: monthEvents,
      topEvents: eventBreakdown.map(item => ({
        name: item._id,
        count: item.count
      })),
      dailyEvents: dailyEvents.map(item => ({
        date: item._id,
        count: item.count
      })),
      monthlyUsers: monthlyUsers
    };

    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserMetrics = async (req, res, next) => {
  try {
    const orgId = req.user.organization;
    const { period = 'week' } = req.query;
    
    let startDate;
    const now = new Date();
    
    if (period === 'day') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid period specified'
      });
    }

    const uniqueUsers = await Event.distinct('userId', {
      organization: orgId,
      timestamp: { $gte: startDate },
      userId: { $exists: true, $ne: null }
    });

    const userMetrics = {
      totalUniqueUsers: uniqueUsers.length,
    };

    res.status(200).json({
      success: true,
      data: userMetrics
    });
  } catch (err) {
    next(err);
  }
};