import Feedback from "../models/feedback.js";
import AppError from "../utils/AppError.js";
import eventService from "./eventService.js";

const getFeedback = async (eventId, email) => {
  await eventService.getEventById(eventId);
  const feedback = await Feedback.findOne({ event: eventId, email });

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

export default {
  getFeedback,
  getAllFeedbacks,
};
