import Spending from "../models/spending.js";
import AppError from "../utils/AppError.js";
import eventService from "./eventService.js";

const createSpending = async (eventId, data) => {
  return await Spending.create({
    event: eventId,
    title: data.title,
    description: data.description,
    category: data.category,
    amount: data.amount,
    currency: data.currency,
    paidBy: data.paidBy,
    paymentMethod: data.paymentMethod,
    date: data.date,
    notes: data.notes,
    isReimbursable: data.isReimbursable,
  });
};

const getSpendingById = async (id) => {
  const spending = await Spending.findById(id);
  if (!spending) {
    throw new AppError("Spending not found", 404);
  }
  return spending;
};

const getSpendingsByEventAndOrganizer = async (eventId, userId) => {
  const event = await eventService.getEventById(eventId);
  if (event.createdBy.toString() !== userId.toString()) {
    throw new AppError("You are not the creator of this event.", 403);
  }

  const spendings = await Spending.find({ event: eventId });
  return spendings;
};

const updateSpending = async (id, eventId, data) => {
  const spending = await Spending.findOne({ _id: id, event: eventId });
  if (!spending) {
    throw new AppError("Spending not found", 404);
  }

  spending.title = data.title || spending.title;
  spending.description = data.description || spending.description;
  spending.category = data.category || spending.category;
  spending.amount = data.amount ?? spending.amount;
  spending.currency = data.currency || spending.currency;
  spending.paidBy = data.paidBy || spending.paidBy;
  spending.paymentMethod = data.paymentMethod || spending.paymentMethod;
  spending.date = data.date || spending.date;
  spending.notes = data.notes || spending.notes;
  spending.isReimbursable = data.isReimbursable ?? spending.isReimbursable;

  return await spending.save();
};

const deleteSpending = async (id) => {
  const deleted = await Spending.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError("Failed to delete spending", 400);
  }
};

const deleteSpendingByIdAndEvent = async (id, eventId) => {
  const deleted = await Spending.findOneAndDelete({ _id: id, event: eventId });
  if (!deleted) {
    throw new AppError("Failed to delete spending", 400);
  }
};

export default {
  createSpending,
  getSpendingById,
  getSpendingsByEventAndOrganizer,
  updateSpending,
  deleteSpending,
  deleteSpendingByIdAndEvent,
};
