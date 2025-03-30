import jwt from "jsonwebtoken";
import userService from "../service/userService.js";
import AppError from "../utils/AppError.js";


export default (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new AppError("Authorization header is missing", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Token is missing", 401);
    }

    const SECRET_KEY = process.env.JWT_SECRET;

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      try {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await userService.getUser(decoded.id);
        if (!user) {
          throw new AppError("User not found", 404);
        }

        req.user = user;
        next();
      } catch (err) {
        res.status(err.statusCode || 500).json({
          message: err.message || "Internal server error",
        });
      }
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error",
    });
  }
};
