import User from "../models/User.js";
import { z } from "zod";
import { signupSchema, loginSchema } from "../validators/user.validator.js";
import { createToken, setCookies } from "../utils/token.utils.js";

export const signup = async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { name, email, username, password, bio, avatar } = validatedData;

    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return res.status(409).json({ message: "username already exists" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUserEmail = await User.findOne({ email: normalizedEmail });

    if (existingUserEmail) {
      return res.status(409).json({ message: "email already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      bio: bio || "",
      avatar: avatar || "",
    });

    const token = createToken(user._id);
    setCookies(res, token);

    return res.status(201).json({
      message: "user created successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Invalid input",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { username, password } = validatedData;

    const normalizedUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const token = createToken(user._id);
    setCookies(res, token);

    return res.status(200).json({
      message: "login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message || "Invalid input",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({ message: "logout successful" });
};

