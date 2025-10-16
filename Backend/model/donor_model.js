import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: { type: String, 
    required: true },

  email: { type: String,
     required: true },

  phone: { type: String,
     required: true },

  amount: { type: Number,
     required: true },
     
  createdAt: { type: Date, 
    default: Date.now },
});

const Donor = mongoose.model('Donor', donorSchema);

export default Donor;
