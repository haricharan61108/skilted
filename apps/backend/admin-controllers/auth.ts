import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "db/client";
import { generateToken } from "../utils/generateToken.ts";
import Redis from "ioredis";

const portno=Number(process.env.REDIS_PORT);
const redis = new Redis({
  host: "127.0.0.1",
  port: portno
});




export const signup=async (req: Request, res: Response):Promise<void>=>{
    try {
        const { email, password } = req.body;

        if (!email || !password) {
           res.status(400).json({ error: "Email and password required" });
           return
        }
        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
           res.status(409).json({ error: "Admin already exists" });
           return
        }
        
        const hashedPass=await bcrypt.hash(password,10);

        const newAdmin =await prisma.admin.create({
            data: {
                email,
                password:hashedPass
            }
        })

        generateToken(newAdmin.id,res);

        res.status(201).json({ message: "Admin account created", admin: newAdmin });
    } catch (error) {
       console.error("Admin signup failed:", error);
       res.status(500).json({ error: "Server error during signup" });
    }
}

export const login=async (req: Request, res: Response):Promise<void>=>{
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          res.status(400).json({ error: "Email and password required" });
          return;
        }
    
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
          res.status(401).json({ error: "Invalid email or password" });
          return;
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
          res.status(401).json({ error: "Invalid email or password" });
          return;
        }
    
        generateToken(admin.id, res);
        res.status(200).json({ message: "Login successful", admin });
      } catch (error) {
        console.error("Admin login failed:", error);
        res.status(500).json({ error: "Server error during login" });
      }
}


//redis cache to check whether email is already taken
export const checkEmail=async(req:Request,res:Response):Promise<void>=>{
  const email = (req.query.email as string)?.trim().toLowerCase();
  if (!email) { 
     res.status(400).json({ error: "Email is required" }); 
     return
}

  const cachedEmail = await redis.get(email);
  if(cachedEmail!==null) {
     res.json({ available: cachedEmail === "true" });
     return;
  }
  console.log("Hitting the database");
  const admin = await prisma.admin.findUnique({ where: { email } });

  const available = !admin;

  await redis.set(`email:${email}`, String(available), "EX", 300);

  res.json({ available });
}



