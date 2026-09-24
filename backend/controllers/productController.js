import pool from "../DB/db.js";
import asyncHandler from "../middleware/Authcontext.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../helpers/serverResponse.js";

// GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("CALL sp_get_products()");
  sendResponse(res, 200, "Products fetched", rows[0]);
});

// POST /api/products
// body: { name, price, quantity }
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

  sendResponse(res, 201, "Product created", { id: result[0][0].id });
});

// PUT /api/products/:id
// body: { name, price, quantity }
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  if (!name || price === undefined || price === null) {
    throw new ApiError(400, "Name and price are required");
  }

  await pool.query("CALL sp_update_product(?, ?, ?, ?)", [id, name, price, quantity || 0]);
  sendResponse(res, 200, "Product updated", { id: Number(id) });
});

// DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query("CALL sp_delete_product(?)", [id]);
  sendResponse(res, 200, "Product deleted", { id: Number(id) });
});