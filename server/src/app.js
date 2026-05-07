import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import { rateLimit } from "express-rate-limit";
import { logger } from "./middlewares/logger.middleware.js";
import { globalLimiter } from "./middlewares/rateLimiters.middleware.js";

const app = express();

// If your app is behind a proxy (e.g., Heroku, AWS ELB), you need to trust the proxy
// so that req.ip gives the correct client IP address for rate limiting and logging.
// If you're not behind a proxy, you can omit this line.
// app.set("trust proxy", 1);

app.use(logger);
app.use(globalLimiter);
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/test", (_req, res) => {
  res.json({
    status: "ok",
    message: "ChatLingo API is running",
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

export default app;
