import { Message, User } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class MessageController {
  // Отправка сообщения
  async sendMessage(req, res, next) {
    try {
      const { receiverId, text } = req.body;
      const senderId = req.user.id;

      // Проверка, что получатель существует
      const receiver = await User.findByPk(receiverId);
      if (!receiver) {
        return next(ApiError.badRequest("Получатель не найден"));
      }

      // Нельзя отправлять сообщения самому себе
      if (senderId === receiverId) {
        return next(ApiError.badRequest("Нельзя отправлять сообщения себе"));
      }

      const message = await Message.create({
        text,
        senderId,
        receiverId,
        isRead: false,
      });

      // Получаем сообщение с данными отправителя и получателя
      const fullMessage = await Message.findByPk(message.id, {
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "firstName", "lastName", "avatar"],
          },
          {
            model: User,
            as: "receiver",
            attributes: ["id", "firstName", "lastName", "avatar"],
          },
        ],
      });

      return res.status(201).json(fullMessage);
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }

  // Получение диалога между пользователями
  async getDialog(req, res, next) {
    try {
      const { interlocutorId } = req.params;
      const currentUserId = req.user.id;
      const { limit = 50, offset = 0 } = req.query;

      const messages = await Message.findAndCountAll({
        where: {
          [Op.or]: [
            { senderId: currentUserId, receiverId: interlocutorId },
            { senderId: interlocutorId, receiverId: currentUserId },
          ],
        },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "firstName", "lastName", "avatar"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      // Помечаем сообщения как прочитанные
      await Message.update(
        { isRead: true },
        {
          where: {
            senderId: interlocutorId,
            receiverId: currentUserId,
            isRead: false,
          },
        }
      );

      return res.json(messages);
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }

  // Получение списка диалогов (последние сообщения с каждым пользователем)
  async getDialogsList(req, res, next) {
    try {
      const currentUserId = req.user.id;

      // Сырой запрос для получения последнего сообщения в каждом диалоге
      const dialogs = await Message.findAll({
        attributes: [
          [sequelize.fn("MAX", sequelize.col("Message.id")), "lastMessageId"],
        ],
        where: {
          [Op.or]: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        },
        group: [
          sequelize.fn(
            "LEAST",
            sequelize.col("senderId"),
            sequelize.col("receiverId")
          ),
          sequelize.fn(
            "GREATEST",
            sequelize.col("senderId"),
            sequelize.col("receiverId")
          ),
        ],
        raw: true,
      });

      // Получаем полные данные сообщений
      const lastMessages = await Message.findAll({
        where: {
          id: dialogs.map((d) => d.lastMessageId),
        },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "firstName", "lastName", "avatar"],
          },
          {
            model: User,
            as: "receiver",
            attributes: ["id", "firstName", "lastName", "avatar"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Добавляем флаг "isCurrentUserSender" и количество непрочитанных
      const enhancedDialogs = await Promise.all(
        lastMessages.map(async (message) => {
          const interlocutorId =
            message.senderId === currentUserId
              ? message.receiverId
              : message.senderId;

          const unreadCount = await Message.count({
            where: {
              senderId: interlocutorId,
              receiverId: currentUserId,
              isRead: false,
            },
          });

          return {
            ...message.toJSON(),
            isCurrentUserSender: message.senderId === currentUserId,
            interlocutor:
              message.senderId === currentUserId
                ? message.receiver
                : message.sender,
            unreadCount,
          };
        })
      );

      return res.json(enhancedDialogs);
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }

  // Пометить сообщения как прочитанные
  async markAsRead(req, res, next) {
    try {
      const { interlocutorId } = req.params;
      const currentUserId = req.user.id;

      await Message.update(
        { isRead: true },
        {
          where: {
            senderId: interlocutorId,
            receiverId: currentUserId,
            isRead: false,
          },
        }
      );

      return res.json({ success: true });
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }
}

const messageController = new MessageController();
export default messageController;
