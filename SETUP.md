# Setup Instructions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend directory:
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/attendance-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start MongoDB (if running locally):
```bash
# On Windows (if MongoDB is installed as a service, it should start automatically)
# On Mac/Linux:
mongod
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## First Time Setup

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Register a new account:
   - For testing, you can create both an employee and a manager account
   - Use role "manager" for manager account
   - Use role "employee" for employee account
4. Login with your credentials

## Testing the System

### As Employee:
1. Login with employee account
2. Go to "Mark Attendance" and check in
3. View your dashboard to see statistics
4. Check out later in the day
5. View your attendance history

### As Manager:
1. Login with manager account
2. View dashboard with team statistics
3. View all employees' attendance
4. Use calendar view to see team attendance
5. Export reports to CSV

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check your MONGO_URL in `.env` file
- For MongoDB Atlas, use the connection string provided

### Port Already in Use
- Change PORT in backend `.env` file
- Update frontend API baseURL in `frontend/src/api/axios.js`

### CORS Issues
- Backend CORS is already configured
- Make sure backend is running before starting frontend

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Make sure token is being sent in requests

