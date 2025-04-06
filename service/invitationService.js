import { v4 as uuidv4 } from "uuid";
import sendEmail from "./emailService.js";
import eventService from "./eventService.js";
import Invitation from "../models/invitation.js";
import AppError from "../utils/AppError.js";

const createInvitation = async (eventId, email) => {
  return await Invitation.create({
    event: eventId,
    email: email,
    uuid: uuidv4(),
    sentAt: Date.now(),
  });
};

const sendInvitationEmail = async (data) => {
  const invitationLink = `http://localhost:4200/events/${data.eventUuid}/invitations/${data.invitationUuid}`;
  const subject = `Invitation to "${data.eventTitle}"`;
  const html = `
  <p>Dear ${data.userFirstname},</p>

  <p>You are invited to <b>${data.eventTitle}</b>.</p>
  <p>Event will take place on ${data.eventFrom} at ${data.eventLocationName} in ${data.eventLocationAddress}.</p>

  <p>Please click te link below to confirm or decline the participation at this event:</p>

  <a href="${invitationLink}">${invitationLink}</a>

  <p>Kind regards,</p>
  <p>The organizers</p>
  `;

  await sendEmail(data.userEmail, subject, html);
};

const sendInvitations = async (eventId, userId, data) => {
  const event = await eventService.getEventById(eventId);

  if (event.createdBy.toString() !== userId.toString())
    throw new AppError("You are not the organizer of this event", 403);

  const invitations = [];
  const errors = [];

  for (const contact of data.emails) {
    try {
      const invitation = await createInvitation(eventId, contact.email);
      await sendInvitationEmail({
        eventUuid: event.uuid,
        eventTitle: event.title,
        eventFrom: event.from,
        eventLocationName: event.location.name,
        eventLocationAddress: event.location.address,
        invitationUuid: invitation.uuid,
        userFirstname: contact.firstname,
        userEmail: contact.email,
      });

      invitations.push(invitation);
    } catch (err) {

      if (err.message.startsWith('E11000')) {
        err.message = `Invitation to ${contact.email} already sent`;
      }

      errors.push(err.message || "Internal server error");
      continue;
    }
  }

  return { invitations, errors };
};

export default { sendInvitations };
