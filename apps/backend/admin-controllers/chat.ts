import { Request, Response } from "express";
import prisma from "db/client";

export const createOrGetChat = async(req:Request,res:Response):Promise<void> => {
    try {
        const { jobId, userId } = req.body;
        const adminId = (req as any).admin.id;

        if(!jobId || !userId) {
            res.status(400).json({ success: false, error: "jobId and userId are required" });
            return;
        }

        const job = await prisma.job.findUnique({
            where: { id: Number(jobId) },
          });

        if (!job || job.adminId !== adminId) {
            res.status(403).json({ success: false, error: "You are not authorized for this job" });
            return;
        }

        let chat = await prisma.chat.findFirst({
            where: {
              jobId: Number(jobId),
              userId: Number(userId),
              adminId: adminId,
            },
            include: {
              messages: {
                orderBy: { createdAt: "asc" }, 
              },
            },
          });

        if(!chat) {
            chat = await prisma.chat.create({
                data: {
                    jobId: Number(jobId),
                    userId: Number(userId),
                    adminId: adminId,
                },
                include: {
                    messages: true,
                  },
            });
        }
        res.status(200).json({
            success: true,
            chat,
        });
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}


export const adminSendMessage = async(req:Request,res:Response):Promise<void> => {
    try {
        const {chatId, content} = req.body;
        const adminId = (req as any).admin.id;

        if(!chatId || !content) {
            res.status(400).json({ success: false, error: "chatId and content are required" });
            return;
        }

        const chat = await prisma.chat.findUnique({
            where: {
                id: Number(chatId)
            }
        });

        if(!chat || chat.adminId !== adminId) {
            res.status(403).json({ success: false, error: "You are not authorized to send message in this chat" });
            return;
        }

        const message = await prisma.message.create({
            data: {
                chatId : Number(chatId),
                senderId : adminId,
                content
            },
        });

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("Error sending admin message:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}


export const getChatMessages = async(req:Request,res:Response): Promise<void> => {
    try {
        const {chatId} = req.params;
        const adminId = (req as any).admin.id;

        if (!chatId) {
            res.status(400).json({ success: false, error: "chatId is required" });
            return;
          }
        
          const chat = await prisma.chat.findUnique({
            where : {
                id: Number(chatId)
            }
          })

          if (!chat) {
            res.status(404).json({ success: false, error: "Chat not found" });
            return;
          }

          if (adminId && chat.adminId !== adminId) {
            res.status(403).json({ success: false, error: "Not authorized" });
            return;
          }

          const messages = await prisma.message.findMany({
            where : { chatId: Number(chatId)},
            orderBy : { createdAt: "asc"}
          });

          res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}