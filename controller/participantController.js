import participantDto from "../dto/participantDto.js";
import participantService from "../service/participantService.js";

const getParticipantsByEventAndOrganizer = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;
    const participants = await participantService.getParticipantsByEventAndOrganizer(eventId, userId);
    res.status(200).json({ participants: participants.map(participantDto) });
  } catch (err) {
    next(err);
  }
};

const getParticipantByIdAndEvent = async (req, res, next) => {
  try {
    const { participantId, eventId } = req.params;
    
    const participant = await participantService.getParticipantByIdAndEvent(participantId, eventId);
    res.status(200).json({ participant: participantDto(participant) });
  } catch (err) {
    next(err);
  }
};

const updateParticipant = async (req, res, next) => {
  try {
    const { participantId, eventId } = req.params;
    const data = req.body;

    const participant = await participantService.updateParticipant(participantId, eventId, data);
    res.status(200).json({ participant: participantDto(participant) });
  } catch (err) {
    next(err);
  }
};

const deleteParticipant = async (req, res, next) => {
  try {
    const { participantId, eventId } = req.params;

    await participantService.deleteParticipant(participantId, eventId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  getParticipantsByEventAndOrganizer,
  getParticipantByIdAndEvent,
  updateParticipant,
  deleteParticipant,
};
