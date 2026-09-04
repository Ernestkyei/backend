import {
  createReviewCase,
  getReviewCaseByEmailId,
  getReviewCaseById,
  getAllReviewCases,
  updateReviewCaseStatus
} from "../database/model/reviewCaseModal.js";

export const createReview = async ({
  emailId,
  assignedTo = null,
  status = "OPEN",
  reason
}) => {
  const reviewCase = await createReviewCase({
    emailId,
    assignedTo,
    status,
    reason
  });

  return reviewCase;
};

export const getReviews = async () => {
  const reviews = await getAllReviewCases();

  return reviews;
};

export const getReviewByEmailId = async (emailId) => {
  const reviewCase = await getReviewCaseByEmailId(emailId);

  return reviewCase;
};

export const getReviewById = async (reviewCaseId) => {
  const reviewCase = await getReviewCaseById(reviewCaseId);

  return reviewCase;
};

export const updateReview = async (reviewCaseId, status) => {
  const updatedReview = await updateReviewCaseStatus({
    reviewCaseId,
    status
  });

  return updatedReview;
};

