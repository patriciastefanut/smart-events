import invitationDto from "../dto/invitationDto.js";
import invitationService from "../service/invitationService.js";

const sendInvitations = async (req, res, next) => {
  try {
    const { invitations, errors } = await invitationService.sendInvitations(req.params.eventId, req.user._id, req.body);
    res.status(201).json({ invitations: invitations.map(invitationDto), errors });
  } catch (err) {
    next(err);
  }
};

const respondToInvitation = async (req, res, next) => {
  try {
    const { eventUUID, invitationUUID } = req.params;
    const data = req.body;

    const invitation = await invitationService.respondToInvitation(eventUUID, invitationUUID, data);

    res.status(200).json({ invitation: invitationDto(invitation) });
  } catch (err) {
    next(err);
  }
};

const cancelInvitation = async (req, res, next) => {
  try {
    const { eventUUID, invitationUUID } = req.params;
    await invitationService.cancelInvitation(eventUUID, invitationUUID);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getInvitationsByEventAndOrganizer = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const organizerId = req.user._id;

    const invitations = await invitationService.getInvitationsByEventAndOrganizer(eventId, organizerId);
    res.status(200).json({ invitations: invitations.map(invitationDto) });
  } catch (err) {
    next(err);
  }
};

const getInvitationByEventUUID = async (req, res, next) => {
  try {
    const eventUUID = req.params.eventUUID;
    const invitationUUID = req.params.invitationUUID;

    const invitation = await invitationService.getInvitationByEventUUID(invitationUUID, eventUUID);

    res.status(200).json({invitation: invitationDto(invitation)});
  } catch (err) {
    next(err);
  }
};

export default { sendInvitations, respondToInvitation, cancelInvitation, getInvitationsByEventAndOrganizer, getInvitationByEventUUID };
