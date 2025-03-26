import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    decription: { type: String, required: true },
    from: { type: Date, required: true },
    until: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
    schedule: [
      {
        time: { type: Date, required: true },
        activity: { type: String, required: true },
      },
    ],
    requiredStaff: [{ type: String }],
    notes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);
