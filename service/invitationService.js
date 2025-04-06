import { v4 as uuidv4 } from "uuid";
import emailService from "./emailService.js";
import eventService from "./eventService.js";
import Invitation from "../models/invitation.js";
import AppError from "../utils/AppError.js";
import participantService from "./participantService.js";

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInvitation = async (data) => {
  return await Invitation.create({
    event: data.eventId,
    email: data.email,
    uuid: uuidv4(),
    sentAt: Date.now(),
    respondBefore: data.respondBefore,
  });
};

const getInvitationByUUIDAndEvent = async (uuid, eventId) => {
  const invitation = await Invitation.findOne({ uuid, event: eventId });
  if (!invitation) throw new AppError("Invitation not found");

  return invitation;
};

const sendInvitations = async (eventId, userId, data) => {
  const event = await eventService.getEventById(eventId);

  if (event.createdBy.toString() !== userId.toString())
    throw new AppError("You are not the organizer of this event", 403);

  const invitations = [];
  const errors = [];

  for (const contact of data.emails) {
    try {
      const invitation = await createInvitation({
        eventId,
        email: contact.email,
        respondBefore: data.respondBefore,
      });
      await emailService.sendInvitationEmail({
        eventUUID: event.uuid,
        eventTitle: event.title,
        eventFrom: event.from,
        eventLocationName: event.location.name,
        eventLocationAddress: event.location.address,
        invitationUUID: invitation.uuid,
        userFirstname: contact.firstname,
        userEmail: contact.email,
        respondBefore: formatDate(invitation.respondBefore),
      });

      invitations.push(invitation);
    } catch (err) {
      if (err.message.startsWith("E11000")) {
        err.message = `Invitation to ${contact.email} already sent`;
      }

      errors.push(err.message || "Internal server error");
      continue;
    }
  }

  return { invitations, errors };
};

const respondToInvitation = async (eventUUID, invitationUUID, data) => {
  const event = await eventService.getEventByUUID(eventUUID);
  const invitation = await getInvitationByUUIDAndEvent(
    invitationUUID,
    event._id
  );

  if (invitation.status !== "pending") {
    throw new AppError(`Invitation already ${invitation.status}`, 400);
  }

  if (invitation.respondBefore <= Date.now()) {
    throw new AppError("Too late to respond to invitation", 422);
  }

  const status = data.status;
  if (status === "accepted") {
    await participantService.createParticipant({
      ...data,
      email: invitation.email,
      eventId: event._id,
      invitationId: invitation._id,
    });
  }

  invitation.status = status;
  invitation.respondedAt = Date.now();
  return await invitation.save();
};

export default { sendInvitations, respondToInvitation };
