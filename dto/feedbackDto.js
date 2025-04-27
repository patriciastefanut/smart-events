export default function (feedback) {
  return {
    id: feedback._id,
    event: feedback.event,
    email: feedback.email,
    rating: feedback.rating,
    comment: feedback.comment,
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
  };
}
