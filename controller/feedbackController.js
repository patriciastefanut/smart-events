import feedbackService from "../service/feedbackService.js";

const getFeedback = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const email = req.params.email;
    const feedback = await feedbackService.getFeedback(eventId, email);
    res.status(200).json({ feedback });
  } catch (err) {
    next(err);
  }
};

export default { getFeedback };
