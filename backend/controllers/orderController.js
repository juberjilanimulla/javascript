import pool from "../DB/db.js";
import asyncHandler from "../middleware/Authcontext.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../helpers/serverResponse.js";

// GET /api/orders
export const getOrders = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("CALL sp_get_orders()");
  sendResponse(res, 200, "Orders fetched", rows[0]);
});

// POST /api/orders
// body: { userId, productId, quantity, status }
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

  sendResponse(res, 201, "Order created", { id: result[0][0].id });
});

// PUT /api/orders/:id
// body: { userId, productId, quantity, status }
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

  sendResponse(res, 200, "Order updated", { id: Number(id) });
});

// DELETE /api/orders/:id
export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query("CALL sp_delete_order(?)", [id]);
  sendResponse(res, 200, "Order deleted", { id: Number(id) });
});