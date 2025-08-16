import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma  from "db/client";

export const adminMiddleware=async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const token=req.cookies.jwt;

        if(!token) {
            res.status(401).json({message:"Unauthorized:No token Provided"});
            return;
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET!) as { adminId: number };
        if(!decoded || !decoded.adminId) {
            res.status(401).json({ message: "Unauthorized - Invalid Token" });

            return ;
        }

        const admin=await prisma.admin.findUnique({
            where: {
                id:decoded.adminId
            },
            select :{
                id:true,
                email:true
            },
        });

        if(!admin) {
            res.status(404).json({ message: "Admin not found" });
            return ;
        }
        (req as any).admin = admin;
        next();
    } catch (error) {
        console.error("Error in admin auth middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}