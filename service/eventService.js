import { v4 as uuidv4 } from "uuid";

import Event from "../models/event.js";
import EventPlanDraft from "../models/eventPlanDraft.js";
import gpt from "../utils/gpt.js";
import AppError from "../utils/AppError.js";
import event from "../models/event.js";

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
};

const createEvent = async (userId, data) => {
  const event = await Event.create({
    createdBy: userId,
    uuid: uuidv4(),
    title: data.title,
    type: data.type,
    description: data.description,
    from: data.from,
    until: data.until,
    guestCount: data.guestCount,
    location: data.location,
    budget: data.budget,
    currency: data.currency,
    schedule: data.schedule,
    requiredStaff: data.requiredStaff,
    notes: data.notes,
  });

  return event;
};

const getEventById = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  return event;
};

const getEventByIdAndUser = async (userId, eventId) => {
  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  return event;
};

const getEventByUUID = async (uuid) => {
  const event = await Event.findOne({ uuid });
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  return event;
};

const getAllEventsByUser = async (userId) =>
  await Event.find({ createdBy: userId });

const updateEvent = async (userId, eventId, data) => {
  const updated = await Event.findOneAndUpdate(
    { _id: eventId, createdBy: userId },
    {
      $set: {
        title: data.title,
        type: data.type,
        description: data.description,
        from: data.from,
        until: data.until,
        guestCount: data.guestCount,
        location: data.location,
        budget: data.budget,
        currency: data.currency,
        schedule: data.schedule,
        requiredStaff: data.requiredStaff,
        notes: data.notes,
      },
    },
    { new: true }
  );

  if (!updated) {
    throw new AppError("Failed to update event", 400);
  }

  return updated;
};

const deleteEvent = async (userId, eventId) => {
  await Event.findOneAndDelete({ _id: eventId, createdBy: userId });
};

export default {
  createEventPlanDraft,
  createEvent,
  getEventById,
  getEventByUUID,
  getEventByIdAndUser,
  getAllEventsByUser,
  deleteEvent,
  updateEvent,
};
