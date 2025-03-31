import eventService from "../service/eventService.js";

const createEventPlanDraft = async (req, res, next) => {
  try {
    const eventDraft = await eventService.createEventPlanDraft(req.user._id, req.body);
    res.status(201).json({eventDraft});
  } catch (err) {
    next(err);
  }
};

export default { createEventPlanDraft };
