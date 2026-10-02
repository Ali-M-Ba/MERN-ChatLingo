import express  from "express";
import { generateStreamToken } from "../lib/stream.js";

const router = express.Router();

router.post("/token", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  } else {
    try {
      const token = generateStreamToken(userId);
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error generating Stream token for userId:", userId, error);
      return res.status(500).json({ error: "Failed to generate token" });
    }
  }
});

export default router;