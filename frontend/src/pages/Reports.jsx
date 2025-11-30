import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function Reports() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    employeeId: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchAllAttendance();
  }, [token]);

  const fetchAllAttendance = async () => {
    try {
      const res = await API.get("/attendance/all");
      setAttendance(res.data);
      // Extract unique employees
      const uniqueEmployees = Array.from(
        new Set(res.data.map((a) => a.userId?._id))
      ).map((id) => res.data.find((a) => a.userId?._id === id)?.userId);
      setEmployees(uniqueEmployees.filter(Boolean));
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = () => {
    setLoading(true);
    fetchAllAttendance();
    setTimeout(() => setLoading(false), 500);
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.employeeId) params.append("employeeId", filters.employeeId);

      const res = await API.get(`/attendance/export?${params.toString()}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("Report exported successfully!");
    } catch (err) {
      alert("Failed to export report");
      console.error(err);
    }
  };

  const getFilteredAttendance = () => {
    let filtered = [...attendance];

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(
        (a) => a.date >= filters.startDate && a.date <= filters.endDate
      );
    }

    if (filters.employeeId) {
      filtered = filtered.filter(
        (a) => a.userId?._id === filters.employeeId
      );
    }

    return filtered;
  };

  const filteredData = getFilteredAttendance();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-title">Attendance Reports</div>
            
            {/* Filters */}
            <div className="filters-section">
              <div className="filter-group">
                <label className="filter-label">Start Date</label>
                <input
                  type="date"
                  className="filter-input"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">End Date</label>
                <input
                  type="date"
                  className="filter-input"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Employee</label>
                <select
                  className="filter-input"
                  value={filters.employeeId}
                  onChange={(e) =>
                    setFilters({ ...filters, employeeId: e.target.value })
                  }
                >
                  <option value="">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <button className="btn-export" onClick={handleExport}>
                  📥 Export to CSV
                </button>
              </div>
            </div>

            {/* Report Table */}
            <div className="table-container">
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                      <th>Total Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((record) => (
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
                          <td>
                            <strong>{record.totalHours?.toFixed(1) || 0}h</strong>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="empty-state">
                          No records found for selected filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
