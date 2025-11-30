import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!user) return null;

  const isEmployee = user.role === "employee";
  const isManager = user.role === "manager";

  const isActive = (path) => location.pathname === path;

  const employeeMenu = [
    { path: "/employee/dashboard", label: "My Dashboard", icon: "▦" },
    { path: "/employee/mark", label: "Mark Attendance", icon: "✓" },
    { path: "/employee/history", label: "My History", icon: "📅" },
    { path: "/employee/profile", label: "Profile", icon: "👤" },
  ];

  const managerMenu = [
    { path: "/manager/dashboard", label: "Dashboard", icon: "▦" },
    { path: "/manager/attendance", label: "All Attendance", icon: "📋" },
    { path: "/manager/calendar", label: "Calendar", icon: "📅" },
    { path: "/manager/reports", label: "Reports", icon: "📈" },
    { path: "/manager/profile", label: "Profile", icon: "👤" },
  ];

  const menuItems = isEmployee ? employeeMenu : managerMenu;

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 1) || "U";
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">🕐</div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-title">LogMe</div>
          <div className="sidebar-brand-subtitle">Attendance System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{getInitials(user?.name)}</div>
          <span className="sidebar-user-text">{user?.role === "employee" ? "Employee" : "Manager"}</span>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-label">Logout</span>
          <span className="sidebar-arrow">→</span>
        </button>
      </div>
    </aside>
  );
}
