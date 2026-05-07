import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { authLimiter } from "../middlewares/rateLimiters.middleware.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", authLimiter, logout);

export default router;
