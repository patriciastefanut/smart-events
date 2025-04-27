export default function (user) {
  return {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
