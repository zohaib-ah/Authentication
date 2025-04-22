import express from "express";
import authRouter from "./auth.route.js"
import userRoute from './user.route.js'


const router = express.Router();


router.use("/auth", authRouter);
router.use("/users", userRoute)

export default router;


