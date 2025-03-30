import path from "path";
import dotenv from "dotenv";
import express from "express";
import connectToDb from "./db.js";

import authRouter from "./router/authRouter.js";
import userRouter from "./router/userRouter.js";

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_NAME, PORT } = process.env;
await connectToDb(DB_USER, DB_PASSWORD, DB_NAME);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("./uploads"));

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Working." });
});
app.use("/api", authRouter);
app.use("/api/users", userRouter);

app.use((err, req, res, next) => {
  if (!err) next();
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
