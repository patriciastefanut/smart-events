import { validationResult } from "express-validator";
import authService from "../service/authService.js";

const register = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }

    const token = await authService.register(req.body);

    res.status(201).json({
      message: "User registered",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message || "Internal Server error.",
    });
  }
};

export default { register };
