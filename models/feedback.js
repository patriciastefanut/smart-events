import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    email: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ event: -1, email: 1 }, { unique: true });

export default mongoose.model("Invitation", feedbackSchema);
