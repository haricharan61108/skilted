import { Request, Response } from "express";
import prisma from "db/client";

export const setJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      image,
      baseBiddingPrice,
      isBiddingEnabled,
      technologies,
      minimumRequirements,
      category,
      deadline,
      experienceLevel,
    } = req.body;

    if (
      !title ||
      !description ||
      !baseBiddingPrice ||
      isBiddingEnabled === undefined ||
      !technologies ||
      !minimumRequirements ||
      !category ||
      !deadline ||
      !experienceLevel
    ) {
      res.status(400).json({ error: "Please fill all the fields" });
      return;
    }

    const adminId = (req as any).admin.id;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        image: image || null,
        baseBiddingPrice: parseFloat(baseBiddingPrice),
        isBiddingEnabled: Boolean(isBiddingEnabled),
        technologies: Array.isArray(technologies) ? technologies : [technologies],
        minimumRequirements: Array.isArray(minimumRequirements) 
          ? minimumRequirements 
          : [minimumRequirements],
        category,
        deadline: new Date(deadline),
        experienceLevel,
        adminId,
      },
    });

    res.status(201).json({ message: "Job added successfully", job });
  } catch (err) {
    console.error("Failed to add job:", err);
    res.status(500).json({ error: "Failed to create Job" });
  }
};


export const enableBidding=async(req:Request,res:Response): Promise<void> =>{
  try {
    const adminId = (req as any).admin.id;
    const { jobId } = req.params;

    if (!adminId) {
      res.status(401).json({ msg: "Unauthorized. Admin ID missing." });
      return;
    }
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
    });

    if (!job) {
      res.status(404).json({ msg: "Job not found." });
      return;
    }

    if (job.adminId !== adminId) {
      res.status(403).json({ msg: "Forbidden. You are not authorized to enable bidding on this job." });
      return;
    }
    const updatedJob=await prisma.job.update({
      where: {id:Number(jobId)},
      data: {
        isBiddingEnabled:!job.isBiddingEnabled
      }
    });
    res.status(200).json({
      success: true,
      message: `Bidding ${updatedJob.isBiddingEnabled ? 'enabled' : 'disabled'} successfully`,
      job: updatedJob
    });

  } catch (error) {
    console.error("Enable bidding error:", error);
    res.status(500).json({ msg: "Failed to enable Bidding", error });
  }
}


export const getBidsByJobId=async(req:Request,res:Response): Promise<void> =>{
  try {
    const {jobId}=req.params;
    const adminId = (req as any).admin.id;
    console.log(jobId);
    const job=await prisma.job.findUnique({
      where: {
        id:Number(jobId)
      },
    });

    if(!job) {
      res.status(404).json({msg: "Job not found"})
      return ;
    }
    if(job.adminId!==adminId) {
      res.status(403).json({msg: "Forbidden. You are not authorized to view bids for this job."})
      return;
    }
    const bids = await prisma.bid.findMany({
      where: { jobId: Number(jobId) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
                profilePicture: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    res.status(200).json({ jobId: Number(jobId), totalBids: bids.length, bids });

  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ msg: "Failed to fetch bids", error });
  }
}


export const getJobById=async(req:Request,res:Response):Promise<void>=> {
  const {id}=req.params;
  try {
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ error: "Invalid job ID" });
      return;
    }
    const job=await prisma.job.findUnique({
      where: {
        id:Number(id)
      }
    });

    if(!job) {
      res.status(404).json({error: "Job Not Found" });
      return;
    }

    res.json(job);
  } catch (error) {
    console.error("Error Fetching Job Details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getJobsByAdmin = async(req:Request,res:Response):Promise<void>=> {
  try {
    const adminId = (req as any).admin.id;

    if(!adminId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized: admin ID missing",
      });
      return;
    }

    const jobs = await prisma.job.findMany({
      where : { adminId : Number(adminId)},
      include: {
        _count: {
          select: {
            bids: true, 
          }
        }
      },
      orderBy: {
        createdAt: "desc" 
      },
    });

    res.status(200).json({
      jobs
    })
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}