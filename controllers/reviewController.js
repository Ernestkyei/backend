import {
  getReviews,
  getReviewByEmailId,
  getReviewById,
  updateReview
} from "../services/reviewService.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await getReviews();

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch review cases"
    });
  }
};

export const getReview = async (req, res) => {
  try {
    const { emailId } = req.params;

    const review = await getReviewByEmailId(emailId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review case not found"
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    console.error("Error fetching review:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch review"
    });
  }
};

export const getReviewDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await getReviewById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review case not found"
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    console.error("Error fetching review details:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch review details"
    });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const review = await updateReview(id, status);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review case not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Review status updated successfully",
      review
    });
  } catch (error) {
    console.error("Error updating review:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update review status"
    });
  }
};
