import { validationResult } from "express-validator";
import authService from "../service/authService.js";

const register = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }

    const data = await authService.register(req.body);

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({
      message: err.message || "Internal Server error.",
    });
  }
};

const login = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }

    const data = await authService.login(req.body);

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({
      message: err.message || "Internal Server error.",
    });
  }
};

export default { register, login };
