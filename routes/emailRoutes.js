import express from "express";
import { receiveEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/", receiveEmail);

export default router;