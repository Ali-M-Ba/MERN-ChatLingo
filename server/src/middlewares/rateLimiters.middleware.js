import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  legacyHeaders: false,
  standardHeaders: true,

  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip);
  },

  handler: (req, res) => {
    console.warn({
      event: "global_rate_limit_exceeded",
      ip: req.ip,
      route: req.originalUrl,
      timestamp: new Date().toISOString(),
    });

    return res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  },
});

const generateKey = (req) => {
  const ip = ipKeyGenerator(req.ip);

  const email = req.body?.email
    ? String(req.body.email).trim().toLowerCase()
    : null;

  return email ? `${email}:${ip}` : ip;
};

export const authLimiter = rateLimit({
  keyGenerator: generateKey,

  skipSuccessfulRequests: true,

  windowMs: 5 * 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    const key = generateKey(req);

    console.warn({
      event: "rate_limit_exceeded",
      key,
      route: req.originalUrl,
      ip: req.ip || "unknown",
      email: req.body?.email ?? null,
      timestamp: new Date().toISOString(),
    });

    res.set("Retry-After", String(Math.ceil(5 * 60)));

    return res.status(429).json({
      message: "Too many login attempts. Try again later.",
    });
  },
});