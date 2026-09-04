import express from "express";

import {
  getAllReviews,
  getReview,
  getReviewDetails,
  updateReviewStatus
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getAllReviews);

router.get("/email/:emailId", getReview);

router.get("/:id", getReviewDetails);

router.patch("/:id", updateReviewStatus);

export default router;