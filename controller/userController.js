import userService from "../service/userService.js";

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await userService.getUser(userId);
    res.status(200).json({
      user,
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
      user,
    });
  } catch (err) {
    next(err);
  }
};

export default { getUser, updateUser };
