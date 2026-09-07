const NotificationModel = require('../models/notificationModel');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await NotificationModel.getByUserId(userId);
    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ message: 'Server error while fetching notifications.' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notif = await NotificationModel.findById(id, userId);
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found or access denied.' });
    }

    await NotificationModel.markAsRead(id, userId);
    return res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({ message: 'Server error while marking notification as read.' });
  }
};

const markAsUnread = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notif = await NotificationModel.findById(id, userId);
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found or access denied.' });
    }

    await NotificationModel.markAsUnread(id, userId);
    return res.status(200).json({ message: 'Notification marked as unread.' });
  } catch (error) {
    console.error('Mark as unread error:', error);
    return res.status(500).json({ message: 'Server error while marking notification as unread.' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notif = await NotificationModel.findById(id, userId);
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found or access denied.' });
    }

    await NotificationModel.deleteById(id, userId);
    return res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({ message: 'Server error while deleting notification.' });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    await NotificationModel.clearAllByUserId(userId);
    return res.status(200).json({ message: 'All notifications cleared successfully.' });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    return res.status(500).json({ message: 'Server error while clearing notifications.' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAsUnread,
  deleteNotification,
  clearAllNotifications
};
