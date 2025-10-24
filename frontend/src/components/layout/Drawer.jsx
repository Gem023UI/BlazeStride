import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Drawer.css";

// const API_URL = import.meta.env.VITE_BACKEND_URL || "https://typeventure.onrender.com";
const API_URL = import.meta.env.VITE_LOCAL_URL || "http://localhost:5000";

const Drawer = ({ isOpen, onClose }) => {
  const [avatarUrl, setAvatarUrl] = useState("https://res.cloudinary.com/dxnb2ozgw/image/upload/v1759649430/user_icon_ze74ys.jpg");
  const [username, setUsername] = useState("Guest User");
  const [email, setEmail] = useState("Guest User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          console.log("No userId or token found");
          setLoading(false);
          return;
        }

        // Fetch user data from backend
        const response = await axios.get(
          `${API_URL}/api/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.user) {
          setUsername(response.data.user.username);
          setEmail(response.data.user.email);
          setAvatarUrl(response.data.user.profilePicture || "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1759649430/user_icon_ze74ys.jpg");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose}></div>}

      <div className={`drawer-panel ${isOpen ? "open" : ""}`}>
        <div className="drawer-content">
          {/* Avatar Section */}
          <div className="avatar">
            <div className="avatar-image">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <img src={avatarUrl} alt="User Avatar" />
                  <h2 className="avatar-username">{username}</h2>
                  <p className="avatar-email">{email}</p>
                </>
              )}
            </div>
          </div>

          {/* Links */}
          <ul className="drawer-links">
            <li className="red">
              <a href="/lessons" onClick={onClose}>Profile</a>
            </li>
            <li className="purple">
              <a href="/profile" onClick={onClose}>Orders</a>
            </li>
            <li className="blue">
              <a href="/leaderboards" onClick={onClose}>Reviews</a>
            </li>
          </ul>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            LOG OUT
          </button>
        </div>
      </div>
    </>
  );
};

export default Drawer;