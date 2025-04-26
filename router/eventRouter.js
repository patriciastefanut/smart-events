import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import eventController from "../controller/eventController.js";
import invitationController from "../controller/invitationController.js";
import participantController from "../controller/participantController.js";
import feedbackController from "../controller/feedbackController.js";

const router = express.Router();

// Feedbacks
router.post("/:eventId/feedbacks", feedbackController.createFeedback);
router.get("/:eventId/feedbacks/:uuid", feedbackController.getFeedback);

router.use(authMiddleware);
router.get("/:eventId/feedbacks", feedbackController.getAllFeedbacks);


// Events
router.post("/drafts", eventController.createEventPlanDraft);
router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEventsByUser);
router.get("/:eventId", eventController.getEventByIdAndUser);
router.patch("/:eventId", eventController.updateEvent);
router.delete("/:eventId", eventController.deleteEvent);

// Invitations
router.post("/:eventId/invitations", invitationController.sendInvitations);
router.get("/:eventId/invitations", invitationController.getInvitationsByEventAndOrganizer);
router.post("/:eventUUID/invitations/:invitationUUID", invitationController.respondToInvitation);
router.delete("/:eventUUID/invitations/:invitationUUID", invitationController.cancelInvitation);

// Participants
router.get("/:eventId/participants", participantController.getParticipantsByEvent);
router.get("/:eventId/participants/:participantId", participantController.getParticipantByIdAndEvent);
router.patch("/:eventId/participants/:participantId", participantController.updateParticipant);
router.delete("/:eventId/participants/:participantId", participantController.deleteParticipant);



export default router;
