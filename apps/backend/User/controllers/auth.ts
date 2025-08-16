import { Request, Response } from "express";
import prisma from "db/client";
import { generateUserToken } from "../../utils/generateUserToken.ts";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response):Promise<void>=> {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          res.status(400).json({ error: "Email and password are required" });
          return;
        }
    
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          res.status(400).json({ error: "User already exists" });
          return;
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword
          }
        });
    
        generateUserToken(newUser.id, res);
        res.status(201).json({ message: "User created successfully", user: { id: newUser.id, email: newUser.email } });
      } catch (error) {
        console.error("Signup failed:", error);
        res.status(500).json({ error: "Signup failed" });
      }
}

export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
  
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
  
      generateUserToken(user.id, res);
      res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email } });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  };