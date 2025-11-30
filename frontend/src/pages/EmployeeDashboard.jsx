import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function EmployeeDashboard() {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchDashboard();
  }, [token]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/employee");
      setDashboardData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            <div className="loading">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  const { todayStatus, monthlyStats, recentAttendance } = dashboardData || {};

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-card-icon present">
                <span>✓</span>
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Present (Mo)</div>
                <div className="summary-card-value">{monthlyStats?.present || 0}</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-card-icon absent">
                <span>✕</span>
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Absent (Mo)</div>
                <div className="summary-card-value">{monthlyStats?.absent || 0}</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-card-icon late">
                <span>🕐</span>
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Late (Mo)</div>
                <div className="summary-card-value">{monthlyStats?.late || 0}</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-card-icon hours">
                <span>💼</span>
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Hours (Mo)</div>
                <div className="summary-card-value">{monthlyStats?.totalHours?.toFixed(1) || 0.0}</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* Today's Action */}
            <div className="dashboard-card today-action">
              <div className="card-title">Today&apos;s Action</div>
              <div className="card-date">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              
              {todayStatus?.checkedIn ? (
                <>
                  <div className="action-circle completed">
                    <span className="action-icon">✓</span>
                  </div>
                  <button className="action-button completed" disabled>
                    Day Completed
                  </button>
                  <div className="action-times">
                    <div className="time-item">
                      <span className="time-label">In:</span>
                      <span className="time-value">{todayStatus.checkInTime}</span>
                    </div>
                    {todayStatus.checkOutTime && (
                      <div className="time-item">
                        <span className="time-label">Out:</span>
                        <span className="time-value">{todayStatus.checkOutTime}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="action-circle pending">
                    <span className="action-icon">🕐</span>
                  </div>
                  <button className="action-button pending" disabled>
                    Not Checked In
                  </button>
                </>
              )}
            </div>

            {/* Recent Activity */}
            <div className="dashboard-card recent-activity">
              <div className="card-title">Recent Activity</div>
              <div className="activity-list">
                {recentAttendance?.length > 0 ? (
                  recentAttendance.map((record) => (
                    <div key={record._id} className="activity-item">
                      <div className={`activity-bar ${record.status === "present" ? "present" : record.status === "late" ? "late" : "absent"}`}></div>
                      <div className="activity-content">
                        <div className="activity-date">{record.date}</div>
                        <div className="activity-time">
                          {record.checkInTime || "N/A"} - {record.checkOutTime || "N/A"}
                        </div>
                        <div className={`activity-tag ${record.status === "present" ? "present" : record.status === "late" ? "late" : "absent"}`}>
                          {record.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-activity">No recent activity</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
