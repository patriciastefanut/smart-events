import mongoose from "mongoose";

const spendingSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: "Other" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "EUR" },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "Other"],
      default: "Other",
    },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    isReimbursable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Spending", spendingSchema);
