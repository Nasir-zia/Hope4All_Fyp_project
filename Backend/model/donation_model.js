import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },

  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: false
  },

  type: {
    type: String,
    required: true,
    default: 'Other'
  },

  description: {
    type: String
  },

  units: {
    type: Number,
    required: true
  },

  unitType: {
    type: String,
    default: 'Units'
  },

  recipientName: {
    type: String,
    required: false
  },

  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orphan'
  },

  status: {
    type: String,
    enum: ['pending', 'in-progress', 'delivered'],
    default: 'pending'
  },

  receipt: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  deliveredAt: {
    type: Date
  }
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
