import bcrypt from "bcryptjs";
import pool from "../DB/db.js";
import asyncHandler from "../middleware/Authcontext.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../helpers/serverResponse.js";

// GET /api/users
export const getUsers = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("CALL sp_get_users()");
  sendResponse(res, 200, "Users fetched", rows[0]);
});

// POST /api/users
// body: { name, email, phone, password? }
// password is optional here since this form doubles as a general "customer"
// list — if left blank we set a default temp password so the row still has
// something to log in with later.
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  const hashedPassword = await bcrypt.hash(password || "changeme123", 10);

  const [result] = await pool.query("CALL sp_create_user(?, ?, ?, ?)", [
    name,
    email,
    hashedPassword,
    phone || null,
  ]);

  sendResponse(res, 201, "User created", { id: result[0][0].id });
});

// PUT /api/users/:id
// body: { name, email, phone } - password isn't changed from this endpoint
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  await pool.query("CALL sp_update_user(?, ?, ?, ?)", [id, name, email, phone || null]);
  sendResponse(res, 200, "User updated", { id: Number(id) });
});

// DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query("CALL sp_delete_user(?)", [id]);
  sendResponse(res, 200, "User deleted", { id: Number(id) });
});