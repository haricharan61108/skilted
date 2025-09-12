import { Router } from "express";
import { signup,login, checkEmail } from "../admin-controllers/auth";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { getJobById, getJobsByAdmin, setJobs } from "../admin-controllers/jobs";
import {enableBidding} from "../admin-controllers/jobs";
import { getBidsByJobId } from "../admin-controllers/jobs";
import { getUsersBySkill, getUsersForAdmin, searchUsersForAdmin} from "../common-controllers/getUsersBySkill";
import { limiter } from "../middleware/rateLimiter";
import { getOrCreateAdminChat, sendAdminMessage } from "../admin-controllers/chat";


const router=Router();


router.post("/signup",signup);
router.post("/login",login);
router.post("/add-job",adminMiddleware,limiter,setJobs);
router.post("/toggle-bidding/:jobId",adminMiddleware,enableBidding);
router.get("/get-bids/:jobId",adminMiddleware,getBidsByJobId);
router.get("/search-skills",adminMiddleware,getUsersBySkill);
router.get("/get-job/:id",adminMiddleware,getJobById);
router.get("/get-users",adminMiddleware,getUsersForAdmin);
router.get("/users/search",adminMiddleware,searchUsersForAdmin);
router.get("/check-email",checkEmail)
router.get("/get-jobsByAdmin",adminMiddleware,getJobsByAdmin);


//chat routers
router.post("/create-chat/:userId",adminMiddleware,getOrCreateAdminChat);
// router.get("/get-chat/:chatId",adminMiddleware,getChatMessages);
router.post("/send-message/:chatId",adminMiddleware,sendAdminMessage);

export default router;
