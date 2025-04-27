import feedbackService from "../service/feedbackService.js";

const getFeedback = async (req, res, next) => {
  try {
    const eventUUID = req.params.eventUUID;
    const feedbackUUID = req.params.feedbackUUID;
    const feedback = await feedbackService.getFeedback(eventUUID, feedbackUUID);
    res.status(200).json({ feedback });
  } catch (err) {
    next(err);
  }
};

const getAllFeedbacks = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const feedbacks = await feedbackService.getAllFeedbacks(eventId);
    res.status(200).json({ feedbacks });
  } catch (err) {
    next(err);
  }
};

const createFeedback = async (req, res, next) => {
  try {
    const eventUUID = req.params.eventUUID;
    const feedback = await feedbackService.createFeedback(eventUUID, req.body);
    res.status(201).json({ feedback });
  } catch (err) {
    next(err);
  }
};

export default { getFeedback, getAllFeedbacks, createFeedback };
