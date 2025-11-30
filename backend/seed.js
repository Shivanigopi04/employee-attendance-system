const mongoose = require("mongoose");
const User = require("./models/User");
const Attendance = require("./models/Attendance");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");

    // Clear old data
    await User.deleteMany();
    await Attendance.deleteMany();
    console.log("Old data removed");

    // Create manager
    await User.create({
      name: "Manager",
      email: "manager@example.com",
      password: await bcrypt.hash("manager123", 10),
      role: "manager",
      employeeId: "MGR001",
      department: "Management",
    });

    console.log("Manager Created");

    // Create employees
    const employees = await User.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "employee",
        employeeId: "EMP001",
        department: "IT",
      },
      {
        name: "Priya Sharma",
        email: "priya@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "employee",
        employeeId: "EMP002",
        department: "HR",
      },
      {
        name: "Amit Kumar",
        email: "amit@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "employee",
        employeeId: "EMP003",
        department: "Finance",
      },
    ]);

    console.log("Employees Created");

    // Generate past 7 working days (excluding Sat & Sun)
    const dates = [];
    let current = new Date();

    while (dates.length < 7) {
      const day = current.getDay(); // 0=Sun, 6=Sat
      if (day !== 0 && day !== 6) {
        dates.push(current.toISOString().split("T")[0]);
      }
      current.setDate(current.getDate() - 1);
    }

    const attendanceData = [];

    employees.forEach((emp) => {
      dates.forEach((date) => {
        const random = Math.random();

        // 15% chance absent (simulate leave or no check-in)
        if (random < 0.15) {
          attendanceData.push({
            userId: emp._id,
            date,
            checkInTime: null,
            checkOutTime: null,
            status: "absent",
            totalHours: 0,
          });
          return;
        }

        let checkIn;
        let status;

        // 75% chance present
        if (random < 0.90) {
          // Check in between 08:30–09:00 (present)
          const mins = Math.floor(Math.random() * 30);
          checkIn = `08:${mins.toString().padStart(2, "0")}`;
          status = "present";
        } else {
          // Late (09:01–10:00)
          const mins = Math.floor(Math.random() * 59);
          checkIn = `09:${(mins + 1).toString().padStart(2, "0")}`;
          status = "late";
        }

        // Checkout between 17:30–18:00
        const checkoutMin = Math.floor(Math.random() * 30);
        const checkOutTime = `17:${(30 + checkoutMin).toString().padStart(2, "0")}`;

        attendanceData.push({
          userId: emp._id,
          date,
          checkInTime: checkIn,
          checkOutTime: checkOutTime,
          status,
          totalHours: 8 + Math.random(),
        });
      });
    });

    await Attendance.insertMany(attendanceData);

    console.log("Attendance Seed Created Successfully (7 working days, weekends skipped)");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
