import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function AllAttendance() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    employee: "",
    date: "",
    status: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchAttendance();
  }, [token]);

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.employee) params.append("employee", filters.employee);
      if (filters.date) params.append("date", filters.date);
      if (filters.status) params.append("status", filters.status);

      const res = await API.get(`/attendance/all?${params.toString()}`);
      setAttendance(res.data);
      // Extract unique employees
      const uniqueEmployees = Array.from(
        new Set(res.data.map((a) => a.userId?._id))
      ).map((id) => res.data.find((a) => a.userId?._id === id)?.userId);
      setEmployees(uniqueEmployees.filter(Boolean));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "present";
      case "absent":
        return "absent";
      case "late":
        return "late";
      default:
        return "present";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            <div className="loading">Loading attendance data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-title">All Employees Attendance</div>
            
            {/* Filters */}
            <div className="filters-section">
              <div className="filter-group">
                <label className="filter-label">Employee</label>
                <select
                  className="filter-input"
                  value={filters.employee}
                  onChange={(e) =>
                    setFilters({ ...filters, employee: e.target.value })
                  }
                >
                  <option value="">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp?._id} value={emp?._id}>
                      {emp?.name} ({emp?.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Date</label>
                <input
                  type="date"
                  className="filter-input"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select
                  className="filter-input"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length > 0 ? (
                    attendance.map((record) => (
                      <tr key={record._id}>
                        <td>
                          <strong>{record.userId?.name || "N/A"}</strong>
                        </td>
                        <td>{record.userId?.employeeId || "N/A"}</td>
                        <td>{record.userId?.department || "N/A"}</td>
                        <td>{record.date}</td>
                        <td>{record.checkInTime || "N/A"}</td>
                        <td>{record.checkOutTime || "N/A"}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>
                          <strong>{record.totalHours?.toFixed(1) || 0}h</strong>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
