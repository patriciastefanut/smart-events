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

const getAllEventsByUser = async (req, res, next) => {
  try {
    const events = await eventService.getAllEventsByUser(req.user._id);
    res.status(200).json({ events });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.user._id, req.params.eventId, req.body);
    res.status(200).json({event});
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.user._id, req.params.eventId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createEventPlanDraft,
  createEvent,
  getEvent,
  getAllEventsByUser,
  updateEvent,
  deleteEvent,
};
