import userService from "../service/userService.js";

const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userService.getUser(userId);
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

export default { getUser };
