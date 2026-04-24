import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  link: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Skills', 'Tech', 'Language', 'Other'], default: 'Academic' },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedByRole: { type: String, enum: ['admin', 'donor'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
