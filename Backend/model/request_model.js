import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  orphanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orphan', required: true },
  orphanageId: { type: mongoose.Schema.Types.ObjectId, ref: 'OrphanAge', required: true },
  type: { type: String, required: true, enum: ['school_fees', 'stationery', 'uniforms', 'books', 'other'] },
  units: { type: Number, required: true },
  unitType: { type: String, required: true }, // e.g., 'books', 'uniforms', 'notebooks'
  description: { type: String, required: true },
  school: { type: String, required: true },
  class: { type: String, required: false },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected', 'fulfilled'], default: 'pending' },
  adminComments: { type: String, required: false },
  documents: [{ type: String }], // URLs from Cloudinary
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
