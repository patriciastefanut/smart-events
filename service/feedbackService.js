import Feedback from "../models/feedback.js";
import AppError from "../utils/AppError.js";

const getFeedback = async (eventId, email) => {
  const feedback = await Feedback.findOne({ event: eventId, email });

  if (!feedback) {
    throw new AppError("Feedback not found", 404);
  }

  return feedback;
};

export default {
  getFeedback,
};
