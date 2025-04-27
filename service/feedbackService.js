import { v4 as uuidv4 } from "uuid";

import Feedback from "../models/feedback.js";
import AppError from "../utils/AppError.js";
import eventService from "./eventService.js";
import participantService from "./participantService.js";
import emailService from "./emailService.js";

const getFeedback = async (eventUUID, feedbackUUID) => {
  const event = await eventService.getEventByUUID(eventUUID);
  const feedback = await Feedback.findOne({ event: event._id, uuid: feedbackUUID });

  if (!feedback) {
    throw new AppError("Feedback not found", 404);
  }

  return feedback;
};

const getAllFeedbacks = async (eventId) => {
  await eventService.getEventById(eventId);
  const feedbacks = await Feedback.find({ event: eventId });
  return feedbacks;
};

const createFeedback = async (eventUUID, data) => {
  const event = await eventService.getEventByUUID(eventUUID);
  // const participant = await participantService.getParticipantByEmailAndEvent(data.email, event._id);

  const existing = await Feedback.findOne({ event: event._id, email: data.email });
  if (existing) {
    throw new AppError(`Participant already gave feedback`, 422);
  }

  const feedback = await Feedback.create({
    event: event._id,
    uuid: uuidv4(),
    email: data.email,
    rating: data.raing,
    comment: data.comment,
  });

  const emailInfo = {
    eventTitle: event.title,
    // userEmail: participant.email || data.email,
    // userFirstname: participant.firstname || "Invited",
    userEmail: data.email,
    userFirstname: "TEST NAME",
    feedbackUrl: `https://localhost:4200/events/${eventUUID}feedbacks/${feedback.uuid}`,
  };

  await emailService.sendFeedbackConfirm(emailInfo);

  return feedback;
};

const updateFeedback = async (eventUUID, feedbackUUID, data) => {
  const feedback = await getFeedback(eventUUID, feedbackUUID);

  if (data.rating) {
    feedback.rating = data.rating;
  }
  if (data.comment) {
    feedback.comment = data.comment;
  }

  if (data.comment === null) {
    feedback.comment = null;
  }

  return await feedback.save();
};

export default {
  getFeedback,
  getAllFeedbacks,
  createFeedback,
  updateFeedback,
};
