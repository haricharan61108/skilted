import { Request,Response } from "express";
import prisma from "db/client";

export const sendMessage = async(req:Request,res:Response):Promise<void> => {
    try {
        const {chatId , content} = req.body;
        const userId=(req as any).user.id;

        if(!chatId || !content) {
            res.status(400).json({ success: false, error: "chatId and content are required" });
            return;
        }

        const chat = await prisma.chat.findUnique({
            where : {
                id: Number(chatId)
            },
        });

        if(!chat || chat.userId !== userId) {
            res.status(403).json({ success: false, error: "You are not authorized for this chat" });
            return;
         }
        
         const message = await prisma.message.create({
            data: {
              chatId: Number(chatId),
              senderId: userId,
              senderType:"user",
              content,
            },
          });

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("Error sending user message:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}