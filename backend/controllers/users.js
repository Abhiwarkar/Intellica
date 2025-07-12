const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    // Only get users from the same organization
    const users = await User.find({ organization: req.user.organization });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found with id of ${req.params.id}`
      });
    }

    // Make sure user belongs to user's organization
    if (user.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({
        success: false,
        error: `Not authorized to access this user`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // Add organization from authenticated user
    req.body.organization = req.user.organization;

    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found with id of ${req.params.id}`
      });
    }

    // Make sure user belongs to user's organization
    if (user.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({
        success: false,
        error: `Not authorized to update this user`
      });
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found with id of ${req.params.id}`
      });
    }

    // Make sure user belongs to user's organization
    if (user.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({
        success: false,
        error: `Not authorized to delete this user`
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};