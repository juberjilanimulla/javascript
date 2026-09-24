import ApiError from "../utils/apiError.js";
import { errorResponse } from "../utils/response.js";

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

// 4-arg signature is required by Express
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let data = err.data || null;

  // MySQL → HTTP mapping
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "Duplicate entry";
  } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
    statusCode = 400;
    message = "Referenced row does not exist";
  } else if (err.code === "ECONNREFUSED") {
    statusCode = 503;
    message = "Database unavailable";
  } else if (err.code === "ER_BAD_FIELD_ERROR") {
    statusCode = 500;
    message = "Database schema mismatch";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(`[${statusCode}] ${message}`);
    if (err.stack) console.error(err.stack);
  }

  return errorResponse(res, statusCode, message, data);
};

export default errorHandler;