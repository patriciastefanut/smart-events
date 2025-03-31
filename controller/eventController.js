import eventService from "../service/eventService.js";

const createEventPlanDraft = async (req, res, next) => {
  try {
    const eventDraft = await eventService.createEventPlanDraft(
      req.user._id,
      req.body
    );
    res.status(201).json({ eventDraft });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.user._id, req.body);
    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEvent(req.user._id, req.params.eventId);
    res.status(200).json({ event });
  } catch (err) {
    next(err);
  }
};

export default { createEventPlanDraft, createEvent, getEvent };
