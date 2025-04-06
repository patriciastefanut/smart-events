import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    invitation: { type: mongoose.Schema.Types.ObjectId, ref: "Invitation" },
    email: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    notes: { type: String, default: null },
    dietaryRestrictions: { type: String, default: null },
    checkedIn: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

participantSchema.index({ event: -1, email: 1 }, { unique: true });

export default mongoose.model("Participant", participantSchema);
