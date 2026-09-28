import { Request, Response } from "express";
import { AppSource } from "../config/db.js";
import Ticket, { TicketPriority } from "../entities/Ticket.js";
import User from "../entities/User.js";

const ticketRepo = AppSource.getRepository(Ticket);
const userRepo = AppSource.getRepository(User);

const ticketResponse = (ticket: Ticket) => ({
  id: ticket.id,
  title: ticket.title,
  description: ticket.description,
  priority: ticket.priority,
  dueAt: ticket.dueAt,
  slaReminderSent: ticket.slaReminderSent,
  status: ticket.status,
  assignedTo: ticket.assignedTo
    ? {
        id: ticket.assignedTo.id,
        name: ticket.assignedTo.name,
        email: ticket.assignedTo.email,
      }
    : null,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
});

const createTicket = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (
      typeof data !== "object" ||
      data === null ||
      typeof data.title !== "string" ||
      typeof data.description !== "string" ||
      !Object.values(TicketPriority).includes(data.priority) ||
      typeof data.assignedTo !== "string" ||
      typeof data.dueAt !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const dueAt = new Date(data.dueAt);
    if (Number.isNaN(dueAt.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid dueAt — must be a valid ISO date string",
      });
    }

    const assignedUser = await userRepo.findOneBy({ id: data.assignedTo });
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    const newTicket = ticketRepo.create({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueAt,
      assignedTo: assignedUser,
    });

    const ticket = await ticketRepo.save(newTicket);

    const saved = await ticketRepo.findOne({
      where: { id: ticket.id },
      relations: { assignedTo: true },
    });

    return res.status(201).json({
      success: true,
      message: "Ticket successfully created",
      data: ticketResponse(saved ?? ticket),
    });
  } catch (error) {
    console.error("[tickets] createTicket failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create ticket",
    });
  }
};

const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketRepo.find({
      relations: { assignedTo: true },
    });

    return res.status(200).json({
      success: true,
      message: tickets.length ? "Tickets found successfully" : "No tickets yet",
      data: tickets.map(ticketResponse),
    });
  } catch (error) {
    console.error("[tickets] getAllTickets failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all tickets",
    });
  }
};

const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    if (typeof ticketId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request format" });
    }

    const ticket = await ticketRepo.findOne({
      where: { id: ticketId },
      relations: { assignedTo: true },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket with the requested id not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket with requested id found successfully",
      data: ticketResponse(ticket),
    });
  } catch (error) {
    console.error("[tickets] getTicketById failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get ticket with requested id",
    });
  }
};

export { createTicket, getAllTickets, getTicketById };
