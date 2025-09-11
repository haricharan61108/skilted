import { WebSocketServer } from "ws";
import prisma from "db/client";

const wss = new WebSocketServer({port:3001});

interface Client {
    socket: WebSocket;
    userId: number;
    role: "admin" | "user";
}

const clients = new Map<number, Client>();

wss.on("connection",(ws)=> {
    console.log("New client connected");

    ws.on("message",async(data)=> {
        try {
            const msg = JSON.parse(data.toString());

            if(msg.type==="auth") {
                clients.set(msg.userId,{socket:ws,userId:msg.userId,role:msg.role});
                console.log(`✅ Authenticated: ${msg.role} ${msg.userId}`);
                return;
            }

            if(msg.type==="message") {
                const {chatId,senderId,senderType,content} = msg;

                const newMsg  = await prisma.message.create({
                    data: {
                        chatId:Number(chatId),
                        senderId: Number(senderId),
                        senderType,
                        content,
                    },
                });

                const chat = await prisma.chat.findUnique({where: {id:chatId}});
                if(!chat) {
                    return ;
                }
                const recipientId = senderType === "admin" ? chat.userId : chat.adminId;
                const recipient = clients.get(recipientId);
                if(recipient) {
                 recipient.socket.send(JSON.stringify({ type: "new_message", message: newMsg }));
                }
                ws.send(JSON.stringify({ type: "sent", message: newMsg }));
            }
        } catch (err) {
            console.error("❌ Error handling WS message:", err);
        }
    });

    ws.on("close",()=>{
        for (const [id, client] of clients) {
          if (client.socket === ws) {
            clients.delete(id);
            console.log(`❌ Disconnected: ${client.role} ${id}`);
        }
      }
    });
})