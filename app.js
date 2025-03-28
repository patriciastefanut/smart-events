import dotenv from "dotenv";
import express from "express";
import connectToDb from "./db.js";

import authRouter from "./router/authRouter.js";

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_NAME, PORT } = process.env;
await connectToDb(DB_USER, DB_PASSWORD, DB_NAME);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Working." });
});
app.use("/api", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found." });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
