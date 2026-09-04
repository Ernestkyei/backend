import express from "express";

import {
  getAudits
} from "../controllers/auditController.js";

const router = express.Router();

router.get("/", getAudits);

export default router;