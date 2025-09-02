import { Request, Response } from "express";
import prisma from "db/client";

export const getAdminChats = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as any).admin.id;
      if (!adminId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const chats = await prisma.chat.findMany({
        where: { adminId },
        include: {
          user: {
            include: { profile: true },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1, 
          },
        },
      });
      res.status(200).json({ success: true, chats });
    }
    catch (error) {
        console.error("Error fetching admin chats:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
}

export const getAdminChatMessages = async (req: Request, res: Response): Promise<void> => {
 try {
    const { chatId } = req.params;
    const adminId = (req as any).admin.id;
    const chat = await prisma.chat.findUnique({
        where: { id: Number(chatId) },
    });
    if(!chat || chat.adminId !== adminId) {
       res.status(403).json({ success: false, error: "Not authorized" });
       return;
     }

    const messages = await prisma.message.findMany({
        where: { chatId: chat.id },
        orderBy: { createdAt: "asc" },
    });
    res.status(200).json({ success: true, messages });
 } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
 }
}

export const sendAdminMessage = async(req:Request,res:Response):Promise<void>=> {
    try {
      const adminId = (req as any).admin.id;
      const { chatId } = req.params;
      const { content } = req.body;

      if (!content) {
        res.status(400).json({ success: false, error: "Message content required" });
        return;
      }

      const chat = await prisma.chat.findUnique({
        where: { id: Number(chatId) },
      });
  
      if (!chat || chat.adminId !== adminId) {
        res.status(403).json({ success: false, error: "Not authorized" });
        return;
      }

      const message = await prisma.message.create({
        data: {
          chatId: chat.id,
          senderId: adminId,
          senderType: "admin",
          content,
        },
      });

      res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("Error sending message:", error);
       res.status(500).json({ success: false, error: "Internal server error" });
    }
}

export const getOrCreateAdminChat = async(req:Request,res:Response) : Promise<void> => {
  try {
    const adminId = (req as any).admin.id;
    const { userId } = req.params;
    if (!adminId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (!userId) {
      res.status(400).json({ success: false, error: "User ID is required" });
      return;
    }

    let chat = await prisma.chat.findUnique({
      where: {
        adminId_userId: {
          adminId:adminId,
          userId:Number(userId)
        },
      },
      include : {
        user: { include: { profile: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, 
        },
      },
    });
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          adminId: Number(adminId),
          userId: Number(userId),
        },
        include: {
          user: { include: { profile: true } },
          messages: true,
        },
      });
    }

    res.status(200).json({
      chat
    });
  } catch (error) {
    console.error("Error getting/creating chat:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}