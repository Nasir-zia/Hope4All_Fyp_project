import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // donorId: used for donor-specific notifications (fee reminders, donation updates)
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: false,
    default: null,
  },

  // recipientId: generic User ref for volunteer/admin/orphan notifications
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },

  type: {
    type: String,
    enum: ['delivery', 'update', 'thanks', 'shipping', 'task', 'task_update'],
    required: true
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  unread: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
