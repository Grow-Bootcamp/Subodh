import { Request, Response } from "express";

const createTicket = async (req: Request, res: Response) => {
  const ticket = req.body;
  //   const ticket = req.body as CreateTicketBody;

  if (
    typeof ticket !== "object" ||
    ticket === null ||
    typeof ticket.title !== "string" ||
    typeof ticket.description !== "string" ||
    typeof ticket.priority !== "string"
  ) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }
};

const getAllTickets = async (req: Request, res: Response) => {};

const getTicketById = async (req: Request, res: Response) => {};

export { createTicket, getAllTickets, getTicketById };
