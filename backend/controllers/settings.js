
const Organization = require('../models/Organization');
const User = require('../models/User');

exports.updateGeneralSettings = async (req, res, next) => {
  try {
    const { organizationName, timezone, dateFormat } = req.body;
    const userId = req.user.id;

    // Find organization
    const organization = await Organization.findById(req.user.organization);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    // Update organization settings
    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.user.organization,
      {
        name: organizationName,
        $set: {
          'settings.timezone': timezone,
          'settings.dateFormat': dateFormat,
          'settings.updatedAt': new Date(),
          'settings.updatedBy': userId
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'General settings updated successfully',
      data: {
        organizationName: updatedOrganization.name,
        timezone: updatedOrganization.settings?.timezone || 'UTC',
        dateFormat: updatedOrganization.settings?.dateFormat || 'MM/DD/YYYY'
      }
    });

  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    });
  }
};

exports.getGeneralSettings = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.user.organization);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        organizationName: organization.name,
        timezone: organization.settings?.timezone || 'UTC',
        dateFormat: organization.settings?.dateFormat || 'MM/DD/YYYY'
      }
    });

  } catch (err) {
    console.error('Settings fetch error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
};


exports.updateIntegrationSettings = async (req, res, next) => {
  try {
    const integrationSettings = req.body;
    const userId = req.user.id;

    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.user.organization,
      {
        $set: {
          'settings.integrations': integrationSettings,
          'settings.updatedAt': new Date(),
          'settings.updatedBy': userId
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Integration settings updated successfully',
      data: updatedOrganization.settings.integrations
    });

  } catch (err) {
    console.error('Integration settings update error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update integration settings'
    });
  }
};