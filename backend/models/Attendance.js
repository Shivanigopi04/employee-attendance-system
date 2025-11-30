const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    checkInTime: {
      type: String,
      default: null,
    },
    checkOutTime: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day"],
      default: "present",
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    leaveReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
