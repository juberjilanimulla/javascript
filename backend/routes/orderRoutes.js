import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const orderRouter = express();

orderRouter.use(authMiddleware);
orderRouter.get("/", getOrders);
orderRouter.post("/", createOrder);
orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;