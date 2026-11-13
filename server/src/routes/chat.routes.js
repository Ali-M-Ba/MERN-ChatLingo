import express from "express";
import { generateStreamToken } from "../lib/stream.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAuth); // Apply authentication middleware to all routes in this router

router.post("/token", async (req, res) => {
  const { id } = req.user;

  if (!id) {
    return res.status(400).json({ error: "userId is required" });
  } else {
    try {
      const token = generateStreamToken(id);
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error generating Stream token for userId:", id, error);
      return res.status(500).json({ error: "Failed to generate token" });
    }
  }
});

export default router;
