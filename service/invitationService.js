import { v4 as uuidv4 } from "uuid";
import emailService from "./emailService.js";
import eventService from "./eventService.js";
import Invitation from "../models/invitation.js";
import AppError from "../utils/AppError.js";
import participantService from "./participantService.js";
import invitation from "../models/invitation.js";

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
    firstname: data.firstname,
    lastname: data.lastname,
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
  console.log(data.contacts);
  for (const contact of data.contacts) {
    try {
      const invitation = await createInvitation({
        eventId,
        respondBefore: data.respondBefore,
        ...contact,
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
      eventId: event._id,
      invitationId: invitation._id,
      email: invitation.email,
      firstname: invitation.firstname,
      lastname: invitation.lastname,
    });
  }

  invitation.status = status;
  invitation.respondedAt = Date.now();

  await emailService.sendEventConfirmationMail({
    eventUUID: event.uuid,
    eventTitle: event.title,
    eventFrom: event.from,
    eventLocationName: event.location.name,
    eventLocationAddress: event.location.address,
    invitationUUID: invitation.uuid,
    invitationStatus: invitation.status,
    userFirstname: invitation.firstname,
    userEmail: invitation.email,
    respondBefore: formatDate(invitation.respondBefore),
  });

  return await invitation.save();
};

const cancelInvitation = async (eventUUID, invitationUUID) => {
  const event = await eventService.getEventByUUID(eventUUID);
  const invitation = await getInvitationByUUIDAndEvent(
    invitationUUID,
    event._id
  );

  if (invitation.status !== "accepted") {
    throw new AppError("Cannot cancel invitation", 400);
  }

  const participant =
    await participantService.getParticipantByEventAndInvitation(
      event._id,
      invitation._id
    );

  const emailInfo = {
    eventTitle: event.title,
    userEmail: participant.email,
    userFirstname: participant.firstname,
  };

  await participantService.deleteParticipant(participant._id);
  invitation.status = 'cancelled';
  await invitation.save();
  await emailService.sendCancelInvitationMail(emailInfo);
};

const getInvitationsByEventAndOrganizer = async (eventId, organizerId) => {
  const event = await eventService.getEventById(eventId);
  if (event.createdBy.toString() !== organizerId.toString()) {
    throw new AppError("You are not the organizer of the event", 403);
  }
  const invitations = await Invitation.find({ event: eventId });
  return invitations;
};

export default {
  sendInvitations,
  respondToInvitation,
  cancelInvitation,
  getInvitationsByEventAndOrganizer,
};
