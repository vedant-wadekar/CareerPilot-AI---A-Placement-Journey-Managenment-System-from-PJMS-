const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String, default: '' },
  cgpa: { type: Number, default: 0 },
  graduationYear: { type: Number, default: new Date().getFullYear() },
  skills: { type: [String], default: [] },
  certifications: { type: [certificationSchema], default: [] },
  resumeUrl: { type: String, default: '' },
  role: { type: String, default: 'student' }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
