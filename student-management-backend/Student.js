const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  batch: { type: String, required: true },    
  present: { type: Boolean, default: true },
  photoFilename: String    
});
module.exports = mongoose.model('Student', studentSchema);
