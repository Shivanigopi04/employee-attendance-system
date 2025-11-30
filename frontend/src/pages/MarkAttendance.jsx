import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function MarkAttendance() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveReason, setLeaveReason] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchTodayStatus();
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [token]);

  const fetchTodayStatus = async () => {
    try {
      const res = await API.get("/attendance/today");
      setTodayStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await API.post("/attendance/checkin");
      const isLate = res.data.attendance.status === "late";
      
      if (isLate) {
        alert(
          `Checked in successfully at ${res.data.attendance.checkInTime}! You are marked as LATE (checked in after 9:00 AM).`
        );
      } else {
        alert("Checked in successfully!");
      }
      fetchTodayStatus();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to check in");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await API.post("/attendance/checkout");
      alert("Checked out successfully!");
      fetchTodayStatus();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to check out");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      alert("Please provide a reason for leave");
      return;
    }

    setActionLoading(true);
    try {
      await API.post("/attendance/apply-leave", {
        date: leaveDate,
        reason: leaveReason,
      });
      alert("Leave applied successfully!");
      setShowLeaveForm(false);
      setLeaveReason("");
      setLeaveDate(new Date().toISOString().split("T")[0]);
      fetchTodayStatus();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to apply leave");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            <div className="loading">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const isCheckedIn = todayStatus?.checkInTime;
  const isCheckedOut = todayStatus?.checkOutTime;
  const isAbsent = todayStatus?.status === "absent";
  const isLate = todayStatus?.status === "late";

  // Check if current time is after 9:00 AM
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const isCurrentlyLate = currentHour > 9 || (currentHour === 9 && currentMinute > 0);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="card-title">Mark Attendance</div>
            <div className="card-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {todayStatus?.checkInTime || isAbsent ? (
              <>
                <div className={`action-circle ${isAbsent ? "absent" : "completed"}`}>
                  <span className="action-icon">{isAbsent ? "✕" : "✓"}</span>
                </div>
                <div className="attendance-info-card">
                  <div className="info-row">
                    <span className="info-label">Status</span>
                    <span
                      className={`status-badge ${
                        todayStatus.status === "present"
                          ? "present"
                          : todayStatus.status === "late"
                          ? "late"
                          : todayStatus.status === "absent"
                          ? "absent"
                          : "present"
                      }`}
                    >
                      {todayStatus.status}
                    </span>
                  </div>
                  {todayStatus.checkInTime && (
                    <div className="info-row">
                      <span className="info-label">Check In Time</span>
                      <span className="info-value">
                        {todayStatus.checkInTime}
                        {isLate && (
                          <span style={{ color: "#f59e0b", marginLeft: "0.5rem", fontSize: "0.75rem" }}>
                            (Late - after 9:00 AM)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {todayStatus.checkOutTime && (
                    <div className="info-row">
                      <span className="info-label">Check Out Time</span>
                      <span className="info-value">{todayStatus.checkOutTime}</span>
                    </div>
                  )}
                  {todayStatus.leaveReason && (
                    <div className="info-row">
                      <span className="info-label">Leave Reason</span>
                      <span className="info-value">{todayStatus.leaveReason}</span>
                    </div>
                  )}
                </div>
                {!isCheckedOut && !isAbsent && (
                  <button
                    className="action-button checkout"
                    onClick={handleCheckOut}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Check Out"}
                  </button>
                )}
                {(isCheckedOut || isAbsent) && (
                  <button className="action-button completed" disabled>
                    {isAbsent ? "Leave Applied" : "Day Completed"}
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="action-circle pending">
                  <span className="action-icon">🕐</span>
                </div>
                <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.875rem", color: "#64748b" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span><strong>Current Time:</strong> {currentTime.toLocaleTimeString()}</span>
                    {isCurrentlyLate && (
                      <span style={{ color: "#f59e0b", fontWeight: 600 }}>⚠️ Late (after 9:00 AM)</span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                    <strong>Note:</strong> Check-in after 9:00 AM will be automatically marked as <strong>Late</strong>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                  <button
                    className="action-button checkin"
                    onClick={handleCheckIn}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Check In"}
                  </button>
                  <div style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem" }}>
                    OR
                  </div>
                  <button
                    className="action-button leave"
                    onClick={() => setShowLeaveForm(true)}
                    disabled={actionLoading}
                  >
                    Apply Leave (Mark as Absent)
                  </button>
                </div>
              </>
            )}

            {/* Leave Application Form */}
            {showLeaveForm && (
              <div className="leave-form-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#1e293b" }}>
                    Apply for Leave
                  </h3>
                  <button
                    className="btn-close-small"
                    onClick={() => {
                      setShowLeaveForm(false);
                      setLeaveReason("");
                    }}
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleApplyLeave}>
                  <div className="form-field">
                    <label className="form-label">Leave Date</label>
                    <input
                      type="date"
                      className="auth-input"
                      value={leaveDate}
                      onChange={(e) => setLeaveDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Reason for Leave</label>
                    <textarea
                      className="auth-input"
                      rows="4"
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Enter reason for leave..."
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <button
                      type="submit"
                      className="action-button leave-submit"
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing..." : "Submit Leave"}
                    </button>
                    <button
                      type="button"
                      className="action-button cancel"
                      onClick={() => {
                        setShowLeaveForm(false);
                        setLeaveReason("");
                      }}
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
