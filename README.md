# LogMe - Employee Attendance System

A modern, full-stack employee attendance tracking system with role-based access control, real-time attendance marking, comprehensive reporting, and an intuitive calendar-based interface.

![LogMe](https://img.shields.io/badge/LogMe-Attendance%20System-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-9.0.0-47A248?logo=mongodb)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [How to Run](#how-to-run)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

LogMe is a comprehensive attendance management system designed for modern workplaces. It provides employees with an easy way to mark their attendance, view their history, and apply for leave. Managers can monitor team attendance, generate reports, and export data for analysis.

### Key Highlights

- ✅ **Real-time Attendance Tracking** - Check in/out with automatic late detection
- 📅 **Calendar View** - Visual calendar with color-coded attendance status
- 📊 **Analytics Dashboard** - Comprehensive statistics and insights
- 📝 **Leave Management** - Apply for leave with reason tracking
- 📈 **Reports & Export** - Generate CSV reports for analysis
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access

## ✨ Features

### 👤 Employee Features

1. **Authentication**
   - User registration with employee details
   - Secure login with JWT tokens
   - Profile management

2. **Attendance Marking**
   - Check In / Check Out functionality
   - Automatic late detection (after 9:00 AM)
   - Real-time clock display
   - Leave application with reason

3. **Attendance History**
   - Calendar view with color coding:
     - 🟢 Green: Present
     - 🟡 Yellow: Late
     - 🔴 Red: Absent
     - 🟠 Orange: Half Day
   - Table view with detailed records
   - Month filter for easy navigation
   - Click on date to view details

4. **Monthly Summary**
   - Present/Absent/Late days count
   - Total hours worked
   - Visual progress indicators

5. **Dashboard**
   - Today's attendance status
   - Monthly statistics
   - Recent activity feed
   - Visual charts and progress bars

### 👔 Manager Features

1. **Team Overview**
   - Total employees count
   - Today's attendance summary (Present/Absent/Late)
   - Late arrivals tracking
   - Absent employees list

2. **Attendance Management**
   - View all employees' attendance
   - Filter by employee, date, and status
   - Search and filter functionality

3. **Calendar View**
   - Team attendance calendar
   - Color-coded status indicators
   - Click date to view employee details
   - Month navigation

4. **Reports & Analytics**
   - Weekly attendance trends
   - Department-wise statistics
   - Date range filtering
   - Employee-specific reports
   - CSV export functionality

5. **Dashboard**
   - Team statistics overview
   - Visual charts and graphs
   - Department performance metrics

## 🛠 Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **Redux Toolkit** 2.0.1 - State management
- **React Router** 6.21.1 - Routing
- **Axios** 1.6.2 - HTTP client
- **CSS3** - Modern styling with custom design system

### Backend
- **Node.js** - Runtime environment
- **Express** 5.1.0 - Web framework
- **MongoDB** - Database
- **Mongoose** 9.0.0 - ODM
- **JWT** 9.0.2 - Authentication
- **bcryptjs** 3.0.3 - Password hashing
- **Moment.js** 2.30.1 - Date/time handling
- **json2csv** 6.0.0 - CSV export

### Development Tools
- **Nodemon** - Auto-restart server
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Employee-Attendance-System
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment example file
cp .env.example .env

# Edit .env file with your configuration (see Environment Variables section)
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### Step 4: Start MongoDB

**Option A: Local MongoDB**

```bash
# Windows (if installed as service, starts automatically)
# Or start manually:
mongod

# Mac/Linux
mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URL` in `.env` file

## ⚙️ Environment Variables

### Backend Environment Variables

#### Create .env.example File

First, create a `.env.example` file in the `backend` directory with the following content:

**Windows (PowerShell):**
```powershell
cd backend
@"
# ============================================
# LogMe - Backend Environment Variables
# ============================================
# Copy this file to .env and update with your values
# DO NOT commit .env file to version control

# Server Configuration
PORT=5000

# Database Configuration
# For Local MongoDB:
MONGO_URL=mongodb://localhost:27017/logme-attendance

# For MongoDB Atlas (Cloud):
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/logme-attendance?retryWrites=true&w=majority

# JWT Configuration
# Generate a secure random string for production:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-random-string
"@ | Out-File -FilePath .env.example -Encoding utf8
```

**Mac/Linux:**
```bash
cd backend
cat > .env.example << 'EOF'
# ============================================
# LogMe - Backend Environment Variables
# ============================================
# Copy this file to .env and update with your values
# DO NOT commit .env file to version control

# Server Configuration
PORT=5000

# Database Configuration
# For Local MongoDB:
MONGO_URL=mongodb://localhost:27017/logme-attendance

# For MongoDB Atlas (Cloud):
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/logme-attendance?retryWrites=true&w=majority

# JWT Configuration
# Generate a secure random string for production:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-random-string
EOF
```

**Or manually create the file:**
1. Create a new file named `.env.example` in the `backend` directory
2. Copy and paste the content shown above

#### Create .env File

After creating `.env.example`, copy it to create your `.env` file:

```bash
cd backend
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Then edit `.env` and update the values with your actual configuration.

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/logme-attendance` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-key-here` |

#### Environment File Example

```env
# Server Configuration
PORT=5000

# Database Configuration
# For Local MongoDB:
MONGO_URL=mongodb://localhost:27017/logme-attendance

# For MongoDB Atlas (Cloud):
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/logme-attendance?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-random-string
```

#### Important Notes

- **JWT_SECRET**: Use a strong, random string in production. Generate one using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **MONGO_URL**: 
  - Local: `mongodb://localhost:27017/logme-attendance`
  - Atlas: Use the connection string from your MongoDB Atlas dashboard
- Never commit `.env` file to version control (it's already in `.gitignore`)

### Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:5000`. 

If you change the backend port, update `frontend/src/api/axios.js`:

```javascript
const baseURL = "http://localhost:YOUR_PORT/api";
```

## 🏃 How to Run

### Development Mode

#### 1. Start MongoDB

**Local MongoDB:**
```bash
# Windows (usually starts automatically as service)
# Or manually:
mongod

# Mac/Linux
mongod
```

**MongoDB Atlas:**
- No local setup needed, just ensure your connection string is correct

#### 2. Start Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

Backend API will be available at: `http://localhost:5000`

#### 3. Start Frontend Development Server

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

The frontend will:
- Start on `http://localhost:3000`
- Open automatically in your default browser
- Hot-reload on file changes

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/` directory.

#### Serve Production Build

You can serve the build using:

```bash
# Using serve package
npm install -g serve
serve -s build -l 3000

# Or using nginx, Apache, or any static file server
```

### Running Both Servers

For convenience, you can run both servers in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
*Centered login form with LogMe branding, email and password fields, and login button. Clean and modern interface design.*

### Employee Dashboard
![Employee Dashboard](screenshots/employee-dashboard.png)
*Dashboard displaying four monthly summary cards (Present, Absent, Late, Hours), Today's Action card with check-in status, and Recent Activity list showing attendance history with status badges.*

### Mark Attendance
![Mark Attendance](screenshots/mark-attendance.png)
*Attendance marking interface showing current date, real-time clock display, check-in/check-out buttons, late arrival warning (after 9:00 AM), and leave application form with date and reason fields.*

### Attendance History (Calendar View)
![Attendance History](screenshots/attendance-history.png)
*Interactive calendar view with color-coded dates (Green: Present, Yellow: Late, Red: Absent, Orange: Half Day), month filter dropdown, and date details panel showing check-in/check-out times and status when a date is clicked.*

### Manager Dashboard
![Manager Dashboard](screenshots/manager-dashboard.png)
*Manager overview with four summary cards (Total Employees, Present Today, Absent Today, Late Arrivals), weekly attendance trend bar chart, department-wise attendance progress bars, and list of absent employees for today.*

### All Attendance (Manager View)
![All Attendance](screenshots/all-attendance.png)
*Comprehensive attendance table showing all employee records with filters for employee name, date, and status. Displays employee details, check-in/check-out times, status badges, and total hours worked.*

### Reports Page
![Reports](screenshots/reports.png)
*Report generation interface with date range picker (start date and end date), employee filter dropdown, filtered attendance data table, and Export to CSV button for downloading reports.*

### Profile Page
![Profile](screenshots/profile.png)
*User profile page displaying personal information (name, email, employee ID, department, role, member since) with Edit Profile button. Edit mode includes form fields for updating profile details and optional password change.*



## 📁 Project Structure

```
Employee-Attendance-System/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── attendanceController.js # Employee attendance logic
│   │   ├── managerController.js    # Manager attendance logic
│   │   └── dashboardController.js  # Dashboard statistics
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── Attendance.js           # Attendance schema
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── attendanceRoutes.js     # Attendance endpoints
│   │   ├── managerRoutes.js        # Manager endpoints
│   │   └── dashboardRoutes.js      # Dashboard endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── roleMiddleware.js       # Role-based access control
│   ├── server.js                    # Express server setup
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Environment variables template
│   └── .env                         # Environment variables (create this)
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx         # Left navigation sidebar
│   │   │   ├── TopHeader.jsx       # Top header (if used)
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── MarkAttendance.jsx
│   │   │   ├── AttendanceHistory.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AllAttendance.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   └── Reports.jsx
│   │   ├── store/
│   │   │   ├── store.js           # Redux store configuration
│   │   │   └── authSlice.js       # Auth state management
│   │   ├── api/
│   │   │   └── axios.js           # Axios configuration
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # Entry point
│   ├── package.json
│   └── README.md
│
├── screenshots/                    # Application screenshots
├── README.md                       # This file
└── SETUP.md                        # Additional setup guide
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "employeeId": "EMP001",
  "department": "Engineering",
  "role": "employee"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Employee Attendance Endpoints

#### Check In
```http
POST /attendance/checkin
Authorization: Bearer <token>
```

**Note:** Automatically marks as "late" if check-in is after 9:00 AM

#### Check Out
```http
POST /attendance/checkout
Authorization: Bearer <token>
```

#### Apply Leave
```http
POST /attendance/apply-leave
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "reason": "Sick leave"
}
```

#### Get Attendance History
```http
GET /attendance/my-history
Authorization: Bearer <token>
```

#### Get Monthly Summary
```http
GET /attendance/my-summary?month=2024-01
Authorization: Bearer <token>
```

#### Get Today's Status
```http
GET /attendance/today
Authorization: Bearer <token>
```

### Manager Endpoints

#### Get All Attendance
```http
GET /attendance/all?employee=userId&date=2024-01-15&status=present
Authorization: Bearer <token>
```

#### Get Employee Attendance
```http
GET /attendance/employee/:id
Authorization: Bearer <token>
```

#### Get Team Summary
```http
GET /attendance/summary
Authorization: Bearer <token>
```

#### Export CSV
```http
GET /attendance/export?startDate=2024-01-01&endDate=2024-01-31&employeeId=userId
Authorization: Bearer <token>
```

### Dashboard Endpoints

#### Employee Dashboard
```http
GET /dashboard/employee
Authorization: Bearer <token>
```

#### Manager Dashboard
```http
GET /dashboard/manager
Authorization: Bearer <token>
```

## 🗄 Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  role: String (enum: ['employee', 'manager'], default: 'employee'),
  employeeId: String (required, unique),
  department: String (default: 'General'),
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Model

```javascript
{
  userId: ObjectId (ref: 'User', required),
  date: String (required, format: 'YYYY-MM-DD'),
  checkInTime: String (format: 'HH:mm', optional),
  checkOutTime: String (format: 'HH:mm', optional),
  status: String (enum: ['present', 'absent', 'late', 'half-day']),
  totalHours: Number (default: 0),
  leaveReason: String (optional, for absent status),
  createdAt: Date,
  updatedAt: Date
}
```

## 📖 Usage Guide

### For Employees

1. **Register/Login**
   - Create an account with your employee details
   - Login with email and password

2. **Mark Attendance**
   - Navigate to "Mark Attendance"
   - Click "Check In" (automatically detects if late after 9:00 AM)
   - Click "Check Out" when leaving
   - Or click "Apply Leave" to mark absence with reason

3. **View History**
   - Go to "My History"
   - Switch between Calendar and Table view
   - Filter by month
   - Click dates to see details

4. **Dashboard**
   - View today's status
   - See monthly statistics
   - Check recent activity

### For Managers

1. **Login**
   - Login with manager credentials

2. **View Team Attendance**
   - Go to "All Attendance"
   - Filter by employee, date, or status
   - View detailed records

3. **Calendar View**
   - Navigate to "Calendar"
   - See team attendance at a glance
   - Click dates to view employee details

4. **Generate Reports**
   - Go to "Reports"
   - Select date range
   - Filter by employee (optional)
   - Click "Export to CSV"

5. **Dashboard**
   - View team statistics
   - See department-wise performance
   - Monitor absent employees

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Problem:** Cannot connect to MongoDB

**Solutions:**
- Ensure MongoDB is running: `mongod` or check service status
- Verify `MONGO_URL` in `.env` file
- For MongoDB Atlas, check connection string and network access
- Ensure firewall allows MongoDB connections (port 27017 for local)

### Port Already in Use

**Problem:** Port 5000 or 3000 is already in use

**Solutions:**
- Change `PORT` in backend `.env` file
- Update frontend API baseURL in `frontend/src/api/axios.js`
- Kill process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

### CORS Issues

**Problem:** CORS errors in browser console

**Solutions:**
- Ensure backend is running before frontend
- Check CORS configuration in `backend/server.js`
- Verify API baseURL in frontend matches backend port

### Authentication Issues

**Problem:** Token expired or invalid

**Solutions:**
- Clear browser localStorage
- Login again to get new token
- Check `JWT_SECRET` in backend `.env`
- Verify token is being sent in request headers

### Build Errors

**Problem:** Frontend build fails

**Solutions:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`
- Check Node.js version compatibility

### Module Not Found Errors

**Problem:** Cannot find module errors

**Solutions:**
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (should be v14+)
- Delete `node_modules` and reinstall

## 📝 Notes

- **Late Detection:** Check-ins after 9:00 AM are automatically marked as "late"
- **Time Format:** All times stored in `HH:mm` format (24-hour)
- **Date Format:** All dates stored in `YYYY-MM-DD` format
- **JWT Expiry:** Tokens expire after 7 days
- **Password Security:** Passwords are hashed using bcryptjs
- **Role-Based Access:** Routes are protected based on user role
- **Leave Application:** Employees can apply leave for any date with reason

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ for efficient attendance management

---

**LogMe** - Track Time, Track Success
