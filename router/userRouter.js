import express from "express";
import userController from "../controller/userController.js";

const router = express.Router();

router.get("/:userId", userController.getUser);
router.patch("/:userId", userController.updateUser);
router.patch("/:userId/password", userController.updatePassword);

export default router;
