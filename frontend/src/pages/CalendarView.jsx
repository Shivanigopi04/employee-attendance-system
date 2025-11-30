import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function CalendarView() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateData, setSelectedDateData] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchAttendance();
  }, [token, selectedMonth]);

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/all");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateData = attendance.filter((a) => a.date === date);
    setSelectedDateData(dateData);
  };

  const getDateStatus = (date) => {
    const dateRecords = attendance.filter((a) => a.date === date);
    if (dateRecords.length === 0) return null;

    const presentCount = dateRecords.filter((a) =>
      ["present", "late"].includes(a.status)
    ).length;
    const totalCount = dateRecords.length;

    if (presentCount === totalCount) return "all-present";
    if (presentCount === 0) return "all-absent";
    return "partial";
  };

  const generateCalendar = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({
        day,
        date: dateStr,
        status: getDateStatus(dateStr),
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
            <div className="loading">Loading calendar...</div>
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
            {/* Calendar Header */}
            <div className="calendar-header-section">
              <h1 className="calendar-title">{getMonthName()}</h1>
              <div className="calendar-nav">
                <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
                  Prev
                </button>
                <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>
                  Next
                </button>
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

                  const { day, date, status } = dayData;
                  const hasStatus = status !== null;

                  return (
                    <div
                      key={idx}
                      className={`calendar-day-cell ${hasStatus ? "has-record" : ""} ${
                        status === "all-present" ? "all-present" :
                        status === "all-absent" ? "all-absent" :
                        status === "partial" ? "partial" : ""
                      }`}
                      onClick={() => handleDateClick(date)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="calendar-day-number">{day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="legend-section">
              <div className="legend-item">
                <div className="legend-color all-present" />
                <span>All Present</span>
              </div>
              <div className="legend-item">
                <div className="legend-color partial" />
                <span>Partial</span>
              </div>
              <div className="legend-item">
                <div className="legend-color all-absent" />
                <span>All Absent</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }} />
                <span>No Data</span>
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="dashboard-card" style={{ marginTop: "2rem" }}>
                <div className="card-title">Attendance Details - {selectedDate}</div>
                <button
                  className="btn-close"
                  onClick={() => setSelectedDate(null)}
                >
                  ✕ Close
                </button>
                <div className="table-container" style={{ marginTop: "1rem" }}>
                  {selectedDateData.length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Employee ID</th>
                          <th>Department</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDateData.map((record) => (
                          <tr key={record._id}>
                            <td>
                              <strong>{record.userId?.name || "N/A"}</strong>
                            </td>
                            <td>{record.userId?.employeeId || "N/A"}</td>
                            <td>{record.userId?.department || "N/A"}</td>
                            <td>{record.checkInTime || "N/A"}</td>
                            <td>{record.checkOutTime || "N/A"}</td>
                            <td>
                              <span
                                className={`status-badge ${
                                  record.status === "present"
                                    ? "present"
                                    : record.status === "late"
                                    ? "late"
                                    : "absent"
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">No attendance records for this date</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
