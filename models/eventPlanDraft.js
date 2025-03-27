import mongoose from "mongoose";

const eventPlanDraftSchema = new mongoose.Schema({
  input: {
    eventType: { type: String, required: true },
    from: { type: Date, required: true },
    until: { type: Date, required: true },
    location: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      cost: { type: Number, required: true },
    },
    guestCount: { type: Number, required: true },
    budget: { type: Number, required: true },
    preferences: [{ type: String, required: true }],
    vibe: { type: String, required: true },
    specialRequests: [{ type: String, required: true }],
  },
  suggestion: {
     title: { type: String, required: true },
       type: { type: String, required: true },
       decription: { type: String, required: true },
       from: { type: Date, required: true },
       until: { type: Date, required: true },
       guestCount: { type: Number, required: true },
       createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
       location: [{
         name: { type: String, required: true },
         address: { type: String, required: true },
         cost: { type: Number, required: true },
       }],
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
       requiredStaff: [{ type: String, required: true }],
       notes: [{ type: String, required: true }],
  },
});

export default mongoose.model("EventPlanDraft", eventPlanDraftSchema);
