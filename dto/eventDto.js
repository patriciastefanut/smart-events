export default function (e) {
  return {
    id: e._id,
    title: e.title,
    type: e.type,
    description: e.description,
    from: e.from,
    until: e.until,
    guestCount: e.guestCount,
    createdBy: e.createdBy,
    location: {
      name: e.location?.name,
      address: e.location?.address,
      cost: e.location?.cost,
    },
    budget: {
      venue: e.budget?.venue,
      catering: e.budget?.catering,
      equipment: e.budget?.equipment,
      staff: e.budget?.staff,
      miscellaneous: e.budget?.miscellaneous,
    },
    currency: e.currency,
    schedule:
      e.schedule?.map((s) => ({
        time: s.time,
        activity: s.activity,
      })) || [],
    requiredStaff: e.requiredStaff || [],
    notes: e.notes || [],
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}
