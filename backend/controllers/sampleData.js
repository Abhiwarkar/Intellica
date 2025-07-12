
const Event = require('../models/Event');

exports.generateSampleData = async (req, res, next) => {
  try {
    const orgId = req.user.organization;
    
  
    const eventTypes = [
      'page_view',
      'button_click', 
      'form_submit',
      'user_signup',
      'purchase',
      'download',
      'search',
      'video_play',
      'share',
      'like'
    ];

    const sampleEvents = [];
    const now = new Date();
    
    // Generate data for last 30 days
    for (let days = 0; days < 30; days++) {
      const eventDate = new Date(now);
      eventDate.setDate(eventDate.getDate() - days);
      
      // Generate 5-50 random events per day
      const eventsPerDay = Math.floor(Math.random() * 45) + 5;
      
      for (let i = 0; i < eventsPerDay; i++) {
        const eventTime = new Date(eventDate);
        eventTime.setHours(
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 60)
        );
        
        sampleEvents.push({
          name: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          organization: orgId,
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          sessionId: `session_${Math.floor(Math.random() * 10000)}`,
          timestamp: eventTime,
          properties: {
            page: `/page-${Math.floor(Math.random() * 10)}`,
            source: ['google', 'facebook', 'direct', 'twitter'][Math.floor(Math.random() * 4)],
            device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
          },
          metadata: {
            browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
            os: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)],
            country: ['US', 'UK', 'Canada', 'India', 'Germany'][Math.floor(Math.random() * 5)]
          }
        });
      }
    }

    // Insert all sample events
    await Event.insertMany(sampleEvents);

    res.status(201).json({
      success: true,
      message: `Generated ${sampleEvents.length} sample events`,
      data: {
        eventsGenerated: sampleEvents.length,
        dateRange: {
          from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          to: now
        }
      }
    });
  } catch (err) {
    next(err);
  }
};