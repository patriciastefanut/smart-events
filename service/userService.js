import fs from "fs/promises";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

const getUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);

  user.password = undefined;
  return user;
};

const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.email !== data.email) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }
  }

  user.firstname = data.firstname || user.firstname;
  user.lastname = data.lastname || user.lastname;
  user.email = data.email || user.email;

  const updated = await user.save();

  updated.password = undefined;
  return updated;
};

const updatePassword = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isCorrectPassword = await bcrypt.compare(
    data.currentPassword,
    user.password
  );
  if (!isCorrectPassword) {
    throw new AppError("Incorrect password.", 403);
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};

const addProfilePicture = async (id, file) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  console.log(file);

  const profilePicture = `./uploads/${user.profilePicture}`;
  const exists = await fileExists(profilePicture);

  if (exists) {
    await fs.unlink(profilePicture);
  }

  user.profilePicture = file.filename;
  await user.save();

  return user.profilePicture;
};

export default { getUser, updateUser, updatePassword, addProfilePicture };
