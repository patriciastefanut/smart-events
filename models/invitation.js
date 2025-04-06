import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    uuid: { type: String, required: true },
    sentAt: { type: Date, required: true },
    respondedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

invitationSchema.index({event: -1, email: 1}, {unique: true});

export default mongoose.model("Invitation", invitationSchema);
