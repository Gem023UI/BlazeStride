import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/LoginRegister.css"
import Loader from "./layout/Loader.jsx";

// API base URL
// const API_URL = import.meta.env.VITE_BACKEND_URL || "https://blazestride.onrender.com";
const API_URL = import.meta.env.VITE_LOCAL_URL || "http://localhost:5000";

export default function LoginRegister({ logoUrl }) {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const confirmPassword = e.target.confirmPassword.value;
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();

    const payload = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      password: password,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/user/register`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Registered:", response.data);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Optional reset
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.error || "Invalid credentials.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        `${API_URL}/api/user/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("✅ Login response:", response.data);

      // Store token, userId in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("avatar", response.data.user.useravatar);

      console.log("💾 Stored in localStorage:");
      console.log("  token:", localStorage.getItem("token"));
      console.log("  userId:", localStorage.getItem("userId"));
      console.log("  avatar:", localStorage.getItem("avatar"));

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        timer: 2000,
        showConfirmButton: false,
      });
      const userRole = response.data.user.role;
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/dashboard");
        } else {
          navigate("../");
        }
      }, 2000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.error || "Invalid credentials.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-register-wrapper">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        {/* LOGIN */}
        <div className="form-container sign-up">
          <form id="loginForm" onSubmit={handleLogin}>
            <h1>LOGIN</h1>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              LOGIN
            </button>
          </form>
        </div>

        {/* REGISTER */}
        <div className="form-container sign-in">
          <form id="registerForm" onSubmit={handleRegister}>
            <h1>REGISTER</h1>
            <div className="input-box">
              <div className="names">
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  required
                  disabled={loading}
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  required
                  disabled={loading}
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="passwords"> 
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn2" disabled={loading}>
              REGISTER
            </button>
          </form>
        </div>

        {/* TOGGLE CONTAINER */}
        <div className="toggle-container">
          <div className="toggle">
            {/* LEFT SIDE */}
            <div className="toggle-panel toggle-left">
              <img src={logoUrl} alt="blazestride" className="trademark" />
              <h1>GREETINGS!</h1>
              <div className="hotlines">
                <p>Keep Moving, in Both Money and Mind</p>
                <p>For any inquiries, please contact us at:</p>
                <p>blazestride@gmail.com</p>
              </div>
              <button className="hidden" onClick={() => setIsActive(false)}>
                Not Registered Yet?
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="toggle-panel toggle-right">
              <div className="social-icons">
                <h1>WELCOME!</h1>
                <p>Stay Updated with BlazeStride's Social Platforms</p>

                <a className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    width="20px"
                    height="20px"
                    fillRule="nonzero"
                  >
                    <g
                      fill="#000000"
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth="1"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray=""
                      strokeDashoffset="0"
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <g transform="scale(5.12,5.12)">
                        <path d="M25,3c-12.15,0-22,9.85-22,22c0,11.03,8.125,20.137,18.712,21.728v-15.897h-5.443v-5.783h5.443v-3.848c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588l-0.894,5.783h-5.694v15.944c10.738-1.457,19.022-10.638,19.022-21.775c0-12.15-9.85-22-22-22z"></path>
                      </g>
                    </g>
                  </svg>
                </a>

                <a className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    width="20px"
                    height="20px"
                    fillRule="nonzero"
                  >
                    <g
                      fill="#000000"
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth="1"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray=""
                      strokeDashoffset="0"
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <g transform="scale(8.53333,8.53333)">
                        <path d="M9.99805,3c-3.859,0-6.99805,3.14195-6.99805,7.00195v10c0,3.859,3.14195,6.99805,7.00195,6.99805h10c3.859,0,6.99805-3.14195,6.99805-7.00195v-10c0-3.859-3.14195-6.99805-7.00195-6.99805zM22,7c0.552,0,1,0.448,1,1c0,0.552-0.448,1-1,1c-0.552,0-1-0.448-1-1c0-0.552,0.448-1,1-1zM15,9c3.309,0,6,2.691,6,6c0,3.309-2.691,6-6,6c-3.309,0-6-2.691-6-6c0-3.309,2.691-6,6-6zM15,11c-2.20914,0-4,1.79086-4,4c0,2.20914,1.79086,4,4,4c2.20914,0,4-1.79086,4-4c0-2.20914-1.79086-4-4-4z"></path>
                      </g>
                    </g>
                  </svg>
                </a>

                <a className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    width="20px"
                    height="20px"
                    fill="#000000"
                  >
                    <path d="M16.003906 14.0625 L16.003906 18.265625 L21.992188 18.265625 C21.210938 20.8125 19.082031 22.636719 16.003906 22.636719 C12.339844 22.636719 9.367188 19.664063 9.367188 16 C9.367188 12.335938 12.335938 9.363281 16.003906 9.363281 C17.652344 9.363281 19.15625 9.96875 20.316406 10.964844 L23.410156 7.867188 C21.457031 6.085938 18.855469 5 16.003906 5 C9.925781 5 5 9.925781 5 16 C5 22.074219 9.925781 27 16.003906 27 C25.238281 27 27.277344 18.363281 26.371094 14.078125 Z" />
                  </svg>
                </a>

                <a className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    width="20px"
                    height="20px"
                    fillRule="nonzero"
                  >
                    <g
                      fill="#000000"
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth="1"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray=""
                      strokeDashoffset="0"
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <g transform="scale(5.12,5.12)">
                        <path d="M11,4c-3.866,0-7,3.134-7,7v28c0,3.866,3.134,7,7,7h28c3.866,0,7-3.134,7-7v-28c0-3.866-3.134-7-7-7zM13.08594,13h7.9375l5.63672,8.00977l6.83984-8.00977h2.5l-8.21094,9.61328l10.125,14.38672h-7.93555l-6.54102-9.29297l-7.9375,9.29297h-2.5l9.30859-10.89648zM16.91406,15l14.10742,20h3.06445l-14.10742-20z"></path>
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
              <button className="hidden" onClick={() => setIsActive(true)}>
                Have an Account?
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

    </div>
  );
}