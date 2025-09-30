import prisma from "db/client";
import { emailQueue } from "../workers/emailWorker";

export const acceptApplication  = async(req,res) => {
    try {
        const {applicationId} = req.body;

        const application = await prisma.bid.update({
            where: {
                id: applicationId
            },
            data: {
                comments: "Accepted"
            },
            include: {
                user: true,
                job: true
            }
        })

        await emailQueue.add("sendAcceptance", {
            email:application.user.email,
            jobTitle : application.job.title
        })

        res.json({ message: "Application accepted and email queued" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}