import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";;
import prisma  from "db/client";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            res.status(401).json({message: "Unauthorized - No Token Provided"});
            return ;
        }
        const decoded=jwt.verify(token,process.env.JWT_USER_SECRET!) as {userId:number};

        if(!decoded || !decoded.userId) {
             res.status(401).json({ message: "Unauthorized - Invalid Token" });
             return;
        }
        const user=await prisma.user.findUnique({
            where: {id:decoded.userId},
            select : {
                id:true,
                email:true,
            }
        });
        if(!user) {
            res.status(404).json({message: "User not found"});
            return ;
        }
        (req as any).user=user;
        next();
    } catch (error) {
        console.error("Error in user middleware:", error);
    res.status(500).json({ message: "Internal server error" });
    }
} 