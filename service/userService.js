import User from "../models/user.js";
import AppError from "../utils/AppError.js";

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

export default { getUser, updateUser };
