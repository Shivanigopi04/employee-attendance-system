import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: "General",
    role: "employee",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🕐</div>
          <div className="auth-logo-text">
            <div className="auth-logo-title">LogMe</div>
            <div className="auth-logo-subtitle">Attendance System</div>
          </div>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input
                  name="name"
                  type="text"
                  className="auth-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Employee ID</label>
                <input
                  name="employeeId"
                  type="text"
                  className="auth-input"
                  placeholder="Enter employee ID"
                  value={form.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="auth-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="auth-input"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Department</label>
                <input
                  name="department"
                  type="text"
                  className="auth-input"
                  placeholder="Enter department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="auth-input"
                value={form.role}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{" "}
              <a href="/" className="auth-link">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
