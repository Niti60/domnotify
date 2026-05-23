import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        "student",
        "developer",
        "entrepreneur",
        "company",
      ],
      required: true,
    },

    companyName: {
      type: String,
      default: null,
    },

    profilePic: {
      type: String,
      default: "https://res.cloudinary.com/dkczwvm0e/image/upload/v1779547451/fallback-logo_dcsvvs.png",
    },

    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

export default User;