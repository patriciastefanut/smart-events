import { v4 as uuidv4 } from "uuid";

import Feedback from "../models/feedback.js";
import AppError from "../utils/AppError.js";
import eventService from "./eventService.js";
import participantService from "./participantService.js";
import emailService from "./emailService.js";

const getFeedback = async (eventId, uuid) => {
  await eventService.getEventById(eventId);
  const feedback = await Feedback.findOne({ event: eventId, uuid });

  if (!feedback) {
    throw new AppError("Feedback not found", 404);
  }

  return feedback;
};

const getAllFeedbacks = async (eventId, email) => {
  await eventService.getEventById(eventId);
  const feedbacks = await Feedback.find({ event: eventId });
  return feedbacks;
};

const createFeedback = async (eventId, data) => {
  const event = await eventService.getEventById(eventId);
  const participant = await participantService.getParticipantByEmailAndEvent(data.email, eventId);

  const existing = await Feedback.findOne({ event: eventId, email: data.email });
  if (existing) {
    throw new AppError(`Participant already gave feedback`, 422);
  }

  const feedback = await Feedback.create({
    event: eventId,
    uuid: uuidv4(),
    email: data.email,
    rating: data.raing,
    comment: data.comment,
  });

  const emailInfo = {
    eventTitle: event.title,
    userEmail: participant.email,
    userFirstname: participant.firstname,
    feedback,
  };

  await emailService.sendFeedbackConfirm(emailInfo);

  return feedback;
};

export default {
  getFeedback,
  getAllFeedbacks,
  createFeedback,
};
