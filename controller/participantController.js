import participantService from "../service/participantService.js";

const getParticipantsByEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;
    const participants = await participantService.getParticipantsByEvent(
      eventId,
      userId
    );
    res.status(200).json({ participants });
  } catch (err) {
    next(err);
  }
};

const getParticipantByIdAndEvent = async (req, res, next) => {
  try {
    const { participantId, eventId } = req.params;
    const participant = await participantService.getParticipantByIdAndEvent(
      participantId,
      eventId
    );
    res.status(200).json({ participant });
  } catch (err) {
    next(err);
  }
};

export default { getParticipantsByEvent, getParticipantByIdAndEvent };
