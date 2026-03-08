import { Router } from "express";
import {
  createReview,
  getReviews,
  getReviewById,
} from "../controllers/reviewController";

const router = Router();
router.post("/", createReview);
router.get("/", getReviews);
router.get("/:id", getReviewById);
export default router;
