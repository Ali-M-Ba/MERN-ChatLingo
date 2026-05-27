import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  const token = req.cookies?.jwt;
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  try {
    await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid token" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
