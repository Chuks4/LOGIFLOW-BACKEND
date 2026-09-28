const { getSocketIO } = require("../sockets");
const db = require("../models");
const { errorMsg } = require("../utils/util");
const notificationRepo = require("../repositories/notifications");

const createNotification = async (notification) => {
  const { type, userId, message, title } = notification;

  const socket = getSocketIO();
  const createdNotification = await notificationRepo.create({
    type,
    userId,
    message,
    title,
  });

  const count = await db.notifications.count({
    where: { userId, isRead: false },
  });

  socket
    .to(`user:${userId}`)
    .emit("notification:new", { ...createdNotification.dataValues, count });

  return createdNotification;
};

const getUserNotifications = async (userId) => {
  const notifications = await notificationRepo.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  return notifications;
};

const markAsRead = async (notificationId, userId) => {
  const notification = await db.notifications.findOne({
    where: { id: notificationId, userId },
  });
  if (!notification) errorMsg("Notification not found", 404);
  await notification.update({ isRead: true });
  return await notificationRepo.findById(notificationId);
};

const markAllAsRead = async (userId) => {
  const notifications = await db.notifications.findAll({
    where: { userId, isRead: false },
  });

  await Promise.all(
    notifications.map((notification) => notification.update({ isRead: true })),
  );

  return notifications;
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
