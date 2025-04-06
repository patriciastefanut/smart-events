import Participant from "../models/participant.js";
import AppError from "../utils/AppError.js";

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

export default {
  createParticipant,
  getParticipantByEventAndInvitation,
  deleteParticipant,
};
