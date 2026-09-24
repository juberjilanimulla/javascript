import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../helpers/serverResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("CALL sp_get_users()");
  return sendResponse(res, 200, "Users fetched", rows?.[0] || []);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  const hashedPassword = await bcrypt.hash(password || "changeme123", 10);
  const [result] = await pool.query("CALL sp_create_user(?, ?, ?, ?)", [
    name,
    email,
    hashedPassword,
    mobile || null,
  ]);

  return sendResponse(res, 201, "User created", { id: result?.[0]?.[0]?.id || null });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  await pool.query("CALL sp_update_user(?, ?, ?, ?)", [id, name, email, mobile || null]);
  return sendResponse(res, 200, "User updated", { id: Number(id) });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query("CALL sp_delete_user(?)", [id]);
  return sendResponse(res, 200, "User deleted", { id: Number(id) });
});