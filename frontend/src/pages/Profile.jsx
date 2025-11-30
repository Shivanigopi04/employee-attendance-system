import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { loginSuccess } from "../store/authSlice";
import "./Dashboard.css";

export default function Profile() {
  const { token, user: authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        employeeId: res.data.employeeId || "",
        department: res.data.department || "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      employeeId: user?.employeeId || "",
      department: user?.department || "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);

    // Validate password if provided
    if (formData.password) {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setUpdating(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setUpdating(false);
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        employeeId: formData.employeeId,
        department: formData.department,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await API.put("/auth/update", updateData);
      setUser(res.data.user);
      setSuccess("Profile updated successfully!");

      // Update Redux store if name or email changed
      if (res.data.user.name !== authUser.name || res.data.user.email !== authUser.email) {
        dispatch(
          loginSuccess({
            token,
            user: {
              ...authUser,
              name: res.data.user.name,
              email: res.data.user.email,
            },
          })
        );
      }

      setIsEditing(false);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <TopHeader />
          <div className="dashboard-content">
            <div className="loading">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopHeader />
        <div className="dashboard-content">
          <div className="dashboard-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="card-title">Profile Information</div>
              {!isEditing && (
                <button className="btn-primary" onClick={handleEdit} style={{ padding: "0.5rem 1.5rem" }}>
                  Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="alert-error" style={{ marginBottom: "1rem", padding: "0.75rem", borderRadius: "0.5rem", background: "#fee2e2", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {success && (
              <div className="alert-success" style={{ marginBottom: "1rem", padding: "0.75rem", borderRadius: "0.5rem", background: "#d1fae5", color: "#059669" }}>
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password (Optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                {formData.password && (
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Confirm new password"
                    />
                  </div>
                )}

                <div className="form-actions" style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button type="submit" className="btn-primary" disabled={updating}>
                    {updating ? "Updating..." : "Save Changes"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleCancel} disabled={updating}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="profile-item">
                  <span className="profile-label">Full Name</span>
                  <span className="profile-value">{user?.name}</span>
                </div>

                <div className="profile-item">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{user?.email}</span>
                </div>

                <div className="profile-item">
                  <span className="profile-label">Employee ID</span>
                  <span className="profile-value">{user?.employeeId}</span>
                </div>

                <div className="profile-item">
                  <span className="profile-label">Department</span>
                  <span className="profile-value">{user?.department}</span>
                </div>

                <div className="profile-item">
                  <span className="profile-label">Role</span>
                  <span className="profile-value">
                    <span className={`status-badge ${user?.role === "manager" ? "present" : "present"}`}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </span>
                </div>

                <div className="profile-item">
                  <span className="profile-label">Member Since</span>
                  <span className="profile-value">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
