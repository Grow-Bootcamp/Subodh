// ==========================================
// MONGOOSE LEARNING TASK: NOTIFICATION
// ==========================================
//
// A notification should eventually represent:
// "This agent has an SLA reminder for this ticket."
//
// Possible fields:
//
// - user
// - ticket
// - message
// - read
// - createdAt
//
// Tasks:
//
// 1. Design the schema.
// 2. Decide which fields should reference
//    other collections.
// 3. Configure those references.
// 4. Think about how populate() could later
//    retrieve the related documents.
//
// ------------------------------------------
// HINT:
//
// This model will likely have TWO references:
// one to User and one to Ticket.
//
// The CRON job will create these documents.
// GET /notifications/:userId will read them.
//
// IMPLEMENT THIS YOURSELF.

export {};
