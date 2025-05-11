import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import AppError from "../utils/AppError.js";
import gpt from "../utils/gpt.js";
import Event from "../models/event.js";
import invitationService from "./invitationService.js";
import participantService from "./participantService.js";
import feedbackService from "./feedbackService.js";

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
  location: {
    name: "String",
    address: "String",
    cost: "Number",
  },
  budget: {
    venue: "Number",
    catering: "Number",
    equipment: "Number",
    staff: "Number",
    miscellaneous: "Number",
  },
  currency: "String",
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

const aiGenerateEvent = async (userId, data) => {
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
  const answer = await gpt(content);

  const result = { ...JSON.parse(answer), createdBy: userId, uuid: uuidv4(), currency: data.currency };
  return await Event.create(result);
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

const getEventByIdAndOrganizer = async (eventId, userId) => {
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

const getAllEventsByUser = async (userId) => await Event.find({ createdBy: userId });

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

const generateReport = async (eventId, userId) => {
  const doc = new PDFDocument();
  const buffers = [];

  const event = await getEventByIdAndOrganizer(eventId, userId);
  const invitations = await invitationService.getInvitationsByEventAndOrganizer(eventId, userId);
  const participants = await participantService.getParticipantsByEventAndOrganizer(eventId, userId);
  const feedbacks = await feedbackService.getEventFeedbacks(eventId, userId);

  doc.on("data", buffers.push.bind(buffers));

  // Event Details
  doc.fontSize(22).text(event.title, { align: "center" });
  doc.moveDown(1);

  doc.fontSize(18).text(`Event Type: ${event.type}`);
  doc.fontSize(16).text(`Description: ${event.description}`);
  doc.fontSize(16).text(`From: ${event.from}`);
  doc.fontSize(16).text(`Until: ${event.until}`);
  doc.fontSize(16).text(`Guest Count: ${event.guestCount}`);
  doc.moveDown(1);

  // Location
  doc.fontSize(18).text("Location", { underline: true });
  doc.fontSize(16).text(`Name: ${event.location.name}`);
  doc.fontSize(16).text(`Address: ${event.location.address}`);
  doc.fontSize(16).text(`Cost: ${event.location.cost}`);
  doc.moveDown(1);

  // Budget
  doc.fontSize(18).text("Budget", { underline: true });
  doc.fontSize(16).text(`Venue: ${event.budget.venue}`);
  doc.fontSize(16).text(`Catering: ${event.budget.catering}`);
  doc.fontSize(16).text(`Equipment: ${event.budget.equipment}`);
  doc.fontSize(16).text(`Staff: ${event.budget.staff}`);
  doc.fontSize(16).text(`Miscellaneous: ${event.budget.miscellaneous}`);
  doc.fontSize(16).text(`Currency: ${event.currency}`);
  doc.moveDown(1);

  // Schedule
  if (event.schedule.length > 0) {
    doc.fontSize(18).text("Schedule", { underline: true });
    event.schedule.forEach((item, index) => {
      doc.fontSize(16).text(`${index + 1}. ${item.time} - ${item.activity}`);
    });
    doc.moveDown(1);
  }

  // Required Staff
  if (event.requiredStaff.length > 0) {
    doc.fontSize(18).text("Required Staff", { underline: true });
    event.requiredStaff.forEach((staff, index) => {
      doc.fontSize(16).text(`- ${staff}`);
    });
    doc.moveDown(1);
  }

  // Notes
  if (event.notes.length > 0) {
    doc.fontSize(18).text("Notes", { underline: true });
    event.notes.forEach((note, index) => {
      doc.fontSize(16).text(`- ${note}`);
    });
    doc.moveDown(1);
  }

  // Invitations
  if (invitations.length > 0) {
    doc.addPage();
    doc.fontSize(22).text("Invitations", { align: "center" });
    doc.moveDown(1);

    invitations.forEach((inv) => {
      doc.fontSize(16).text(`Name: ${inv.firstname} ${inv.lastname}`);
      doc.fontSize(16).text(`Email: ${inv.email}`);
      doc.fontSize(16).text(`Status: ${inv.status}`);
      doc.fontSize(16).text(`Sent At: ${inv.sentAt}`);
      doc.fontSize(16).text(`Responded At: ${inv.respondedAt || "Not responded"}`);
      doc.fontSize(16).text(`Respond Before: ${inv.respondBefore}`);
      doc.moveDown(0.5);
    });
  }

  // Participants
  if (participants.length > 0) {
    doc.addPage();
    doc.fontSize(22).text("Participants", { align: "center" });
    doc.moveDown(1);

    participants.forEach((p) => {
      doc.fontSize(16).text(`Name: ${p.firstname} ${p.lastname}`);
      doc.fontSize(16).text(`Email: ${p.email}`);
      doc.fontSize(16).text(`Checked In: ${p.checkedIn ? "Yes" : "No"}`);
      if (p.notes) doc.fontSize(16).text(`Notes: ${p.notes}`);
      if (p.dietaryRestrictions) doc.fontSize(16).text(`Dietary Restrictions: ${p.dietaryRestrictions}`);
      doc.moveDown(0.5);
    });
  }

  // Feedbacks
  if (feedbacks.length > 0) {
    doc.addPage();
    doc.fontSize(22).text("Feedbacks", { align: "center" });
    doc.moveDown(1);

    feedbacks.forEach((fb) => {
      doc.fontSize(16).text(`Email: ${fb.email}`);
      doc.fontSize(16).text(`Rating: ${fb.rating}/5`);
      if (fb.comment) doc.fontSize(16).text(`Comment: ${fb.comment}`);
      doc.moveDown(0.5);
    });
  }

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
};

export default {
  aiGenerateEvent,
  createEvent,
  getEventById,
  getEventByUUID,
  getEventByIdAndOrganizer,
  getAllEventsByUser,
  deleteEvent,
  updateEvent,
  generateReport,
};
