const isCurrentUser = (_id, id) => _id.toString() === id;

export default (req, res, next) => {

  if (!isCurrentUser(req.user._id, req.params.userId)) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  next();
};
