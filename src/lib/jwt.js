import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: Boolean(user.isAdmin),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}