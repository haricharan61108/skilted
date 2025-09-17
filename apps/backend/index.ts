import prisma from "db/client";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import adminRouter from "./admin-routers/auth"
import userRouter from "./User/routers/auth";
import http from "http";
import {Server} from "socket.io";

dotenv.config();

const allowedOrigins = [
  'http://localhost:5733',   //user frontend
  "http://localhost:5732",   //admin frontend
];
const app=express();
const server=http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
const PORT=process.env.PORT;
app.use(
    cors({
      origin: allowedOrigins, 
      credentials: true,               
    })
  );
app.use(cookieParser());
app.use(express.json());

app.get("/", async(req, res) => {
    res.send("Hello World");
})

app.use("/api/admin",adminRouter);
app.use("/api/user",userRouter);

io.on("connection",(socket)=> {
  console.log("a user connected",socket.id);

  socket.on("join",({chatId,senderId,senderType})=> {
    socket.join(`chat-${chatId}`);
    console.log(`${senderType} ${senderId} joined chat ${chatId}`);
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




