import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
      maxlength: [50, "Name cannot exceed 50 characters."],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
      required: [true, "Email is required."],
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters."],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      ],
    },
    bio: {
      type: String,
      default: "",
      maxlength: [200, "Bio cannot exceed 200 characters."],
    },
    avatar: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters."],
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    nativeLanguage: {
      type: String,
      default: "en",
    },
    learningLanguage: {
      type: String,
      default: "en",
    },
    location: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
