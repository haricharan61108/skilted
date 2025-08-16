import jwt from "jsonwebtoken";
import { Response } from "express";


export const generateToken=(adminId: number, res: Response)=> {
    const token=jwt.sign({adminId},process.env.JWT_SECRET!,{
        expiresIn:"7d",
    });
    res.cookie("jwt",token,{
        httpOnly:true,
        sameSite:"strict",
        secure:false,
        maxAge:7 * 24 * 60 * 60 * 1000,
    })

    return token;
}