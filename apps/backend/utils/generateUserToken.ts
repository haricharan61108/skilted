import jwt from "jsonwebtoken";
import { Response } from "express";


export const generateUserToken=(userId: number, res: Response)=> {
    const token=jwt.sign({userId},process.env.JWT_USER_SECRET!,{
        expiresIn:"7d",
    });
    res.cookie("jwt",token,{
        httpOnly:true,
        sameSite:"strict",
        secure:false,
        maxAge:7 * 24 * 60 * 60 * 1000,
    })
    console.log("id is ",userId,"  Token is ",token);
    return token;
}