import { Router } from "express";
import { signup,login } from "../controllers/auth";
import { getAllJobs, getJobById, placeBid } from "../controllers/jobs";
import { userMiddleware } from "../../middleware/userMiddleware";
import { getUserChatMessages, getUserChats, sendUserMessage } from "../controllers/chat";
import { getAllSavedJobs, getAppliedJobs, getSavedJobStatus, saveJob, unsaveJob } from "../controllers/saveJob";

//api/user
const router=Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/place-bid/:jobId",userMiddleware,placeBid);
router.get("/get-all-jobs",userMiddleware,getAllJobs);
router.get("/get-jobId/:jobId",userMiddleware,getJobById);


//chat controllers
router.post("/send-message/:adminId",userMiddleware,sendUserMessage);
router.get("/get-chats",userMiddleware,getUserChats);
router.get("/get-chat/:adminId",userMiddleware,getUserChatMessages)

router.post("/save-job/:jobId",userMiddleware,saveJob);
router.delete("/unsave-job/:jobId",userMiddleware,unsaveJob);
router.get("/job-saved-status/:jobId",userMiddleware,getSavedJobStatus);
router.get("/saved-jobs", userMiddleware, getAllSavedJobs);

//applied jobs
router.get("/applied-jobs",userMiddleware,getAppliedJobs);

export default router;