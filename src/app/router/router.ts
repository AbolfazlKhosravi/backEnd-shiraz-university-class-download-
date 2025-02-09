import express from "express";
import lessonsRoute from "./lessons";


const router = express.Router();

router.use("/lessons", lessonsRoute);

export default router;
