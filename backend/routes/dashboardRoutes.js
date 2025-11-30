const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const {
  employeeDashboard,
  managerDashboard,
} = require("../controllers/dashboardController");

router.get("/employee", auth, checkRole(["employee"]), employeeDashboard);
router.get("/manager", auth, checkRole(["manager"]), managerDashboard);

module.exports = router;

