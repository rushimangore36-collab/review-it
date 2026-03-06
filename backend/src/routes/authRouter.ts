import { Router } from "express";
import { register, login, check } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check", check);

export default router;
