import spendingDto from "../dto/spendingDto.js";
import spendingService from "../service/spendingService.js";

const getSpendingsByEventAndOrganizer = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const spendings = await spendingService.getSpendingsByEventAndOrganizer(eventId, userId);
    res.status(200).json({ spendings: spendings.map(spendingDto) });
  } catch (err) {
    next(err);
  }
};

const getSpendingById = async (req, res, next) => {
  try {
    const { spendingId } = req.params;

    const spending = await spendingService.getSpendingById(spendingId);
    res.status(200).json({ spending: spendingDto(spending) });
  } catch (err) {
    next(err);
  }
};

const createSpending = async (req, res, next) => {
  try {
    const data = req.body;
    const eventId = req.params.eventId;

    const spending = await spendingService.createSpending(eventId, data);
    res.status(201).json({ spending: spendingDto(spending) });
  } catch (err) {
    next(err);
  }
};

const updateSpending = async (req, res, next) => {
  try {
    const { spendingId, eventId } = req.params;
    const data = req.body;

    const spending = await spendingService.updateSpending(spendingId, eventId, data);
    res.status(200).json({ spending: spendingDto(spending) });
  } catch (err) {
    next(err);
  }
};

const deleteSpending = async (req, res, next) => {
  try {
    const { spendingId } = req.params;

    await spendingService.deleteSpending(spendingId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteSpendingByIdAndEvent = async (req, res, next) => {
  try {
    const { spendingId, eventId } = req.params;

    await spendingService.deleteSpendingByIdAndEvent(spendingId, eventId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  getSpendingsByEventAndOrganizer,
  getSpendingById,
  createSpending,
  updateSpending,
  deleteSpending,
  deleteSpendingByIdAndEvent,
};
