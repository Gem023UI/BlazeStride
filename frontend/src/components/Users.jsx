import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { getAllUsers, updateUser } from "../api/users";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userEditSchema } from '../validations/userSchema';
import Swal from "sweetalert2";
import "../styles/Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch users",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setAvatarPreview(user.useravatar);
    setAvatarFile(null);
    setShowModal(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("userId", selectedUser._id);
      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber || "");
      formData.append("address", values.address || "");
      formData.append("role", values.role);
      formData.append("status", values.status);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await updateUser(formData);

      Swal.fire({
        icon: "success",
        title: "User Updated",
        text: "User details have been updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowModal(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error || "Failed to update user",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="users-page-wrapper">
          <div className="loading">Loading users...</div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="users-page-wrapper">
        <div className="users-header">
          <h1>User Management</h1>
          <p>Total Users: {users.length}</p>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => handleViewDetails(user)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit User Details</h2>
                <button className="close-btn" onClick={closeModal}>
                  &times;
                </button>
              </div>

              <Formik
                initialValues={{
                  firstname: selectedUser.firstname || "",
                  lastname: selectedUser.lastname || "",
                  email: selectedUser.email || "",
                  phoneNumber: selectedUser.phoneNumber || "",
                  address: selectedUser.address || "",
                  role: selectedUser.role || "customer",
                  status: selectedUser.status || "active",
                }}
                validationSchema={userEditSchema}
                onSubmit={handleUpdateUser}
              >
                {({ isSubmitting, values }) => (
                  <Form className="user-edit-form">
                    {/* Avatar Section */}
                    <div className="avatar-section">
                      <div className="avatar-preview">
                        <img
                          src={avatarPreview || "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1759649430/user_icon_ze74ys.jpg"}
                          alt="User Avatar"
                        />
                      </div>
                      <div className="avatar-upload">
                        <label htmlFor="avatar-upload" className="upload-btn">
                          Upload Image
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name *</label>
                        <Field
                          type="text"
                          name="firstname"
                          placeholder="First Name"
                        />
                        <ErrorMessage
                          name="firstname"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="form-group">
                        <label>Last Name *</label>
                        <Field
                          type="text"
                          name="lastname"
                          placeholder="Last Name"
                        />
                        <ErrorMessage
                          name="lastname"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <Field
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <Field
                        as="textarea"
                        name="address"
                        placeholder="Address"
                        rows="3"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Role *</label>
                        <Field as="select" name="role">
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </Field>
                        <ErrorMessage
                          name="role"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="form-group">
                        <label>Status *</label>
                        <Field as="select" name="status">
                          <option value="active">Active</option>
                          <option value="deactivated">Deactivated</option>
                        </Field>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="update-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Updating..." : "Update User"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}