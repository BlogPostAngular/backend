const Notification = require("./notification.model");

// Get notifications (paginated and filtered)
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || "all";

    const query = {
      notification_for: userId,
      user: { $ne: userId }, // do not notify own actions
    };

    if (filter !== "all") {
      query.type = filter;
    }

    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments(query);

    const notifications = await Notification.find(query)
      .populate("user", "personal_info.fullName personal_info.username personal_info.profile_img")
      .populate("blog", "title blog_id")
      .populate("comment", "comment")
      .populate("reply", "comment")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Mark fetched notifications as read
    if (notifications.length > 0) {
      const notifIds = notifications.map((n) => n._id);
      await Notification.updateMany({ _id: { $in: notifIds } }, { seen: true });
    }

    res.status(200).json({
      success: true,
      data: {
        notifications,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Count unseen notifications
const getUnseenCount = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await Notification.countDocuments({
      notification_for: userId,
      seen: false,
      user: { $ne: userId },
    });

    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Get unseen count error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Check if new notifications exist
const checkNewNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const exists = await Notification.exists({
      notification_for: userId,
      seen: false,
      user: { $ne: userId },
    });

    res.status(200).json({ success: true, hasNew: !!exists });
  } catch (error) {
    console.error("Check new notification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  getUnseenCount,
  checkNewNotification,
};
