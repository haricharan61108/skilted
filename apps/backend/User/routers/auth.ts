import { Router } from "express";
import { signup,login } from "../controllers/auth";
import { getAllJobs, getJobById, placeBid } from "../controllers/jobs";
import { userMiddleware } from "../../middleware/userMiddleware";
const router=Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/place-bid/:jobId",userMiddleware,placeBid);
router.get("/get-all-jobs",userMiddleware,getAllJobs);
router.get("/get-jobId/:jobId",userMiddleware,getJobById);

export default router;