import { Router } from "express";
import messageController from "../controllers/messageController.js";
import authFunction from "../middlewares/authMiddleware.js";

const messageRouter = new Router();

// Отправка сообщения
messageRouter.post("/", authFunction, messageController.sendMessage);

// Получение диалога с пользователем
messageRouter.get(
  "/dialog/:interlocutorId",
  authFunction,
  messageController.getDialog
);

// Список диалогов (последние сообщения)
messageRouter.get("/dialogs", authFunction, messageController.getDialogsList);

// Пометить сообщения как прочитанные
messageRouter.patch(
  "/read/:interlocutorId",
  authFunction,
  messageController.markAsRead
);

export default messageRouter;
