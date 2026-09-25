import { pool } from "../db.js";
import {successResponse,errorResponse} from "../helpers/serverResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getOrders = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("CALL sp_get_orders()");
  return successResponse(res, 200, "Orders fetched", rows?.[0] || []);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { userId, productId, quantity, status } = req.body;

  if (!userId || !productId || !quantity) {
    throw new ApiError(400, "userId, productId, and quantity are required");
  }

  const [result] = await pool.query("CALL sp_create_order(?, ?, ?, ?)", [
    userId,
    productId,
    quantity,
    status || "pending",
  ]);

  return successResponse(res, 201, "Order created", { id: result?.[0]?.[0]?.id || null });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, productId, quantity, status } = req.body;

  if (!userId || !productId || !quantity) {
    throw new ApiError(400, "userId, productId, and quantity are required");
  }

  await pool.query("CALL sp_update_order(?, ?, ?, ?, ?)", [
    id,
    userId,
    productId,
    quantity,
    status || "pending",
  ]);

  return successResponse(res, 200, "Order updated", { id: Number(id) });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query("CALL sp_delete_order(?)", [id]);
  return successResponse(res, 200, "Order deleted", { id: Number(id) });
});