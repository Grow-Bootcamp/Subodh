import { Request, Response } from "express";
import { AppSource } from "../config/db.js";
import Ticket, { TicketPriority } from "../entities/Ticket.js";

const ticketResponse = (ticket: Ticket) => {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    dueAt: ticket.dueAt,
    slaReminderSent: ticket.slaReminderSent,
    status: ticket.status,
  };
};

const ticketRepo = AppSource.getRepository(Ticket);

const createTicket = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (
      typeof data !== "object" ||
      data === null ||
      typeof data.title !== "string" ||
      typeof data.description !== "string" ||
      !Object.values(TicketPriority).includes(data.priority) ||
      typeof data.userId !== "string" ||
      typeof data.dueAt !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const newTicket = ticketRepo.create({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueAt: new Date(data.dueAt),
      assignedTo: {
        id: data.userId,
      },
    });

    const ticket = await ticketRepo.save(newTicket);

    return res.status(201).json({
      success: true,
      message: "Ticket successfully created",
      data: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        dueAt: ticket.dueAt,
        status: ticket.status,
        assignedTo: ticket.assignedTo,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create ticket",
    });
  }
};

const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketRepo.find();
    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tickets found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Tickets found successfully",
      data: tickets,
    });
  } catch (error) {
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
    const ticket = await ticketRepo.findOneBy({ id: ticketId });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket with the requested id not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Ticket with requested id found successfully",
      data: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        dueAt: ticket.dueAt,
        status: ticket.status,
        assignedTo: ticket.assignedTo,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get ticket with requested id",
    });
  }
};

export { createTicket, getAllTickets, getTicketById };
