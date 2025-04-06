import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import eventController from "../controller/eventController.js";
import invitationController from "../controller/invitationController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/drafts", eventController.createEventPlanDraft);
router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEventsByUser);
router.get("/:eventId", eventController.getEventByIdAndUser);
router.patch("/:eventId", eventController.updateEvent);
router.delete("/:eventId", eventController.deleteEvent);

router.post("/:eventId/invitations", invitationController.sendInvitations);

export default router;
