require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const Student = require('./Student');
const Attendance = require('./Attendance');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
const users = [];
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
app.get('/', (req, res) => {
  res.send('Backend is running!');
});
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ error: 'Missing username, password or role' });
  if (users.find((u) => u.username === username)) return res.status(400).json({ error: 'User exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, password: passwordHash, role });
  res.json({ message: 'User registered' });
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, username, role: user.role });
});
app.post('/students', authMiddleware, roleMiddleware(['admin', 'teacher']), async (req, res) => {
  try {
    const { name, rollNo, email, phone, batch, present, photoFilename } = req.body;
    const student = new Student({
      name,
      rollNo,
      email,
      phone,
      batch,
      present: present !== undefined ? present : true,
      photoFilename,
    });
    await student.save();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Student Portal',
      text: `Hello ${name},\n\nYou have been added to ${batch}.\n\nRegards,\nStudent Management Team`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error('Email error:', error);
      else console.log('Email sent:', info.response);
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get('/students', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch('/students/:id', authMiddleware, roleMiddleware(['admin', 'teacher']), upload.single('photo'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = { ...req.body };
    if (req.file) {
      const existingStudent = await Student.findById(studentId);
      if (!existingStudent) return res.status(404).json({ error: 'Student not found' });
      if (existingStudent.photoFilename) {
        const oldPhotoPath = path.join(__dirname, 'uploads', existingStudent.photoFilename);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      updateData.photoFilename = req.file.filename;
    }
    const updatedStudent = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
    if (updatedStudent && typeof updateData.present !== 'undefined' && updateData.present === false) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: updatedStudent.email,
        subject: 'Attendance Notification',
        text: `Hi ${updatedStudent.name},\n\nYou are marked absent for today.\n\nRegards,\nStudent Management Team`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error('Email error:', error);
        else console.log('Absent email sent:', info.response);
      });
    }
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(400).json({ error: error.message });
  }
});
app.delete('/students/:id', authMiddleware, roleMiddleware(['admin', 'teacher']), async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByIdAndDelete(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (student.photoFilename) {
      const photoPath = path.join(__dirname, 'uploads', student.photoFilename);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post('/students/:id/photo', authMiddleware, roleMiddleware(['admin', 'teacher']), upload.single('photo'), async (req, res) => {
  const studentId = req.params.id;
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (student.photoFilename) {
      const oldPhotoPath = path.join(__dirname, 'uploads', student.photoFilename);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    student.photoFilename = req.file.filename;
    await student.save();

    res.json({ file: req.file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/upload-photo-temp', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No photo' });
  res.json({ filename: req.file.filename });
});
app.post('/attendance', authMiddleware, roleMiddleware(['admin', 'teacher']), async (req, res) => {
  try {
    const { studentId, date, present } = req.body;
    const ymd = (new Date(date)).toISOString().slice(0, 10);
    let record = await Attendance.findOne({ studentId, date: ymd });
    if (record) {
      record.present = present;
      await record.save();
    } else {
      // Create new
      record = new Attendance({ studentId, date: ymd, present });
      await record.save();
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get('/attendance/:studentId', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.find({ studentId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/attendance/all/:date', authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;
    const records = await Attendance.find({ date });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/attendance/batch/:batch/:date', authMiddleware, async (req, res) => {
  try {
    const { batch, date } = req.params;
    const students = await Student.find({ batch });
    const records = await Attendance.find({
      studentId: { $in: students.map((s) => s._id) },
      date: new Date(date),
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));