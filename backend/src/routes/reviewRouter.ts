import { Router } from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
} from "../controllers/reviewController";

const router = Router();
router.post("/", createReview);
router.get("/", getReviews);
router.get("/:id", getReviewById);
router.delete("/", deleteReview);
export default router;
