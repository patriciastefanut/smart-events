import User from "../models/user.js";
import AppError from "../utils/AppError.js";

const getUser = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new AppError('User not found', 404);

    user.password = undefined;
    return user;
}

export default {getUser};