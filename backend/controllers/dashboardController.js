const Attendance = require("../models/Attendance");
const User = require("../models/User");
const moment = require("moment");

// ----------------------
// Employee Dashboard
// ----------------------
exports.employeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().format("YYYY-MM-DD");
    const currentMonth = moment().format("YYYY-MM");

    // Today's status
    const todayRecord = await Attendance.findOne({ userId, date: today });

    // This month's records
    const monthRecords = await Attendance.find({
      userId,
      date: { $regex: currentMonth },
    });

    // Calculate stats
    const present = monthRecords.filter((r) => r.status === "present").length;
    const absent = monthRecords.filter((r) => r.status === "absent").length;
    const late = monthRecords.filter((r) => r.status === "late").length;
    const totalHours = monthRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);

    // Recent attendance (last 7 days)
    const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
    const recentRecords = await Attendance.find({
      userId,
      date: { $gte: sevenDaysAgo },
    })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      todayStatus: todayRecord
        ? {
            checkedIn: !!todayRecord.checkInTime,
            checkedOut: !!todayRecord.checkOutTime,
            checkInTime: todayRecord.checkInTime,
            checkOutTime: todayRecord.checkOutTime,
            status: todayRecord.status,
          }
        : { checkedIn: false, checkedOut: false },
      monthlyStats: {
        present,
        absent,
        late,
        totalHours: Math.round(totalHours * 100) / 100,
      },
      recentAttendance: recentRecords,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ----------------------
// Manager Dashboard
// ----------------------
exports.managerDashboard = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    // Total employees
    const totalEmployees = await User.countDocuments({ role: "employee" });

    // Today's attendance
    const todayRecords = await Attendance.find({ date: today }).populate(
      "userId",
      "name employeeId department"
    );

    const presentToday = todayRecords.filter((r) =>
      ["present", "late"].includes(r.status)
    ).length;
    const absentToday = totalEmployees - presentToday;
    const lateToday = todayRecords.filter((r) => r.status === "late").length;

    // Weekly attendance trend (last 7 days)
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, "days").format("YYYY-MM-DD");
      const dayRecords = await Attendance.find({ date });
      weeklyTrend.push({
        date,
        present: dayRecords.filter((r) =>
          ["present", "late"].includes(r.status)
        ).length,
      });
    }

    // Department-wise attendance
    const employees = await User.find({ role: "employee" });
    const departmentStats = {};
    employees.forEach((emp) => {
      if (!departmentStats[emp.department]) {
        departmentStats[emp.department] = { total: 0, present: 0 };
      }
      departmentStats[emp.department].total++;
    });

    const todayAttendanceByDept = {};
    todayRecords.forEach((record) => {
      const dept = record.userId.department;
      if (!todayAttendanceByDept[dept]) {
        todayAttendanceByDept[dept] = 0;
      }
      if (["present", "late"].includes(record.status)) {
        todayAttendanceByDept[dept]++;
      }
    });

    Object.keys(departmentStats).forEach((dept) => {
      departmentStats[dept].present =
        todayAttendanceByDept[dept] || 0;
    });

    // Absent employees today
    const allEmployeeIds = employees.map((e) => e._id.toString());
    const presentEmployeeIds = todayRecords.map((r) =>
      r.userId._id.toString()
    );
    const absentEmployeeIds = allEmployeeIds.filter(
      (id) => !presentEmployeeIds.includes(id)
    );
    const absentEmployees = await User.find({
      _id: { $in: absentEmployeeIds },
    }).select("name employeeId department");

    res.json({
      totalEmployees,
      todayStats: {
        present: presentToday,
        absent: absentToday,
        late: lateToday,
      },
      weeklyTrend,
      departmentStats: Object.entries(departmentStats).map(([dept, stats]) => ({
        department: dept,
        total: stats.total,
        present: stats.present,
        percentage: Math.round((stats.present / stats.total) * 100),
      })),
      absentEmployees: absentEmployees.map((emp) => ({
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department,
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

