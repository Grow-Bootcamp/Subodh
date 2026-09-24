// ==========================================
// MONGOOSE LEARNING TASK: TICKET
// ==========================================
//
// This represents a customer support ticket.
//
// Think about fields such as:
//
// - title
// - description
// - status
// - priority
// - dueAt
// - assignedTo
// - slaReminderSent
//
// IMPORTANT RELATIONSHIP:
//
// Ticket ---> User
//
// assignedTo should eventually reference a User document.
//
// Your tasks:
//
// 1. Decide the appropriate Mongoose field types.
// 2. Create the schema.
// 3. Configure the User reference.
// 4. Understand what ObjectId represents.
// 5. Understand the purpose of `ref`.
//
// ------------------------------------------
// CONCEPT:
//
//   assignedTo: ObjectId  +  ref: "User"
//
// This stores only the User's _id on the ticket.
// populate() later replaces that _id with the full User document.
//
// DO NOT copy a completed implementation.
// Build the model yourself.

export {};
