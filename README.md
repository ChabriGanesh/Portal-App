# 🎓 **Student Portal MERN App**

A complete MERN (MongoDB, Express, React, Node.js) full-stack application for secure student management, attendance tracking, and analytics.

---

## 📚 **Table of Contents**

- 🚀 **Project Overview**  
- ✨ **Features**  
- 🗂️ **Project Folder Structure**  
- 🔧 **Backend Code Files Explained**  
- 💻 **Frontend Code Files Explained**  
- 🛠️ **Environment Variables**  
- ⚙️ **Setup Instructions**  
- ☁️ **Deployment Guide**  
- 🛠️ **Troubleshooting**  
- 👤 **Author & Credits**

---

## 🚀 **Project Overview**

This app streamlines student data management with role-based authentication, attendance analytics, and CSV reporting. Built using React and Node.js, secured with JWT and Google ReCAPTCHA, and hosted via Vercel (frontend) and Render (backend).

---

## ✨ **Features**

- 🔐 Role-based JWT authentication  
- 🎯 Secure login with Google reCAPTCHA  
- 👩‍🎓 CRUD operations for students  
- 📅 Attendance tracking per batch and date  
- 📊 Analytics dashboard with charts  
- 📸 Photo upload for student profiles  
- 📁 Export attendance & student data as CSV  
- 📱 Responsive, user-friendly UI

---

## 🗂️ **Project Folder Structure**

student-portal-app/
├── student-management-backend/
│ ├── index.js // Backend server entry point
│ ├── models/ // MongoDB data schemas (User, Student, Attendance)
│ ├── routes/ // Express API routes (auth, student, attendance)
│ ├── middleware/ // JWT validation, CORS
│ └── .env // Backend config vars
├── student-frontend/
│ ├── src/
│ │ ├── App.js // React app entry & router
│ │ ├── LoginPage.js // Login form + captcha
│ │ ├── DashboardPage.js // Attendance analytics chart
│ │ ├── StudentsPage.js // Student list & attendance marks
│ │ └── components/ // Reusable UI components
│ └── .env // Frontend config vars
└── README.md


---

## 🔧 **Backend Code Files Explained**

### `index.js`

- Entry point: sets up Express server, MongoDB connection, middleware, routes.  
- Key imports: `dotenv`, `express`, `mongoose`, `cors`, routes.  
- Listens on configured port.

### `models/User.js`

- User schema: `username`, `password` (hashed), `role`.  
- Used for admin and teacher authentication.  
- Password hashing with bcrypt.

### `models/Student.js`

- Student schema: `name`, `rollNo`, `email`, `batch`, `phone`, `photoFilename`.  
- Core for student information storage.

### `models/Attendance.js`

- Attendance schema: `studentId`, `batch`, `date`, and `present` (Boolean).  
- Tracks daily attendance per student.

### `routes/auth.js`

- Login API: verifies users, generates JWT tokens.  
- Optional user registration.

### `routes/student.js`

- CRUD APIs on `/students`: create, read (list), update, delete students.  
- Protects endpoints with JWT middleware.

### `routes/attendance.js`

- APIs to mark attendance and fetch attendance data.  
- Batch- and date-specific queries supported.

### `middleware/verifyJWT.js`

- Checks JWT token in request header.  
- Protects routes from unauthorized access.

### `middleware/cors.js`

- Allows cross-origin requests from your frontend domains only.

### `.env` (Backend)

MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=10000


---

## 💻 **Frontend Code Files Explained**

### `src/App.js`

- Main app component that sets up routing and user auth flow.

### `src/LoginPage.js`

- Login form with username, password, and Google reCAPTCHA.  
- On submit: sends credentials to backend, stores JWT on success.

### `src/DashboardPage.js`

- Fetches and displays attendance statistics on charts.

### `src/StudentsPage.js`

- View, add, edit, delete students.  
- Batch/date filters.  
- Attendance mark buttons.  
- Photo upload for student images.  
- Exports CSV reports.

### `src/components/`

- Misc reusable components like tables, buttons, modals.

### `.env` (Frontend)

REACT_APP_API_BASE_URL=https://portal-app-2.onrender.com/
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_key


---

## ⚙️ **Setup Instructions**

### Clone Repo & Install Dependencies

git clone https://github.com/ChabriGanesh/student-portal-app.git
cd student-management-backend
npm install
cd ../student-frontend
npm install


### Configure Environment Variables

- Backend `.env`  
- Frontend `.env`

### Start Local Servers

Backend
cd student-management-backend
npm start

Frontend (new terminal tab)
cd ../student-frontend
npm start


---

## ☁️ **Deployment Guide**

### Backend (Render.com)

- Connect repo.  
- Add Mongo URI, JWT secret, port env vars.  
- Deploy and verify.

### Frontend (Vercel)

- Connect repo.  
- Add backend URL and Recaptcha keys in env.  
- Deploy and test.

---

## 🛠️ **Troubleshooting**

- Login fails? Check user exists on MongoDB Atlas.  
- Network errors? API URL misconfigured or CORS issue.  
- 502 Bad Gateway? Backend can’t connect MongoDB Atlas.  
- Assets missing? Check build and backend serving file config.

---

## 👤 **Author & Credits**

Student Portal App by **Your Name**. Contributions welcome!

---

You can copy-paste this whole README.md content into your GitHub repo directly.  
If you want detailed explanations of specific files or code snippets, just ask!
