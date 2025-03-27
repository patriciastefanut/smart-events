import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    attendanceCount: { type: Number, min: 0, required: true },
    averageRating: { type: Number, min: 0, required: true },

    topFeedback: { type: String, required: true },
    budgetUsed: { type: Number, min: 0, required: true },
    summary: { type: String, required: true },
    issues: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ event: -1}, { unique: true });

export default mongoose.model("Report", reportSchema);
