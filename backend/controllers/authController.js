// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../db.js";
import { successResponse, errorResponse } from "../helpers/serverResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

// ---- cookie options ----
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: "/",
};

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

// ================= SIGNUP =================
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, mobile } = req.body;
  if (!name || !email || !password)
    throw new ApiError(400, "name, email, password required");

  // Check if email already exists using SP
  const [existingRows] = await pool.query("CALL sp_get_user_by_email(?)", [
    email.toLowerCase().trim(),
  ]);
  const existing = existingRows?.[0]?.[0];
  if (existing) throw new ApiError(409, "Email already registered");

  const hashed = await bcrypt.hash(password, 10);

  const [result] = await pool.query("CALL sp_create_user(?, ?, ?, ?)", [
    name.trim(),
    email.toLowerCase().trim(),
    hashed,
    mobile || null,
  ]);
  const newUserId = result?.[0]?.[0]?.id;

  // Fetch back the created user
  const [rows] = await pool.query("CALL sp_get_user_by_email(?)", [
    email.toLowerCase().trim(),
  ]);
  const user = rows?.[0]?.[0];
  if (!user) throw new ApiError(500, "Failed to fetch created user");

  const token = signToken(user);
  res.cookie(process.env.COOKIE_NAME || "token", token, COOKIE_OPTIONS);

  return successResponse(
    res,
    "Signup successful",
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    201
  );
});

// ================= LOGIN =================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email and password required");

  // 🔥 Use your SP
  const [rows] = await pool.query("CALL sp_get_user_by_email(?)", [
    email.toLowerCase().trim(),
  ]);
  const user = rows?.[0]?.[0];

  if (!user) throw new ApiError(401, "Invalid email or password");
  if (!user.is_active) throw new ApiError(403, "Account is inactive");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  const token = signToken(user);
  res.cookie(process.env.COOKIE_NAME || "token", token, COOKIE_OPTIONS);

  return successResponse(res, "Login successful", {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ================= LOGOUT =================
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || "token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return successResponse(res, "Logged out");
});

// ================= FORGOT PASSWORD =================
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const [rows] = await pool.query("CALL sp_get_user_by_email(?)", [email]);
  const user = rows?.[0]?.[0];

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query("CALL sp_forgot_password(?, ?, ?)", [
      email,
      resetToken,
      expires,
    ]);
    console.log(`[forgot-password] token for ${email}: ${resetToken}`);
  }

  return successResponse(
    res,
    "If an account exists for that email, a reset link has been sent",
    null
  );
});

export default { login, signup, logout, forgotPassword };