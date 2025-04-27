import userDto from "../dto/userDto.js";
import userService from "../service/userService.js";
import AppError from "../utils/AppError.js";

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await userService.getUser(userId);
    res.status(200).json({
      user: userDto(user),
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await userService.updateUser(userId, req.body);
    res.status(200).json({
      user: userDto(user),
    });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await userService.updatePassword(userId, req.body);
    res.status(200).json({
      message: "Password updated",
    });
  } catch (err) {
    next(err);
  }
};

const addProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("No image provided", 422);
    }

    const userId = req.params.userId;

    const profilePicture = await userService.addProfilePicture(userId, req.file);

    res.status(200).json({
      profilePicture,
    });
  } catch (err) {
    next(err);
  }
};

export default { getUser, updateUser, updatePassword, addProfilePicture };
