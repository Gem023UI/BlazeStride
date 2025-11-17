import Order from "../models/orders.js";
import Product from "../models/products.js";
import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const updateProductStock = async (orderItems) => {
  try {
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }
      
      product.stock -= item.quantity;
      await product.save();
    }
  } catch (error) {
    throw error;
  }
};

// Create Order
export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    try {
      await updateProductStock(order.orderItems);
    } catch (stockError) {
      // If stock update fails, delete the order
      await Order.findByIdAndDelete(order._id);
      return res.status(400).json({ message: stockError.message });
    }

    // Populate order details for email
    await order.populate("user", "email firstname lastname");
    await order.populate("orderItems.product", "productname");

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.user.email,
      subject:
        "Order Confirmation - Order #" +
        order._id.toString().substring(0, 8).toUpperCase(),
      html: `
        <h2>Thank you for your order!</h2>
        <p>Dear ${order.user.firstname} ${order.user.lastname},</p>
        <p>Your order has been received and is being processed.</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong> ${order._id
          .toString()
          .substring(0, 8)
          .toUpperCase()}</p>
        <p><strong>Order Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleString()}</p>
        
        <h3>Shipping Information:</h3>
        <p><strong>Receiver:</strong> ${req.body.receiverName}</p>
        <p><strong>Address:</strong> ${order.shippingInfo.address}</p>
        <p><strong>City:</strong> ${order.shippingInfo.city}</p>
        <p><strong>Postal Code:</strong> ${order.shippingInfo.postalCode}</p>
        <p><strong>Phone:</strong> ${order.shippingInfo.phoneNo}</p>
        
        <h3>Order Items:</h3>
        <ul>
          ${order.orderItems
            .map(
              (item) => `
            <li>${item.name} - Quantity: ${item.quantity} - $${(
                item.price * item.quantity
              ).toFixed(2)}</li>
          `
            )
            .join("")}
        </ul>
        
        <h3><strong>Total Amount: $${order.totalPrice.toFixed(2)}</strong></h3>
        
        <p>We will notify you once your order is shipped.</p>
        <p>Thank you for shopping with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    // Get userId from query params, body, or headers
    let userId = req.query.userId || req.body.userId;
    
    // If using auth middleware, get from req.user
    if (!userId && req.user) {
      userId = req.user.id || req.user._id;
    }

    // Log for debugging
    console.log("Fetching orders for userId:", userId);

    if (!userId) {
      return res.status(400).json({ 
        message: "User ID is required",
        received: { query: req.query, body: req.body }
      });
    }
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "productname");
    
    console.log(`Found ${orders.length} orders for user ${userId}`);
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "email firstname lastname")
      .populate("orderItems.product", "productname");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    )
    .populate("user", "email firstname lastname")
    .populate("orderItems.product", "productname");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send status update email
    const statusColors = {
      "To Confirm": "#856404",
      "To Ship": "#0c5460",
      "To Deliver": "#155724",
      "Received": "#0f5132",
      "Cancelled": "#7b0101ff"
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.user.email,
      subject: `Order Status Update - Order #${order._id.toString().substring(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Dear ${order.user.firstname} ${order.user.lastname},</p>
          <p>Your order status has been updated.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order Number:</strong> ${order._id.toString().substring(0, 8).toUpperCase()}</p>
            <p><strong>New Status:</strong> <span style="color: ${statusColors[orderStatus] || '#333'}; font-weight: bold;">${orderStatus}</span></p>
            <p><strong>Updated At:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <h3>Order Summary:</h3>
          <ul>
            ${order.orderItems.map(item => `
              <li>${item.name} - Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
            `).join("")}
          </ul>
          
          <p><strong>Total Amount: $${order.totalPrice.toFixed(2)}</strong></p>
          
          ${orderStatus === "Received" ? 
            `<p style="color: #0f5132; font-weight: bold;">Thank you for your purchase! We hope to serve you again.</p>` : 
            `<p>We will keep you updated on your order progress.</p>`
          }
          
          <p>Thank you for shopping with us!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstname lastname email")
      .populate("orderItems.product", "productname");
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrdersChart = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstname lastname email')
      .populate('orderItems.product', 'productname productimage price')
      .sort({ createdAt: -1 });

    res.json({
      orders: orders.map(order => ({
        _id: order._id,
        user: order.user,
        orderItems: order.orderItems,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        shippingInfo: order.shippingInfo,
        receiverName: order.receiverName
      }))
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: error.message });
  }
};