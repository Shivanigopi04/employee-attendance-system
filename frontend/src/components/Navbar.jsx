import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import "./Navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!user) return null;

  const isEmployee = user.role === "employee";
  const isManager = user.role === "manager";

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to={isEmployee ? "/employee/dashboard" : "/manager/dashboard"}
          className="navbar-brand"
        >
          <span className="navbar-brand-icon">📊</span>
          <span>Attendance System</span>
        </Link>
        <div className="navbar-menu">
          {isEmployee && (
            <>
              <Link
                to="/employee/dashboard"
                className={`navbar-link ${isActive("/employee/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/employee/mark"
                className={`navbar-link ${isActive("/employee/mark") ? "active" : ""}`}
              >
                Mark Attendance
              </Link>
              <Link
                to="/employee/history"
                className={`navbar-link ${isActive("/employee/history") ? "active" : ""}`}
              >
                History
              </Link>
              <Link
                to="/employee/profile"
                className={`navbar-link ${isActive("/employee/profile") ? "active" : ""}`}
              >
                Profile
              </Link>
            </>
          )}
          {isManager && (
            <>
              <Link
                to="/manager/dashboard"
                className={`navbar-link ${isActive("/manager/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/manager/attendance"
                className={`navbar-link ${isActive("/manager/attendance") ? "active" : ""}`}
              >
                All Attendance
              </Link>
              <Link
                to="/manager/calendar"
                className={`navbar-link ${isActive("/manager/calendar") ? "active" : ""}`}
              >
                Calendar
              </Link>
              <Link
                to="/manager/reports"
                className={`navbar-link ${isActive("/manager/reports") ? "active" : ""}`}
              >
                Reports
              </Link>
            </>
          )}
          <div className="navbar-user">
            <span className="navbar-user-name">{user.name}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
