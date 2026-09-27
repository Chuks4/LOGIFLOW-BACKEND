const router = require("express").Router();

const notificationController = require("../controllers/notifications");
const { authAccess } = require("../middlewares/authAccess");

router.get("/", authAccess, notificationController.getUserNotifications);
router.patch("/read/:id", authAccess, notificationController.markAsRead);
router.patch("/readAll", authAccess, notificationController.markAllAsRead);