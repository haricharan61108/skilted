import { Request,Response } from "express";
import prisma from "db/client";

export const saveJob=async(req:Request,res:Response):Promise<void>=> {
    try {
        const userId=(req as any).user.id;
        const {jobId} = req.params;

        const job = await prisma.job.findUnique({ where: { id: Number(jobId) } });
        if (!job) { 
            res.status(404).json({ message: "Job not found." });
            return;
        }
        const existing = await prisma.savedJob.findUnique({
            where: { userId_jobId: { userId, jobId: Number(jobId) } },
         });

         if(existing) {
            res.status(409).json({message: "Job Already saved"});
            return ; 
        }
        await prisma.savedJob.create({
            data: {
                userId: userId,
                jobId: Number(jobId)
            }
        });
       res.status(201).json({ message: "Job saved successfully." });
       
    } catch (error) {
        console.error("Error saving job:", error);
       res.status(500).json({ message: "Internal server error." });
    }
}

export const unsaveJob=async(req:Request,res:Response):Promise<void>=> {
   try {
    const userId=(req as any).user.id;
    const { jobId } = req.params;

    await prisma.savedJob.delete({
        where: { 
            userId_jobId: { userId, jobId: Number(jobId) 
            } 
        },
    });

    res.status(200).json({ message: "Job unsaved successfully." });
   } catch (err:any) {
    if (err.code === "P2025")
        res.status(404).json({ message: "Saved job not found." });
  
      console.error("Error unsaving job:", err);
       res.status(500).json({ message: "Internal server error." });
       return ;
   }
}

export const getSavedJobStatus=async(req:Request,res:Response):Promise<void>=> {
   try {
    const userId=(req as any).user.id;
    const {jobId} = req.params;
    if(!userId) {
        res.status(200).json({ isSaved: false });
        return;
    }
    const savedJob = await prisma.savedJob.findUnique({
        where : {
            userId_jobId: {userId, jobId:Number(jobId)},
        }
    });

     res.status(200).json({ isSaved: !!savedJob });
     return ;
   } catch (err) {
    console.error("Error checking save status:", err);
    res.status(500).json({ message: "Internal server error." });
    return ;
   }
}


export const getAllSavedJobs=async(req:Request,res:Response):Promise<void>=> {
    try {
        const userId=(req as any).user.id;
        const savedJobs = await prisma.savedJob.findMany({
            where: {
                userId
            },
            include: {
                job:true
            }
        })

        res.status(200).json({ savedJobs });
        return ;
    } catch (err) {
        console.error("Error fetching saved jobs:", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

