import express from "express";
import eventController from "../controller/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/drafts", eventController.createEventPlanDraft);
router.post("/", eventController.createEvent);

export default router;
