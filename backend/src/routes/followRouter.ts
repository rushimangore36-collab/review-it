import { Router } from "express";
import { followUser } from "../controllers/followController";

const router = Router();

router.get("/", followUser);

export default router;
