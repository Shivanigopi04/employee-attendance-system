import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import "./TopHeader.css";

export default function TopHeader() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <header className="top-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Dashboard</h1>
        </div>

        <div className="header-right">
          {/* Profile */}
          <div className="header-profile">
            <button
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {user?.name ? getInitials(user.name) : "U"}
              </div>
              <span className="profile-arrow">▼</span>
            </button>

            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-menu-avatar">
                    {user?.name ? getInitials(user.name) : "U"}
                  </div>
                  <div className="profile-menu-info">
                    <div className="profile-menu-name">{user?.name || "User"}</div>
                    <div className="profile-menu-email">{user?.email || ""}</div>
                  </div>
                </div>
                <div className="profile-menu-divider"></div>
                <a
                  href={user?.role === "employee" ? "/employee/profile" : "/manager/dashboard"}
                  className="profile-menu-item"
                >
                  <span>👤</span> Profile
                </a>
                <div className="profile-menu-divider"></div>
                <button
                  onClick={handleLogout}
                  className="profile-menu-item logout-item"
                  style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer" }}
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

