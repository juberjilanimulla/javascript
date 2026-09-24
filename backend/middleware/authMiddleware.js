import jwt from "jsonwebtoken";
import { errorResponse } from "../helpers/serverResponse.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.query.token;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    return errorResponse(res, 401, "Token not found");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change-me-secret");
    req.user = decoded;
    return next();
  } catch (error) {
    return errorResponse(res, 401, "Invalid or expired token");
  }
};

export default authMiddleware;
