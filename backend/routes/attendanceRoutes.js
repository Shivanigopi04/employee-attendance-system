const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const {
  checkIn,
  checkOut,
  myHistory,
  mySummary,
  todayStatus,
  applyLeave,
} = require("../controllers/attendanceController");

const {
  getAllAttendance,
  getEmployeeAttendance,
  teamSummary,
  todayStatus: managerTodayStatus,
  exportCSV,
} = require("../controllers/managerController");

// Employee Attendance APIs
router.post("/checkin", auth, checkRole(["employee"]), checkIn);
router.post("/checkout", auth, checkRole(["employee"]), checkOut);
router.post("/apply-leave", auth, checkRole(["employee"]), applyLeave);
router.get("/my-history", auth, checkRole(["employee"]), myHistory);
router.get("/my-summary", auth, checkRole(["employee"]), mySummary);
router.get("/today", auth, checkRole(["employee"]), todayStatus);

// Manager Attendance APIs
router.get("/all", auth, checkRole(["manager"]), getAllAttendance);
router.get("/employee/:id", auth, checkRole(["manager"]), getEmployeeAttendance);
router.get("/summary", auth, checkRole(["manager"]), teamSummary);
router.get("/today-status", auth, checkRole(["manager"]), managerTodayStatus);
router.get("/export", auth, checkRole(["manager"]), exportCSV);

module.exports = router;
