import User from "../models/User.model.js";
import { z } from "zod";
import {
  signupSchema,
  loginSchema,
  onboardingSchema,
} from "../validators/user.validator.js";
import { createToken, setCookies } from "../utils/token.utils.js";
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Account already exists" });
    }

    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
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
        email: user.email,
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
    const { email, password } = validatedData;

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
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
    const validatedData = onboardingSchema.parse(req.body);
    const {name, username, bio, avatar, nativeLanguage, learningLanguage, location} = validatedData;
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isOnboarded) {
      return res.status(400).json({ message: "User already onboarded" });
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;
    user.nativeLanguage = nativeLanguage || user.nativeLanguage;
    user.learningLanguage = learningLanguage || user.learningLanguage;
    user.location = location || user.location;
    user.isOnboarded = true;
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
