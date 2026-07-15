const express = require("express");
const router = express.Router();
const notificationController = require("./notification.controller");
const auth = require("../../middleware/auth");

router.get("/", auth, notificationController.getNotifications);
router.get("/count", auth, notificationController.getUnseenCount);
router.get("/new", auth, notificationController.checkNewNotification);

module.exports = router;
