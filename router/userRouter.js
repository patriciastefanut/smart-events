import express from "express";
import { body } from "express-validator";
import userController from "../controller/userController.js";

const router = express.Router();

router.get("/:userId", userController.getUser);
router.patch(
  "/:userId",
  [
    body("firstname")
      .optional()
      .notEmpty()
      .withMessage("Firstname is required"),
    body("lastname").optional().notEmpty().withMessage("Lastname is required"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email is required")
      .normalizeEmail(),
  ],
  userController.updateUser
);
router.patch(
  "/:userId/password",
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ],
  userController.updatePassword
);

export default router;
