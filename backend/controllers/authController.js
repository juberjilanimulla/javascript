import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import pool from "../DB/db.js";
import asyncHandler from "../middleware/Authcontext.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../helpers/serverResponse.js";

// POST /api/auth/login
// body: { email, password } -> { token, user: { id, name, email } }
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const [rows] = await pool.query("CALL sp_get_user_by_email(?)", [email]);
  const user = rows[0][0]; // stored procedures return result sets wrapped in an array

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  sendResponse(res, 200, "Login successful", {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// POST /api/auth/forgot-password
// body: { email } -> { message }
// Stub: generates + stores a reset token but doesn't actually send an email.
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const [rows] = await pool.query("CALL sp_get_user_by_email(?)", [email]);
  const user = rows[0][0];

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query("CALL sp_set_reset_token(?, ?, ?)", [email, resetToken, expires]);

    // TODO: send an actual email (nodemailer/SES) with a link containing resetToken
    console.log(`[forgot-password] reset token for ${email}: ${resetToken}`);
  }

  sendResponse(res, 200, "If an account exists for that email, a reset link has been sent", null);
});