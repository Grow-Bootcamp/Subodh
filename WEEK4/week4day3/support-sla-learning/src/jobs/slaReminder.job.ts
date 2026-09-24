// ==========================================
// CRON LEARNING TASK
// ==========================================
//
// REAL-WORLD PROBLEM:
//
// Support agents should not have to manually
// check the database for overdue tickets.
//
// A background job should periodically check.
//
// Your task:
//
// 1. Learn the node-cron API.
// 2. Create a recurring scheduled task.
// 3. Run it every minute while developing.
// 4. Find overdue tickets.
// 5. Ignore resolved tickets.
// 6. Ignore tickets already reminded.
// 7. Create a Notification.
// 8. Mark the Ticket as reminded.
//
// ------------------------------------------
// CRON QUESTIONS:
//
// What is a CRON job?
// How is it different from an Express endpoint?
// Why does it run without an HTTP request?
// What does `* * * * *` mean?
// What happens when the Node.js process stops?
//
// ------------------------------------------
// DUPLICATE WORK:
//
// Think about what happens if:
//
// Job starts
//    ↓
// Job takes a long time
//    ↓
// Scheduler triggers again
//
// Research and decide whether node-cron's
// overlap protection should be used.
//
// IMPLEMENT THIS YOURSELF.
//
// ------------------------------------------
// CRON FIELD ORDER
//
// minute
// hour
// day of month
// month
// day of week
//
// Examples:
//
// * * * * *       every minute
// */5 * * * *     every 5 minutes
// 0 * * * *       every hour
// 0 8 * * *       every day at 8 AM
//
// ------------------------------------------
// LEARNING TASK:
//
// Write these yourself:
//
// 1. Every minute
// 2. Every 5 minutes
// 3. Every hour
// 4. Every day at 8 AM
//
// Also learn how to configure:
// Asia/Kathmandu
//
// Do not copy the final scheduler configuration.
//
// ------------------------------------------
// FLOW YOU WILL IMPLEMENT (do not paste a solution):
//
// CRON fires
//   → query tickets where dueAt is in the past
//     AND status is not resolved
//     AND slaReminderSent is false
//   → for each ticket, create a Notification for assignedTo
//   → set slaReminderSent = true on that ticket
//
// This prevents duplicate reminders on later runs.

export {};
