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

// Get all orders for chart (admin) - MUST BE BEFORE /:id
router.get("/all", getAllOrdersChart);

// Get all orders (admin route - add auth middleware if needed)
router.get("/admin/all", getAllOrders);

// Create new order
router.post("/", createOrder);

// Get all orders for a user
router.get("/", getUserOrders);

// Update order status - MUST BE BEFORE /:id
router.patch("/:id/status", updateOrderStatus);

// Get single order by ID - THIS SHOULD BE NEAR THE END
router.get("/:id", getOrderById);

// Delete order (admin route - add auth middleware if needed)
router.delete("/:id", deleteOrder);

export default router;