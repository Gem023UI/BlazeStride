import React, { useEffect, useState } from "react";
import MainLayout from "./layout/MainLayout";
import Lanyard from "../reactbits/Lanyard/Lanyard";
import { getUserById, editProfile, deleteAccount } from "../api/users";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { editProfileSchema } from '../validations/authSchemas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPhone, faEnvelope, faUserPen, faTrashCan, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import Loader from "./layout/Loader";
import "../styles/Profile.css";

const Profile = () => {
  // User data states
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(editProfileSchema),
    mode: 'onBlur'
  });

  const watchNewPassword = watch('newPassword');
  const watchCurrentPassword = watch('currentPassword');
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("❌ No userId found in localStorage");
          return;
        }

        const response = await getUserById(userId);

        if (response.user) {
          setFirstname(response.user.firstname || "");
          setLastname(response.user.lastname || "");
          setEmail(response.user.email || "");
          setPhoneNumber(response.user.phoneNumber || "");
          setAddress(response.user.address || "");
          
          // Set avatar from response or localStorage
          const userAvatar = response.user.useravatar || localStorage.getItem("avatar") || "";
          setAvatar(userAvatar);
          if (userAvatar) {
            localStorage.setItem("avatar", userAvatar);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const handleOpenEditModal = () => {
    reset({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phoneNumber: phoneNumber || '',
      address: address || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setSelectedFile(null);
    setPreviewUrl(avatar);
    setMessage("");
    setError("");
    setShowEditModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      const userId = localStorage.getItem("userId");
      formData.append("userId", userId);
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber || "");
      formData.append("address", data.address || "");
      
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }
      
      if (data.currentPassword && data.newPassword) {
        formData.append("currentPassword", data.currentPassword);
        formData.append("newPassword", data.newPassword);
      }

      const response = await editProfile(formData);
      
      if (response.user.useravatar) {
        localStorage.setItem("avatar", response.user.useravatar);
        setAvatar(response.user.useravatar);
        window.dispatchEvent(new Event('avatarUpdated'));
      }
      
      setFirstname(data.firstname);
      setLastname(data.lastname);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
      setAddress(data.address);

      setMessage("Profile updated successfully!");
      
      setTimeout(() => {
        setShowEditModal(false);
      }, 1500);
      
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setDeleteError("User session not found");
        setDeleteLoading(false);
        return;
      }

      const response = await deleteAccount({
        userId,
        email: deleteEmail,
        password: deletePassword
      });

      if (response.success) {
        // Clear all localStorage data
        localStorage.clear();
        
        // Redirect to login page
        window.location.href = "/login";
      }
    } catch (err) {
      setDeleteError(err.toString());
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="profile-section">
        <div className="profile-container">
          {/* Profile Details Section */}
          <div className="profile-details-section">
            <h2>Profile Details</h2>
            
            <div className="detail-name">
              <p>{firstname} {lastname}</p>
            </div>

            <div className="detail-contact">
              <p><FontAwesomeIcon className="detail-svg" icon={faEnvelope}/> {email}</p>
              <p><FontAwesomeIcon className="detail-svg"icon={faPhone}/> {phoneNumber || "Phone: Not provided"}</p>
              <p><FontAwesomeIcon className="detail-svg"icon={faHouse}/> {address || "Not provided"}</p>
            </div>

            <div className="profile-buttons">
              <button 
                className="edit-profile-btn"
                onClick={handleOpenEditModal}
              >
                <FontAwesomeIcon className="detail-svg" icon={faUserPen}/>
              </button>
              <button 
                className="delete-profile-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                <FontAwesomeIcon className="detail-svg" icon={faTrashCan}/>
              </button>
            </div>
          </div>

          {/* Lanyard Section with Avatar */}
          <div className="lanyard-section">
            <Lanyard 
              position={[0, 0, 20]} 
              gravity={[0, -40, 0]}
              avatarUrl={avatar}
            />
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div 
            className="edit-modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <div 
              className="edit-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>

              <form onSubmit={handleFormSubmit(handleSubmit)}>
                <div className="form-content">
                  <div className="form-picture">
                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                    <label>Profile Picture</label>
                    
                    {previewUrl && (
                      <img 
                        src={previewUrl} 
                        alt="Profile Preview" 
                        className="profile-preview"
                      />
                    )}

                    <input 
                      id="profileInput"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    <label htmlFor="profileInput" className="custom-insert-button">
                      Change Profile Picture
                    </label>
                  </div>

                  <div className="form-details">
                    <h2>Edit Profile</h2>
                    
                    <div className="form-row">
                      <div className="form-name">
                        <div className="form-field">
                          <label>First Name</label>
                          <input 
                            type="text" 
                            {...register('firstname')}
                          />
                          {errors.firstname && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.firstname.message}</span>}
                        </div>
                        <div className="form-field">
                          <label>Last Name</label>
                          <input 
                            type="text" 
                            {...register('lastname')}
                          />
                          {errors.lastname && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.lastname.message}</span>}
                        </div>
                      </div>
                      <div className="form-contact">
                        <div className="form-field">
                          <label>Email</label>
                          <input 
                            type="email" 
                            {...register('email')}
                          />
                          {errors.email && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
                        </div>
                        <div className="form-field">
                          <label>Phone Number</label>
                          <input 
                            type="tel" 
                            {...register('phoneNumber')}
                            placeholder="Optional"
                          />
                          {errors.phoneNumber && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.phoneNumber.message}</span>}
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Address</label>
                        <input 
                          type="text" 
                          {...register('address')}
                          placeholder="Optional"
                        />
                        {errors.address && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.address.message}</span>}
                      </div>
                    </div>

                    <div className="password-section">
                      <h2>Change Password (Optional)</h2>
                      <div className="password-field">
                        <div className="form-field">
                          <label>Current Password</label>
                          <input 
                            type="password" 
                            {...register('currentPassword')}
                            placeholder="Enter current password"
                          />
                          {errors.currentPassword && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.currentPassword.message}</span>}
                        </div>

                        <div className="form-field">
                          <label>New Password</label>
                          <input 
                            type="password" 
                            {...register('newPassword')}
                            placeholder="Enter new password"
                          />
                          {errors.newPassword && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.newPassword.message}</span>}
                        </div>

                        <div className="form-field">
                          <label>Confirm Password</label>
                          <input 
                            type="password" 
                            {...register('confirmPassword')}
                            placeholder="Confirm new password"
                          />
                          {errors.confirmPassword && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword.message}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="done-btn"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div 
            className="edit-modal-overlay"
            onClick={() => setShowDeleteModal(false)}
          >
            <div 
              className="edit-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "400px" }}
            >
              <form onSubmit={handleDeleteAccount}>
                <h2 style={{ color: "#ff1f35ff", marginBottom: "20px" }}>Delete Account</h2>
                
                {deleteError && <div className="error-message">{deleteError}</div>}
                
                <p style={{ marginBottom: "20px", color: "#ffffffff", textAlign: "center" }}>
                  This action cannot be undone. Please enter your email and password to confirm.
                </p>

                <div className="delete-form">
                  <div className="delete-field" style={{ marginBottom: "15px" }}>
                    <label>Email:</label>
                    <input 
                      type="email" 
                      value={deleteEmail}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="delete-field" style={{ marginBottom: "30px" }}>
                    <label>Password:</label>
                    <input 
                      type="password" 
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <button 
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontFamily: "Poppins",
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      fontFamily: "Poppins",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      </div>
    </MainLayout>
  );
};

export default Profile;