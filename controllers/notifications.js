const notificationService = require("../services/notifications");

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(
      req.user.id,
    );
    return res.status(200).json({ status: true, data: notifications });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.id,
    );
    return res.status(200).json({ status: true, data: notification });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    }
    
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAllAsRead(req.user.id);
    return res.status(200).json({ status: true, data: notification });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    }
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
