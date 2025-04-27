export default function (invitation) {
  return {
    id: invitation._id,
    event: invitation.event,
    email: invitation.email,
    firstname: invitation.firstname,
    lastname: invitation.lastname,
    status: invitation.status,
    sentAt: invitation.sentAt,
    respondedAt: invitation.respondedAt,
    respondBefore: invitation.respondBefore,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
  };
}
