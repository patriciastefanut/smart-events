import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const getJwt = (payload) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (data) => {
  const { firstname, lastname, email, password } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  const token = getJwt({ id: user._id, email: user.email });
  return token;
};

const login = async (data) => {
  const { email, password } = data;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error("User not found.");
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isCorrectPassword) {
    throw new Error("Incorrect password.");
  }

  const token = getJwt({ id: existingUser._id, email: existingUser.email });
  return token;
};

export default { register, login };
