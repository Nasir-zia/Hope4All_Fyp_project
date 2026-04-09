import mongoose from "mongoose";

const orphanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  profilePic: { type: String, required: true },
  supportingDocs: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Orphan = mongoose.model("Orphan", orphanSchema);

export default Orphan;
