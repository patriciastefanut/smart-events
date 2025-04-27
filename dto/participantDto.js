export default function (participant) {
  return {
    id: participant._id,
    event: participant.event,
    invitation: participant.invitation,
    email: participant.email,
    firstname: participant.firstname,
    lastname: participant.lastname,
    notes: participant.notes,
    dietaryRestrictions: participant.dietaryRestrictions,
    checkedIn: participant.checkedIn,
    createdAt: participant.createdAt,
    updatedAt: participant.updatedAt,
  };
}
