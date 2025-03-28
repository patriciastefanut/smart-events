import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";


const register = async (data) => {
  
  const { firstname, lastname, email, password } = data;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists.');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  
  
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

export default { register };
