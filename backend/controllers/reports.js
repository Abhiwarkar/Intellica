// controllers/reports.js
const Event = require('../models/Event');
const mongoose = require('mongoose');

exports.getBusinessOverview = async (req, res, next) => {
  try {
    const orgId = req.user.organization;
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '12m':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get revenue data (from purchase events)
    const revenueData = await Event.aggregate([
      {
        $match: {
          organization: orgId,
          name: { $in: ['purchase', 'purchase_completed', 'payment_success'] },
          timestamp: { $gte: startDate },
          'properties.amount': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$properties.amount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$properties.amount' }
        }
      }
    ]);

    // Get customer count (unique users)
    const customerCount = await Event.distinct('userId', {
      organization: orgId,
      timestamp: { $gte: startDate },
      userId: { $exists: true, $ne: null }
    });

    // Get conversion rate (purchases / visitors)
    const totalVisitors = await Event.distinct('userId', {
      organization: orgId,
      timestamp: { $gte: startDate }
    });

    const purchaseUsers = await Event.distinct('userId', {
      organization: orgId,
      name: { $in: ['purchase', 'purchase_completed', 'payment_success'] },
      timestamp: { $gte: startDate }
    });

    // Get top products/events
    const topProducts = await Event.aggregate([
      {
        $match: {
          organization: orgId,
          name: { $in: ['purchase', 'purchase_completed'] },
          timestamp: { $gte: startDate },
          'properties.product': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$properties.product',
          revenue: { $sum: '$properties.amount' },
          units: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // Get monthly revenue trend
    const monthlyRevenue = await Event.aggregate([
      {
        $match: {
          organization: orgId,
          name: { $in: ['purchase', 'purchase_completed'] },
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' }
          },
          revenue: { $sum: '$properties.amount' },
          customers: { $addToSet: '$userId' },
          orders: { $sum: 1 }
        }
      },
      {
        $project: {
          month: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id.month', 1] }, then: 'Jan' },
                { case: { $eq: ['$_id.month', 2] }, then: 'Feb' },
                { case: { $eq: ['$_id.month', 3] }, then: 'Mar' },
                { case: { $eq: ['$_id.month', 4] }, then: 'Apr' },
                { case: { $eq: ['$_id.month', 5] }, then: 'May' },
                { case: { $eq: ['$_id.month', 6] }, then: 'Jun' },
                { case: { $eq: ['$_id.month', 7] }, then: 'Jul' },
                { case: { $eq: ['$_id.month', 8] }, then: 'Aug' },
                { case: { $eq: ['$_id.month', 9] }, then: 'Sep' },
                { case: { $eq: ['$_id.month', 10] }, then: 'Oct' },
                { case: { $eq: ['$_id.month', 11] }, then: 'Nov' },
                { case: { $eq: ['$_id.month', 12] }, then: 'Dec' }
              ]
            }
          },
          revenue: 1,
          customers: { $size: '$customers' },
          orders: 1
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const overview = {
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      totalCustomers: customerCount.length,
      conversionRate: totalVisitors.length > 0 ? ((purchaseUsers.length / totalVisitors.length) * 100).toFixed(2) : 0,
      averageOrderValue: revenueData[0]?.avgOrderValue || 0,
      topProducts: topProducts.map(item => ({
        name: item._id,
        revenue: item.revenue,
        units: item.units
      })),
      revenueByMonth: monthlyRevenue
    };

    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserActivityReport = async (req, res, next) => {
  try {
    const orgId = req.user.organization;
    const { period = '30d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get total sessions
    const totalSessions = await Event.distinct('sessionId', {
      organization: orgId,
      timestamp: { $gte: startDate },
      sessionId: { $exists: true, $ne: null }
    });

    // Get page views
    const pageViews = await Event.countDocuments({
      organization: orgId,
      name: 'page_view',
      timestamp: { $gte: startDate }
    });

    // Get unique visitors
    const uniqueVisitors = await Event.distinct('userId', {
      organization: orgId,
      timestamp: { $gte: startDate }
    });

    // Calculate bounce rate
    const bounceSessions = await Event.aggregate([
      {
        $match: {
          organization: orgId,
          name: 'page_view',
          timestamp: { $gte: startDate },
          sessionId: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$sessionId',
          pageViews: { $sum: 1 }
        }
      },
      {
        $match: { pageViews: 1 }
      }
    ]);

    // Get top pages
    const topPages = await Event.aggregate([
      {
        $match: {
          organization: orgId,
          name: 'page_view',
          timestamp: { $gte: startDate },
          'properties.page': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$properties.page',
          views: { $sum: 1 },
          uniqueViews: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          page: '$_id',
          views: 1,
          uniqueViews: { $size: '$uniqueViews' }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Get users by device
    const usersByDevice = await Event.aggregate([
      {
        $match: {
          organization: orgId,
          timestamp: { $gte: startDate },
          'metadata.device': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$metadata.device',
          users: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          device: '$_id',
          users: { $size: '$users' }
        }
      }
    ]);

    const totalUniqueUsers = uniqueVisitors.length;
    const deviceData = usersByDevice.map(item => ({
      device: item.device,
      users: item.users,
      percentage: totalUniqueUsers > 0 ? ((item.users / totalUniqueUsers) * 100).toFixed(1) : 0
    }));

    const userActivity = {
      totalSessions: totalSessions.length,
      averageSessionTime: '4m 23s', 
      bounceRate: totalSessions.length > 0 ? ((bounceSessions.length / totalSessions.length) * 100).toFixed(1) : 0,
      pageViewsPerSession: totalSessions.length > 0 ? (pageViews / totalSessions.length).toFixed(1) : 0,
      topPages: topPages.map(item => ({
        page: item.page,
        views: item.views,
        uniqueViews: item.uniqueViews,
        avgTime: '3m 45s'
      })),
      usersByDevice: deviceData
    };

    res.status(200).json({
      success: true,
      data: userActivity
    });
  } catch (err) {
    next(err);
  }
};

exports.getConversionFunnel = async (req, res, next) => {
  try {
    const orgId = req.user.organization;
    const { period = '30d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    //  funnel steps based on common events
    const funnelSteps = [
      { name: 'Visited Website', events: ['page_view'] },
      { name: 'Viewed Product/Pricing', events: ['page_view'], page: '/pricing' },
      { name: 'Started Signup', events: ['signup_started', 'form_submit'] },
      { name: 'Completed Signup', events: ['signup_completed', 'user_registered'] },
      { name: 'Made Purchase', events: ['purchase', 'purchase_completed'] }
    ];

    const funnelData = [];
    
    for (let i = 0; i < funnelSteps.length; i++) {
      const step = funnelSteps[i];
      let query = {
        organization: orgId,
        name: { $in: step.events },
        timestamp: { $gte: startDate }
      };

      // Add page filter if specified
      if (step.page) {
        query['properties.page'] = step.page;
      }

      const users = await Event.distinct('userId', query);
      
      funnelData.push({
        step: step.name,
        users: users.length,
        percentage: i === 0 ? 100 : funnelData[0] ? ((users.length / funnelData[0].users) * 100).toFixed(1) : 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        steps: funnelData
      }
    });
  } catch (err) {
    next(err);
  }
};