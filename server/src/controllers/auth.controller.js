import User from "../models/User.model.js";
import { z } from "zod";
import { signupSchema, loginSchema } from "../validators/user.validator.js";
import { createToken, setCookies } from "../utils/token.utils.js";
import { upsertStreamUser } from "../lib/stream.js";

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

    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      });
    } catch (error) {
      console.error("Error upserting Stream user:", user._id, error);
    }

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

    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      });
    } catch (error) {
      console.error("Error upserting Stream user:", user._id, error);
    }

    const token = createToken(user._id);
    setCookies(res, token);

    return res.status(200).json({
      message: "login successful",
      user: {
        id: user._id.toString(),
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

export const onboarding = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.onboarded) {
      return res.status(400).json({ message: "User already onboarded" });
    }

    user.onboarded = true;
    await user.save();

    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      });
    } catch (error) {
      console.error("Error upserting Stream user:", user._id, error);
    }

    return res.status(200).json({
      message: "onboarding completed",
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        onboarded: user.onboarded,
      },
    });
  } catch (error) {
    await User.findByIdAndUpdate(req.user.id, { onboarded: false }).catch(
      (err) => {
        console.error("Error resetting onboarding status:", req.user.id, err);
      },
    );
    return res.status(500).json({ message: error.message });
  }
};
