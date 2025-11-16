import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  getAllOrdersChart,
} from "../controllers/orders.js";

const router = express.Router();

// Create new order
router.post("/", createOrder);

// Get all orders for a user
router.get("/", getUserOrders);

// Get single order by ID
router.get("/:id", getOrderById);

// Update order status
router.patch("/:id/status", updateOrderStatus);

// Get all orders (admin route - add auth middleware if needed)
router.get("/admin/all", getAllOrders);

// Delete order (admin route - add auth middleware if needed)
router.delete("/:id", deleteOrder);

router.get("/all", getAllOrdersChart);

export default router;