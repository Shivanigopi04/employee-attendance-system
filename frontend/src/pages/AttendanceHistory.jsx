import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function AttendanceHistory() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [allHistory, setAllHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateRecord, setSelectedDateRecord] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchHistory();
  }, [token, selectedMonth]);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/attendance/my-history");
      setAllHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCalendarStatus = (date) => {
    const record = allHistory.find((r) => r.date === date);
    return record || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "present";
      case "absent":
        return "absent";
      case "late":
        return "late";
      case "half-day":
        return "halfday";
      default:
        return null;
    }
  };

  const handleDateClick = (date, record) => {
    setSelectedDate(date);
    setSelectedDateRecord(record);
  };

  const generateCalendar = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month - 1;

    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const record = getCalendarStatus(dateStr);
      const isToday = isCurrentMonth && day === today.getDate();
      
      days.push({
        day,
        date: dateStr,
        record,
        isToday,
      });
    }
    
    return days;
  };

  const getMonthName = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const changeMonth = (direction) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    let newMonth = month + direction;
    let newYear = year;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            <div className="loading">Loading history...</div>
          </div>
        </div>
      </div>
    );
  }

  const calendarDays = generateCalendar();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="calendar-container">
            {/* Calendar Header with Month Filter */}
            <div className="calendar-header-section">
              <h1 className="calendar-title">{getMonthName()}</h1>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div className="month-filter-group">
                  <label className="filter-label" style={{ marginBottom: "0.5rem", display: "block" }}>
                    Filter by Month
                  </label>
                  <input
                    type="month"
                    className="filter-input"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ width: "180px" }}
                  />
                </div>
                <div className="calendar-nav">
                  <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
                    Prev
                  </button>
                  <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-view">
              <div className="calendar-weekdays">
                {weekDays.map((day) => (
                  <div key={day} className="calendar-weekday">
                    {day}
                  </div>
                ))}
              </div>
              <div className="calendar-days">
                {calendarDays.map((dayData, idx) => {
                  if (!dayData) {
                    return <div key={idx} className="calendar-day-empty" />;
                  }

                  const { day, date, record, isToday } = dayData;
                  const hasRecord = record !== null;
                  const statusClass = hasRecord ? getStatusColor(record.status) : null;

                  return (
                    <div
                      key={idx}
                      className={`calendar-day-cell ${isToday ? "today" : ""} ${
                        hasRecord ? `has-record status-${statusClass}` : ""
                      }`}
                      onClick={() => handleDateClick(date, record)}
                      style={{ cursor: hasRecord ? "pointer" : "default" }}
                      title={hasRecord ? `Click to view details for ${date}` : ""}
                    >
                      <div className="calendar-day-number">{day}</div>
                      {hasRecord && (
                        <div className="calendar-day-record">
                          <div className={`calendar-status-badge ${statusClass}`}>
                            {record.status === "half-day" ? "Half" : record.status}
                          </div>
                          {record.checkInTime && (
                            <div className="calendar-time">{record.checkInTime}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="legend-section">
              <div className="legend-item">
                <div className="legend-color status-present" />
                <span>Present</span>
              </div>
              <div className="legend-item">
                <div className="legend-color status-late" />
                <span>Late</span>
              </div>
              <div className="legend-item">
                <div className="legend-color status-absent" />
                <span>Absent</span>
              </div>
              <div className="legend-item">
                <div className="legend-color status-halfday" />
                <span>Half Day</span>
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && selectedDateRecord && (
              <div className="dashboard-card" style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div className="card-title">Attendance Details - {selectedDate}</div>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedDateRecord(null);
                    }}
                  >
                    ✕ Close
                  </button>
                </div>
                <div className="attendance-details-card">
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge ${getStatusColor(selectedDateRecord.status)}`}>
                      {selectedDateRecord.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Check In Time</span>
                    <span className="detail-value">
                      {selectedDateRecord.checkInTime || "N/A"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Check Out Time</span>
                    <span className="detail-value">
                      {selectedDateRecord.checkOutTime || "N/A"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Hours</span>
                    <span className="detail-value">
                      {selectedDateRecord.totalHours?.toFixed(1) || 0}h
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
