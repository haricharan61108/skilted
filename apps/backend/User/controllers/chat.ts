import { Request,Response } from "express";
import prisma from "db/client";


export const getUserChats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
  
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
  
      const chats = await prisma.chat.findMany({
        where: { userId: Number(userId) },
        include: {
          admin: { select: { id: true, email: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1, 
          },
        },
      });
  
      res.status(200).json({ success: true, chats });
    } catch (error) {
      console.error("Error fetching user chats:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };

  export const getUserChatMessages = async(req:Request,res:Response) : Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { adminId } = req.params;

      if(!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      if(!adminId) {
        res.status(400).json({ success: false, error: "Admin ID is required" });
        return;
      }

      const chat = await prisma.chat.findUnique({
        where : {
          adminId_userId: {
            adminId: Number(adminId),
            userId: Number(userId)
          },
        }
      })
      
      res.status(200).json({chat });


    } catch (error) {
      console.error("Error sending message:", error);
     res.status(500).json({ success: false, error: "Internal server error" });
    }
  }


  export const sendUserMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { chatId } = req.params;
      const { content } = req.body;
  
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
  
      if (!content) {
        res.status(400).json({ success: false, error: "Message content is required" });
        return;
      }
  
      const chat = await prisma.chat.findUnique({ where: { id: Number(chatId) } });
  
      if (!chat || chat.userId !== userId) {
        res.status(403).json({ success: false, error: "You are not part of this chat" });
        return;
      }
  
      const message = await prisma.message.create({
        data: {
          chatId: Number(chatId),
          senderId: userId,
          senderType: "user",
          content,
        },
      });
  
      res.status(201).json({ success: true, message });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };

  export const getUserMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { chatId } = req.params;
  
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
  
      const chat = await prisma.chat.findUnique({ where: { id: Number(chatId) } });
  
      if (!chat || chat.userId !== userId) {
        res.status(403).json({ success: false, error: "You are not part of this chat" });
        return;
      }
  
      const messages = await prisma.message.findMany({
        where: { chatId: Number(chatId) },
        orderBy: { createdAt: "asc" },
      });
  
      res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
