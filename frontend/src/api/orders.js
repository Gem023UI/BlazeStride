import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get all orders for the logged-in user
export const fetchUserOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id || localStorage.getItem("userId");

    console.log("Fetching orders for user:", userId);

    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }

    const response = await axios.get(API_URL, {
      params: { userId }, // Send userId as query parameter
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get a single order by ID
export const fetchOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id || localStorage.getItem("userId");

    console.log("Fetching order details:", orderId);

    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }

    const response = await axios.get(`${API_URL}/${orderId}`, {
      params: { userId }, // Send userId as query parameter
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const fetchAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_URL}/${orderId}/status`,
      { orderStatus: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Get all orders (Admin)
export const fetchAllOrdersAdmin = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};