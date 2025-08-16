import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs:60*1000,
    max:2,
    message:"Too many requests from this IP, please try again in a minute",
    standardHeaders:true,
    legacyHeaders:true
})  