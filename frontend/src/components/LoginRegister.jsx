import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../../config/firebaseClient.js";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginSchema, registerSchema } from '../validations/authSchemas';
import "../styles/LoginRegister.css"
import Loader from "./layout/Loader.jsx";

// API base URL
// const API_URL = import.meta.env.VITE_BACKEND_URL || "https://blazestride.onrender.com";
const API_URL = import.meta.env.VITE_LOCAL_URL || "http://localhost:5000";

export default function LoginRegister({ logoUrl }) {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // REGISTER FUNCTION with Formik
  const handleRegisterSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);

    const payload = {
      firstname: values.firstname.trim(),
      lastname: values.lastname.trim(),
      email: values.email.trim(),
      password: values.password,
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

      resetForm();
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
      setSubmitting(false);
    }
  };

  // LOGIN FUNCTION with Formik
  const handleLoginSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/user/login`,
        { email: values.email, password: values.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("✅ Login response:", response.data);

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
      setSubmitting(false);
    }
  };

  // SOCIAL AUTH HANDLER
  const handleSocialAuth = async (provider) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Get the ID token from Firebase
      const idToken = await result.user.getIdToken();
      
      // Send ID token to backend for verification
      const response = await axios.post(
        `${API_URL}/api/user/social-auth`,
        {
          idToken: idToken,
          provider: provider === googleProvider ? 'google' : 'facebook'
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Store user data
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

      setShowSocialModal(false);
      
      setTimeout(() => {
        if (response.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("../");
        }
      }, 2000);
      
    } catch (err) {
      console.error("❌ Social auth error:", err);
      
      let errorMessage = "Authentication failed. Please try again.";
      
      // Handle specific Firebase errors
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in popup was closed. Please try again.";
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-in was cancelled.";
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = "Sign-in popup was blocked by your browser.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

const openSocialModal = (provider) => {
  setSelectedProvider(provider);
  setShowSocialModal(true);
};

  return (
    <div className="login-register-wrapper">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        {/* LOGIN */}
        <div className="form-container sign-up">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLoginSubmit}
          >
            {({ isSubmitting }) => (
              <Form id="loginForm">
                <h1>LOGIN</h1>
                <div className="input-box">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    disabled={loading}
                  />
                  <ErrorMessage name="email" component="div" className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
                  
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    disabled={loading}
                  />
                  <ErrorMessage name="password" component="div" className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
                </div>
                <button type="submit" className="btn" disabled={loading || isSubmitting}>
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* REGISTER */}
        <div className="form-container sign-in">
          <Formik
            initialValues={{
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={registerSchema}
            onSubmit={handleRegisterSubmit}
          >
            {({ isSubmitting }) => (
              <Form id="registerForm">
                <h1>REGISTER</h1>
                <div className="input-box">
                  <div className="names">
                    <div>
                      <Field
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        disabled={loading}
                      />
                      <ErrorMessage name="firstname" component="div" className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
                    </div>
                    <div>
                      <Field
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        disabled={loading}
                      />
                      <ErrorMessage name="lastname" component="div" className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
                    </div>
                  </div>
                  
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    disabled={loading}
                  />
                  <ErrorMessage name="email" component="div" className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
                  
                  <div className="passwords">
                    <div>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                        disabled={loading}
                      />
                      <ErrorMessage name="password" component="div" className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
                    </div>
                    <div>
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        disabled={loading}
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn2" disabled={loading || isSubmitting}>
                  {loading ? 'REGISTERING...' : 'REGISTER'}
                </button>
              </Form>
            )}
          </Formik>
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
                {/* FACEBOOK */}
                <a className="icon" onClick={() => openSocialModal(facebookProvider)} style={{ cursor: 'pointer' }}>
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

                {/* INSTAGRAM */}
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

                {/* GOOGLE */}
                <a className="icon" onClick={() => openSocialModal(googleProvider)} style={{ cursor: 'pointer' }}>
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

                {/* X / TWITTER */}
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

      {/* Social Auth Modal */}
      {showSocialModal && (
        <div className="firebase-overlay" onClick={() => setShowSocialModal(false)}>
          <div 
            className="social-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              Continue with {selectedProvider === googleProvider ? 'Google' : 'Facebook'}
            </h2>
            <p>
              Sign in to BlazeStride using your {selectedProvider === googleProvider ? 'Google' : 'Facebook'} account
            </p>
            <div className="social-modal-buttons">
              <button 
                onClick={() => setShowSocialModal(false)}
                className="social-cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSocialAuth(selectedProvider)}
                disabled={loading}
                className="social-continue-btn"
                style={{
                  backgroundColor: selectedProvider === googleProvider ? '#4285f4' : '#1877f2'
                }}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

    </div>
  );
}