import invitationService from "../service/invitationService.js";

const sendInvitations = async (req, res, next) => {
  const { invitations, errors } = await invitationService.sendInvitations(
    req.params.eventId,
    req.user._id,
    req.body
  );
  res.status(201).json({ invitations, errors });
  try {
  } catch (err) {
    next(err);
  }
};

const respondToInvitation = async (req, res, next) => {
  try {
    const { eventUUID, invitationUUID } = req.params;
    const data = req.body;

    const invitation = await invitationService.respondToInvitation(
      eventUUID,
      invitationUUID,
      data
    );

    res.status(200).json({ invitation });
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

export default { sendInvitations, respondToInvitation, cancelInvitation };
