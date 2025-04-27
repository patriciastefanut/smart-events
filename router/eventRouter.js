import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import eventController from "../controller/eventController.js";
import invitationController from "../controller/invitationController.js";
import participantController from "../controller/participantController.js";
import feedbackController from "../controller/feedbackController.js";

const router = express.Router();

// Public routes

// Feedbacks
router.post("/:eventUUID/feedbacks", feedbackController.createFeedback);
router.get("/:eventUUID/feedbacks/:feedbackUUID", feedbackController.getFeedback);
router.patch("/:eventUUID/feedbacks/:feedbackUUID", feedbackController.updateFeedback);
router.delete("/:eventUUID/feedbacks/:feedbackUUID", feedbackController.deleteFeedback);

// Invitations
router.post("/:eventUUID/invitations/:invitationUUID", invitationController.respondToInvitation);
router.delete("/:eventUUID/invitations/:invitationUUID", invitationController.cancelInvitation);

// Private routes

router.use(authMiddleware);

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

// Participants
router.get("/:eventId/participants", participantController.getParticipantsByEvent);
router.get("/:eventId/participants/:participantId", participantController.getParticipantByIdAndEvent);
router.patch("/:eventId/participants/:participantId", participantController.updateParticipant);
router.delete("/:eventId/participants/:participantId", participantController.deleteParticipant);

// Feedback
router.get("/:eventId/feedbacks", feedbackController.getAllFeedbacks);

export default router;
