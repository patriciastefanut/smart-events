import express from "express";
import { body } from "express-validator";
import authController from "../controller/authController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("firstname").notEmpty().withMessage("Firstname is required."),
    body("lastname").notEmpty().withMessage("Lastname is required."),
    body("email").isEmail().withMessage("Email is required.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  authController.register
);

export default router;
