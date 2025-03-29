import express from "express";
import userController from "../controller/userController.js";

const router = express.Router();

router.get("/:userId", userController.getUser);
router.patch("/:userId", userController.updateUser);

export default router;
