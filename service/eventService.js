import Event from "../models/event.js";
import EventPlanDraft from "../models/eventPlanDraft.js";
import AppError from "../utils/AppError.js";
import gpt from "../utils/gpt.js";

const getContent = (data) => `

Input: ${JSON.stringify(data)}

Task: Please provide event draft ideas based on input.
Note: Please provide max. 5 locations, real ones, near, based on input location.

Output: Only this as pure valid JSON, no markups, not quotes:
${JSON.stringify({
  title: "String",
  type: "String",
  description: "String",
  from: "Date",
  until: "Date",
  guestCount: "Number",
  locations: [
    {
      name: "String",
      address: "String",
      cost: "Number",
    },
  ],
  budget: {
    venue: "Number",
    catering: "Number",
    equipment: "Number",
    staff: "Number",
    miscellaneous: "Number",
  },
  schedule: [
    {
      time: "Date",
      activity: "String",
    },
  ],
  requiredStaff: ["String"],
  notes: ["String"],
})}
`;

const createEventPlanDraft = async (userId, data) => {
  try {
    const input = {
      eventType: data.eventType,
      from: data.from,
      until: data.until,
      location: data.location,
      guestCount: data.guestCount,
      budget: data.budget,
      currency: data.currency,
      preferences: data.preferences,
      vibe: data.vibe,
      specialRequests: data.specialRequests,
      notes: data.notes,
    };

    const content = getContent(input);
    console.log(content);
    const answer = await gpt(content);
    console.log(answer);
    const result = {
      createdBy: userId,
      input,
      suggestion: { ...JSON.parse(answer), currency: data.currency },
    };

    return await EventPlanDraft.create(result);
  } catch (err) {
    throw new AppError(err.message || "Failed to parse JSON", 500);
  }
};

export default { createEventPlanDraft };
