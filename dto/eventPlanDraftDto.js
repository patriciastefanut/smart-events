export default function (e) {
  return {
    id: e._id,
    createdBy: e.createdBy,
    input: {
      eventType: e.input?.eventType,
      from: e.input?.from,
      until: e.input?.until,
      location: e.input?.location,
      guestCount: e.input?.guestCount,
      budget: e.input?.budget,
      currency: e.input?.currency,
      preferences: e.input?.preferences || [],
      vibe: e.input?.vibe,
      specialRequests: e.input?.specialRequests || [],
    },
    suggestion: {
      title: e.suggestion.title,
      type: e.suggestion.type,
      description: e.suggestion.description,
      from: e.suggestion.from,
      until: e.suggestion.until,
      guestCount: e.suggestion.guestCount,
      locations:
        e.suggestion.locations?.map((loc) => ({
          name: loc.name,
          address: loc.address,
          cost: loc.cost,
        })) || [],
      budget: {
        venue: e.suggestion.budget?.venue,
        catering: e.suggestion.budget?.catering,
        equipment: e.suggestion.budget?.equipment,
        staff: e.suggestion.budget?.staff,
        miscellaneous: e.suggestion.budget?.miscellaneous,
      },
      currency: e.suggestion.currency,
      schedule:
        e.suggestion.schedule?.map((s) => ({
          time: s.time,
          activity: s.activity,
        })) || [],
      requiredStaff: e.suggestion.requiredStaff || [],
      notes: e.suggestion.notes || [],
    },
  };
}
