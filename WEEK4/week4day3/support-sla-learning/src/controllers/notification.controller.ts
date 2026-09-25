import { Request, Response } from "express";
import Notification from "../entities/Notification.js";
import { AppSource } from "../config/db.js";

const notificationRepo = AppSource.getRepository(Notification);

const notificationResponse = (notification: Notification) => ({
  id: notification.id,
  message: notification.message,
  read: notification.read,
});

const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await notificationRepo.find();
    if (notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Failed to find notifications",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Notifications found successfully",
      data: notifications.map((notification) =>
        notificationResponse(notification),
      ),
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
