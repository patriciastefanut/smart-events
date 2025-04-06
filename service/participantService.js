import Participant from "../models/participant.js";

const createParticipant = async (data) => {
  return await Participant.create({
    event: data.eventId,
    invitation: data.invitationId,
    email: data.email,
    notes: data.notes,
    dietaryRestrictions: data.dietaryRestrictions,
  });
};

export default { createParticipant };
