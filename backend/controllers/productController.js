import { pool } from "../db.js";
import {successResponse,errorResponse} from "../helpers/serverResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("CALL sp_get_products()");
  return successResponse(res, 200, "Products fetched", rows?.[0] || []);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || price === undefined || price === null) {
    throw new ApiError(400, "Name and price are required");
  }

  const [result] = await pool.query("CALL sp_create_product(?, ?, ?)", [
    name,
    price,
    quantity || 0,
  ]);

  return successResponse(res, 201, "Product created", { id: result?.[0]?.[0]?.id || null });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  if (!name || price === undefined || price === null) {
    throw new ApiError(400, "Name and price are required");
  }

  await pool.query("CALL sp_update_product(?, ?, ?, ?)", [id, name, price, quantity || 0]);
  return successResponse(res, 200, "Product updated", { id: Number(id) });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query("CALL sp_delete_product(?)", [id]);
  return successResponse(res, 200, "Product deleted", { id: Number(id) });
});