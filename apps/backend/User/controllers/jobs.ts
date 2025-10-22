import { Request,Response } from "express";
import prisma from "db/client";


export const placeBid=async(req:Request,res:Response):Promise<void>=> {
    try {
        const {jobId}=req.params;
        const userId=(req as any).user.id;
        console.log("User Id is "+userId);
        const { bidAmount } = req.body;
        const {comment} =req.body;
        
        if (!bidAmount) {
          res.status(400).json({ msg: "Bid amount is required" });
          return;
        }

        const job = await prisma.job.findUnique({ where: { id: Number(jobId) } });
        if (!job || job.isBiddingEnabled === false) {
          res.status(400).json({ msg: "Job is not bidding enabled or doesn't exist" });
          return;
        }

        const existingBid = await prisma.bid.findUnique({
          where: {
            userId_jobId: {
              userId,
              jobId: Number(jobId)
            },
          }
        })

        if(existingBid) {
          const updatedBid = await prisma.bid.update({
            where: { userId_jobId: { userId, jobId: Number(jobId) } },
            data: {
              bidAmount: Number(bidAmount),
              comments: comment || existingBid.comments,
            },
          });
          res.status(200).json({ msg: "Existing bid updated successfully", bid: updatedBid });
          return ;
        }
          const newBid = await prisma.bid.create({
            data: {
              jobId: Number(jobId),
              userId,
              bidAmount:Number(bidAmount),
              comments: comment || null,
            }
          })
          res.status(201).json({ msg: "Bid placed successfully", bid: newBid });
    } catch (error:any) {
      if (error.code === "P2002") {
        res.status(409).json({ msg: "You have already applied for this job" });
        return;
      }
  
      console.error("Error placing/updating bid:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
}

export const getAllJobs = async (req: Request, res: Response):Promise<void>=> {
    try {
      const jobs = await prisma.job.findMany({
        select: {
          id: true,
        title: true,
        category: true,
        baseBiddingPrice: true,
        deadline: true,
        experienceLevel: true,
        image: true,
        createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        }
      });

      res.status(200).json({
        jobs
      });
    } catch (error) {
      console.error("Error fetching job cards:", error);
      res.status(500).json({
      success: false,
      message: "Failed to fetch job cards",
      error: error.message,
    });
    }
}

export const getJobById = async(req:Request,res:Response):Promise<void>=> {
  try {
    const {jobId}=req.params;

    if (!jobId || isNaN(Number(jobId))) {
     res.status(400).json({
        success: false,
        error: 'Valid job ID is required'
      });
      return;
    }
    const id = parseInt(jobId);
    const job = await prisma.job.findUnique({
      where : {id},
      include: {
        admin: {
          select: {
            email: true,
          }
        }
      }
    })

    if (!job) {
       res.status(404).json({
        success: false,
        error: 'Job not found'
      });
      return ;
    }
    
    res.status(200).json({
      job
    })

  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}