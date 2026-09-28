import { Request, Response } from "express";
import Notification from "../entities/Notification.js";
import { AppSource } from "../config/db.js";

const notificationRepo = AppSource.getRepository(Notification);

const notificationResponse = (notification: Notification) => ({
  id: notification.id,
  message: notification.message,
  read: notification.read,
  createdAt: notification.createdAt,
  user: notification.user
    ? { id: notification.user.id, name: notification.user.name }
    : null,
  ticket: notification.ticket
    ? {
        id: notification.ticket.id,
        title: notification.ticket.title,
        status: notification.ticket.status,
        dueAt: notification.ticket.dueAt,
      }
    : null,
});

const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const notifications = await notificationRepo.find({
      where: { user: { id: userId } },
      relations: { user: true, ticket: true },
    });

    return res.status(200).json({
      success: true,
      message: notifications.length
        ? "Notifications found successfully"
        : "No notifications for this user",
      data: notifications.map(notificationResponse),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: `Failed to find notifications: [${error.message}]`,
      });
    }
    return res.status(500).json({
      success: false,
      message: `Failed to find notifications: ${error}`,
    });
  }
};

export { getAllNotifications };
