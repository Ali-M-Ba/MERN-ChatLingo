import express from "express";
import {
  login,
  logout,
  onboarding,
  signup,
} from "../controllers/auth.controller.js";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { authLimiter } from "../middlewares/rateLimiters.middleware.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import User from "../models/User.model.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", authLimiter, logout);
router.post("/onboarding", isAuth, authLimiter, onboarding);

router.get("/me", isAuth, authLimiter, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

export default router;
