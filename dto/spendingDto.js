export default function (spending) {
  return {
    id: spending._id,
    event: spending.event,
    title: spending.title,
    description: spending.description,
    category: spending.category,
    amount: spending.amount,
    currency: spending.currency,
    paidBy: spending.paidBy,
    paymentMethod: spending.paymentMethod,
    date: spending.date,
    notes: spending.notes,
    isReimbursable: spending.isReimbursable,
    createdAt: spending.createdAt,
    updatedAt: spending.updatedAt,
  };
}
