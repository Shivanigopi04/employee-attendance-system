const Attendance = require("../models/Attendance");
const User = require("../models/User");
const mongoose = require("mongoose");
const moment = require("moment");
const { Parser } = require("json2csv");

// ------------------------------
// Get All Employees Attendance
// ------------------------------
exports.getAllAttendance = async (req, res) => {
  try {
    const { employee, date, status } = req.query;

    let filter = {};

    if (employee) {
      filter.userId = mongoose.Types.ObjectId.isValid(employee)
        ? employee
        : employee;
    }
    if (date) filter.date = date;
    if (status) filter.status = status;

    const records = await Attendance.find(filter)
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ------------------------------
// Get Specific Employee Attendance
// ------------------------------
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const userId = req.params.id;

    const records = await Attendance.find({ userId }).populate(
      "userId",
      "name email employeeId department"
    );

    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ------------------------------
// Team Summary
// ------------------------------
exports.teamSummary = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    const attendance = await Attendance.find();

    const summary = {
      totalEmployees: employees.length,
      present: attendance.filter((a) => a.status === "present").length,
      absent: attendance.filter((a) => a.status === "absent").length,
      late: attendance.filter((a) => a.status === "late").length,
      halfDay: attendance.filter((a) => a.status === "half-day").length,
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ------------------------------
// Today's Status (Who is present today)
// ------------------------------
exports.todayStatus = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    const records = await Attendance.find({ date: today }).populate(
      "userId",
      "name employeeId department"
    );

    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ------------------------------
// Export CSV
// ------------------------------
exports.exportCSV = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    let filter = {};

    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }
    if (employeeId) {
      filter.userId = employeeId;
    }

    const attendance = await Attendance.find(filter).populate(
      "userId",
      "name email employeeId department"
    );

    const data = attendance.map((a) => ({
      name: a.userId.name,
      email: a.userId.email,
      employeeId: a.userId.employeeId,
      department: a.userId.department,
      date: a.date,
      checkInTime: a.checkInTime || "N/A",
      checkOutTime: a.checkOutTime || "N/A",
      status: a.status,
      totalHours: a.totalHours || 0,
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance_report.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
