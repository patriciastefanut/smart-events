import Participant from "../models/participant.js";
import AppError from "../utils/AppError.js";
import eventService from "./eventService.js";

const createParticipant = async (data) => {
  return await Participant.create({
    event: data.eventId,
    invitation: data.invitationId,
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
    notes: data.notes,
    dietaryRestrictions: data.dietaryRestrictions,
  });
};

const getParticipantByEventAndInvitation = async (eventId, invitationId) => {
  const participant = await Participant.findOne({
    event: eventId,
    invitation: invitationId,
  });
  if (!participant) {
    throw new AppError("Participant not found", 404);
  }

  return participant;
};

const deleteParticipant = async (participantId) => {
  const deleted = await Participant.findByIdAndDelete(participantId);
  if (!deleted) {
    throw new AppError("Failed to delete participant", 400);
  }
};

const getParticipantsByEvent = async (eventId, userId) => {
  const event = await eventService.getEventById(eventId);
  if (event.createdBy.toString() !== userId.toString()) {
    throw new AppError("You are not the creator of this event.", 403);
  }

  const participants = await Participant.find({ event: eventId });
  return participants;
};

const getParticipantByIdAndEvent = async (id, eventId) => {
  const participant = await Participant.findOne({ _id: id, event: eventId });
  if (!participant) {
    throw new AppError("Participant not found", 404);
  }

  return participant;
};

const updateParticipant = async (id, eventId, data) => {
  const participant = await getParticipantByIdAndEvent(id, eventId);

  participant.firstname = data.firstname || participant.firstname;
  participant.lastname = data.lastname || participant.lastname;
  participant.notes = data.notes || participant.notes;
  participant.dietaryRestrictions = data.dietaryRestrictions || participant.dietaryRestrictions;
  participant.checkedIn = data.checkedIn || participant.checkedIn;

  return await participant.save();
};

export default {
  createParticipant,
  getParticipantsByEvent,
  getParticipantByIdAndEvent,
  getParticipantByEventAndInvitation,
  deleteParticipant,
  updateParticipant
};
