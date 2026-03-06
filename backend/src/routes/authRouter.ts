import { Router } from "express";
import { register, login, check, logout } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", check);

export default router;
