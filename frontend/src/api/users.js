import axios from "axios";

// Add logging to debug
const API_URL = import.meta.env.VITE_LOCAL_URL || "http://localhost:5000";

const BASE_URL = `${API_URL}`;

export const registerUser = async (formData) => {
  try {
    console.log("Registering to:", `${BASE_URL}/api/user/register`);
    const response = await axios.post(`${BASE_URL}/api/user/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Register success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response || error);
    throw error.response?.data?.message || "Registration failed.";
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log("Logging in to:", `${BASE_URL}/api/user/login`);
    const response = await axios.post(`${BASE_URL}/api/user/login`, credentials, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log("Login success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response || error);
    throw error.response?.data?.message || error.response?.data?.error || "Login failed.";
  }
};

export const editProfile = async (formData) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found in localStorage");

    formData.append("userId", userId);

    console.log("Editing profile at:", `${BASE_URL}/api/user/edit-profile`);
    const response = await axios.put(`${BASE_URL}/api/user/edit-profile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    console.log("Edit profile success:", response.data);
    return response.data;
    } catch (error) {
    console.error("Edit profile error:", error.response || error);
    throw error.response?.data?.error || "Profile update failed.";
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/user/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user data");
    }

    return data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

export const deleteAccount = async (credentials) => {
  try {
    console.log("Deleting account at:", `${BASE_URL}/api/user/delete-account`);
    const response = await axios.delete(`${BASE_URL}/api/user/delete-account`, {
      data: credentials,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log("Delete account success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete account error:", error.response || error);
    throw error.response?.data?.error || "Account deletion failed.";
  }
};

export const getAllUsers = async () => {
  try {
    console.log("Fetching all users from:", `${BASE_URL}/api/user/all`);
    const response = await axios.get(`${BASE_URL}/api/user/all`, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      withCredentials: true,
    });
    console.log("Get all users success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get all users error:", error.response || error);
    throw error.response?.data?.error || "Failed to fetch users.";
  }
};

export const updateUser = async (formData) => {
  try {
    console.log("Updating user at:", `${BASE_URL}/api/user/update-user`);
    const response = await axios.put(`${BASE_URL}/api/user/update-user`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      withCredentials: true,
    });
    console.log("Update user success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error.response || error);
    throw error.response?.data?.error || "User update failed.";
  }
};