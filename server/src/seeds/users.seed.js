import mongoose from "mongoose";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";

const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    username: "john_doe",
    bio: "Love coding and coffee.",
    avatar: "https://i.pravatar.cc/150?img=1",
    password: "password123",
    isOnboarded: true,
    nativeLanguage: "en",
    learningLanguage: "es",
    location: "New York, USA",
  },
  {
    name: "Sarah Smith",
    email: "sarah@example.com",
    username: "sarah_smith",
    bio: "Traveler and language learner.",
    avatar: "https://i.pravatar.cc/150?img=2",
    password: "password123",
    isOnboarded: true,
    nativeLanguage: "en",
    learningLanguage: "fr",
    location: "London, UK",
  },
  {
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    username: "ahmed_ali",
    bio: "Tech enthusiast.",
    avatar: "https://i.pravatar.cc/150?img=3",
    password: "password123",
    isOnboarded: false,
    nativeLanguage: "ar",
    learningLanguage: "en",
    location: "Cairo, Egypt",
  },
  {
    name: "Maria Garcia",
    email: "maria@example.com",
    username: "maria_g",
    bio: "Music is life.",
    avatar: "https://i.pravatar.cc/150?img=4",
    password: "password123",
    isOnboarded: true,
    nativeLanguage: "es",
    learningLanguage: "en",
    location: "Madrid, Spain",
  },
  {
    name: "David Kim",
    email: "david@example.com",
    username: "david_kim",
    bio: "Frontend developer.",
    avatar: "https://i.pravatar.cc/150?img=5",
    password: "password123",
    isOnboarded: true,
    nativeLanguage: "ko",
    learningLanguage: "jp",
    location: "Seoul, South Korea",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    username: "emma_w",
    bio: "Reading books every day.",
    avatar: "https://i.pravatar.cc/150?img=6",
    password: "password123",
    isOnboarded: false,
    nativeLanguage: "en",
    learningLanguage: "de",
    location: "Toronto, Canada",
  },
  {
    name: "Yuki Tanaka",
    email: "yuki@example.com",
    username: "yuki_t",
    bio: "Anime and art lover.",
    avatar: "https://i.pravatar.cc/150?img=7",
    password: "password123",
    isOnboarded: true,
    nativeLanguage: "jp",
    learningLanguage: "en",
    location: "Tokyo, Japan",
  },
  {
    name: "Lucas Brown",
    email: "lucas@example.com",
    username: "lucas_b",
    bio: "Fitness and coding.",
    avatar: "https://i.pravatar.cc/150?img=8",
    password: "password123",
    isOnboarded: true,
    nativeLanguage: "en",
    learningLanguage: "it",
    location: "Sydney, Australia",
  },
  {
    name: "Fatima Noor",
    email: "fatima@example.com",
    username: "fatima_noor",
    bio: "Coffee addict ☕",
    avatar: "https://i.pravatar.cc/150?img=9",
    password: "password123",
    isOnboarded: false,
    nativeLanguage: "ur",
    learningLanguage: "en",
    location: "Karachi, Pakistan",
  },
  {
    name: "Carlos Mendes",
    email: "carlos@example.com",
    username: "carlos_m",
    bio: "Football fan and traveler.",
    avatar: "https://i.pravatar.cc/150?img=10",
    password: "password123",
    isOnboarded: true,
    nativeLanguage: "pt",
    learningLanguage: "en",
    location: "Lisbon, Portugal",
  },
];

export const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});

    // hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    await User.insertMany(hashedUsers);

    console.log("Users seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};
