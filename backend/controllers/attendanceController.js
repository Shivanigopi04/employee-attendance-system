const Attendance = require("../models/Attendance");
const moment = require("moment");

// ----------------------
// Check In
// ----------------------
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().format("YYYY-MM-DD");
    const checkInTime = moment().format("HH:mm");

    // check if already checked in
    const existing = await Attendance.findOne({ userId, date: today });
    if (existing)
      return res.status(400).json({ msg: "Already checked in today" });

    // Check if late (after 9:00 AM)
    const checkInMoment = moment(checkInTime, "HH:mm");
    const expectedTime = moment("09:00", "HH:mm");
    const isLate = checkInMoment.isAfter(expectedTime);

    const attendance = await Attendance.create({
      userId,
      date: today,
      checkInTime,
      status: isLate ? "late" : "present",
    });

    res.json({ msg: "Checked in successfully", attendance });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ----------------------
// Check Out
// ----------------------
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    const attendance = await Attendance.findOne({ userId, date: today });
    if (!attendance)
      return res.status(400).json({ msg: "You have not checked in today" });

    if (attendance.checkOutTime)
      return res.status(400).json({ msg: "Already checked out today" });

    attendance.checkOutTime = moment().format("HH:mm");

    // Calculate total hours
    const start = moment(attendance.checkInTime, "HH:mm");
    const end = moment(attendance.checkOutTime, "HH:mm");
    attendance.totalHours = end.diff(start, "hours", true);

    await attendance.save();

    res.json({ msg: "Checked out successfully", attendance });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ----------------------
// My Attendance History
// ----------------------
exports.myHistory = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ----------------------
// Monthly Summary
// ----------------------
exports.mySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const month = req.query.month; // YYYY-MM

    const records = await Attendance.find({
      userId,
      date: { $regex: month }, // matches YYYY-MM
    });

    const summary = {
      present: records.filter((i) => i.status === "present").length,
      absent: records.filter((i) => i.status === "absent").length,
      late: records.filter((i) => i.status === "late").length,
      halfday: records.filter((i) => i.status === "half-day").length,
      totalHours: records.reduce((a, b) => a + b.totalHours, 0),
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ----------------------
// Today's Status
// ----------------------
exports.todayStatus = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    const record = await Attendance.findOne({
      userId: req.user.id,
      date: today,
    });

    res.json(record || { msg: "Not checked in yet" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ----------------------
// Apply Leave (Mark as Absent)
// ----------------------
exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, reason } = req.body;
    const leaveDate = date || moment().format("YYYY-MM-DD");

    // Check if record already exists
    const existing = await Attendance.findOne({ userId, date: leaveDate });
    if (existing) {
      return res.status(400).json({ msg: "Attendance already recorded for this date" });
    }

    // Create absent record with leave reason
    const attendance = await Attendance.create({
      userId,
      date: leaveDate,
      status: "absent",
      leaveReason: reason || null,
    });

    res.json({ msg: "Leave applied successfully", attendance });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
