import { Request,Response } from "express";
import prisma from "db/client";


export const placeBid=async(req:Request,res:Response):Promise<void>=> {
    try {
        const {jobId}=req.params;
        const userId=(req as any).user.id;
        console.log("User Id is "+userId);
        const { bidAmount } = req.body;

        if(!bidAmount) {
            res.status(400).json({ msg: "Bid amount is required"});
            return ;
        }
        
        const job = await prisma.job.findUnique({
            where: { id: Number(jobId) },
          });
      
          if (!job || !job.isBiddingEnabled) {
            res.status(400).json({ msg: "Job is not bidding enabled" });
            return;
          }

          const bid = await prisma.bid.create({
            data: {
              jobId: Number(jobId),
              userId: Number(userId),
              bidAmount: Number(bidAmount),
            },
          });

          res.status(200).json({ msg: "Bid Placed", bid });
    } catch (error) {
        console.error("Error placing bid:", error);
    res.status(500).json({ msg: "Failed to place bid", error });
    }
}