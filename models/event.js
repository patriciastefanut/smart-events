import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    from: { type: Date, required: true },
    until: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uuid: { type: String, required: true, unique: true },
    location: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      cost: { type: Number, required: true },
    },
    budget: {
      venue: { type: Number, required: true },
      catering: { type: Number, required: true },
      equipment: { type: Number, required: true },
      staff: { type: Number, required: true },
      miscellaneous: { type: Number, required: true },
    },
    currency: { type: String, required: true },
    schedule: [
      {
        time: { type: Date, required: true },
        activity: { type: String, required: true },
      },
    ],
    requiredStaff: [{ type: String, required: true }],
    notes: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);
