import invitationService from "../service/invitationService.js";

const sendInvitations = async (req, res, next) => {
  try {
    const {invitations, errors} = await invitationService.sendInvitations(
      req.params.eventId,
      req.user._id,
      req.body
    );
    res.status(201).json({ invitations, errors });
  } catch (err) {
    next(err);
  }
};

export default { sendInvitations };
