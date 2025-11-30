const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getAllAttendance,
  getEmployeeAttendance,
  teamSummary,
  todayStatus,
  exportCSV,
} = require("../controllers/managerController");

// Manager routes
router.get("/all", auth, getAllAttendance);
router.get("/employee/:id", auth, getEmployeeAttendance);
router.get("/summary", auth, teamSummary);
router.get("/today-status", auth, todayStatus);
router.get("/export", auth, exportCSV);

module.exports = router;
