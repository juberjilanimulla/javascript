import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;