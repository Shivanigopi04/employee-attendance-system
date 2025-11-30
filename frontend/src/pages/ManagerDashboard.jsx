import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function ManagerDashboard() {
  const { token } = useSelector((state) => state.auth);
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
      const res = await API.get("/dashboard/manager");
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

  const {
    totalEmployees,
    todayStats,
    weeklyTrend,
    departmentStats,
    absentEmployees,
  } = dashboardData || {};

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-card-icon present">
                <span>👥</span>
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Total Employees</div>
                <div className="summary-card-value">{totalEmployees || 0}</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-card-icon present">
                <span>✓</span>
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Present Today</div>
                <div className="summary-card-value">{todayStats?.present || 0}</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-card-icon absent">
                <span>✕</span>
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Absent Today</div>
                <div className="summary-card-value">{todayStats?.absent || 0}</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-card-icon late">
                <span>🕐</span>
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Late Arrivals</div>
                <div className="summary-card-value">{todayStats?.late || 0}</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* Weekly Trend Chart */}
            <div className="dashboard-card">
              <div className="card-title">Weekly Attendance Trend</div>
              <div className="chart-container">
                <div className="chart-bars">
                  {weeklyTrend?.map((day, idx) => {
                    const height = totalEmployees > 0
                      ? Math.max((day.present / totalEmployees) * 100, 10)
                      : 10;
                    return (
                      <div key={idx} className="chart-bar-item">
                        <div className="chart-bar-wrapper">
                          <div
                            className="chart-bar-fill-blue"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <div className="chart-bar-label">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Department Stats */}
            <div className="dashboard-card">
              <div className="card-title">Department-wise Attendance</div>
              <div className="department-list">
                {departmentStats?.length > 0 ? (
                  departmentStats.map((dept, idx) => (
                    <div key={idx} className="department-item">
                      <div className="department-header">
                        <span className="department-name">{dept.department}</span>
                        <span className="department-stats">
                          {dept.present}/{dept.total}
                        </span>
                      </div>
                      <div className="department-progress">
                        <div
                          className="department-progress-fill"
                          style={{ width: `${dept.percentage}%` }}
                        />
                      </div>
                      <div className="department-percentage">{dept.percentage}%</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No department data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Absent Employees */}
          {absentEmployees?.length > 0 && (
            <div className="dashboard-card" style={{ marginTop: "1.5rem" }}>
              <div className="card-title">Absent Employees Today</div>
              <div className="absent-list">
                {absentEmployees.map((emp, idx) => (
                  <div key={idx} className="absent-item">
                    <div className="absent-avatar">{emp.name?.[0]?.toUpperCase() || "E"}</div>
                    <div className="absent-info">
                      <div className="absent-name">{emp.name}</div>
                      <div className="absent-details">
                        {emp.employeeId} • {emp.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
