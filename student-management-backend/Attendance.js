const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  date: { type: Date, required: true },
  present: { type: Boolean, default: true }
});
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
