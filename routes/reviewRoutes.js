import express from "express";

import {
  getAllReviews,
  getReview,
  updateReviewStatus
} from "../controllers/reviewController.js";

const router = express.Router();


router.get("/", getAllReviews);
router.get("/email/:emailId", getReview);
router.patch("/:id", updateReviewStatus);

export default router;