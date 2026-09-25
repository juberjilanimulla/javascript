import { errorResponse } from "../helpers/serverResponse.js";

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    // Handle MySQL-specific codes here in one place
    if (err.code === "ER_DUP_ENTRY")
      return errorResponse(res, 409, "Duplicate entry");
    if (err.code === "ER_NO_REFERENCED_ROW_2")
      return errorResponse(res, 400, "Referenced row does not exist");
    if (err.code === "ECONNREFUSED")
      return errorResponse(res, 503, "Database unavailable");

    if (process.env.NODE_ENV !== "production") {
      console.error(`[${statusCode}] ${message}`, err.stack || "");
    }
    return errorResponse(res, statusCode, message);
  });
};

export default asyncHandler;
export { asyncHandler };