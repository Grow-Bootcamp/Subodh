import cron from "node-cron";
import { AppSource } from "../config/db.js";
import Ticket, { TicketStatus } from "../entities/Ticket.js";
import Notification from "../entities/Notification.js";
import { In, LessThan } from "typeorm";

export function startSlaReminderJob() {
  const ticketRepo = AppSource.getRepository(Ticket);
  const notificationRepo = AppSource.getRepository(Notification);

  return cron.schedule(
    "* * * * *",
    async () => {
      try {
        console.log("[CRON]: checking overdue tickets...");

        const overdueTickets = await ticketRepo.find({
          where: {
            dueAt: LessThan(new Date()),
            status: In([TicketStatus.OPEN, TicketStatus.IN_PROGRESS]),
            slaReminderSent: false,
          },
          relations: { assignedTo: true }, // populate equivalent
        });

        if (overdueTickets.length === 0) return;

        for (const ticket of overdueTickets) {
          const ticketNotification = notificationRepo.create({
            message: `Notification for ${ticket.title} with ${ticket.priority} priority. Assigned to ${ticket.assignedTo.name} agent`,
            user: ticket.assignedTo,
            ticket: ticket,
          });

          await notificationRepo.save(ticketNotification);

          //Here you have to emit Notification with WebSocket and listen on assigned agent(ticket.assignedTo) client for it
          ticket.slaReminderSent = true;
          await ticketRepo.save(ticket);

          console.log(`[CRON]: notification created for ticket ${ticket.id}`);
        }
      } catch (error) {
        console.error("[CRON]: sla reminder job failed:", error);
      }
    },

    {
      name: "sla-notification",
      timezone: "Asia/Kathmandu",
      noOverlap: true,
    },
  );
}
