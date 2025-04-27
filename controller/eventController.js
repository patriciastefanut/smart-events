import eventDto from "../dto/eventDto.js";
import eventPlanDraftDto from "../dto/eventPlanDraftDto.js";
import eventService from "../service/eventService.js";

const createEventPlanDraft = async (req, res, next) => {
  try {
    const eventDraft = await eventService.createEventPlanDraft(req.user._id, req.body);
    res.status(201).json({ eventDraft: eventPlanDraftDto(eventDraft) });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.user._id, req.body);
    res.status(201).json({ event: eventDto(event) });
  } catch (err) {
    next(err);
  }
};

const getEventByIdAndOrganizer = async (req, res, next) => {
  try {
    const event = await eventService.getEventByIdAndOrganizer(req.params.eventId, req.user._id);
    res.status(200).json({ event: eventDto(event) });
  } catch (err) {
    next(err);
  }
};

const getAllEventsByUser = async (req, res, next) => {
  try {
    const events = await eventService.getAllEventsByUser(req.user._id);
    res.status(200).json({ events: events.map(eventDto) });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.user._id, req.params.eventId, req.body);
    res.status(200).json({ event: eventDto(event) });
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

const generateReport = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const buffer = await eventService.generateReport(eventId, userId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="report-${eventId}.pdf"`);
    return res.send(buffer);
  } catch (err) {
    next(err);
  }
};

export default {
  createEventPlanDraft,
  createEvent,
  getEventByIdAndOrganizer,
  getAllEventsByUser,
  updateEvent,
  deleteEvent,
  generateReport,
};
