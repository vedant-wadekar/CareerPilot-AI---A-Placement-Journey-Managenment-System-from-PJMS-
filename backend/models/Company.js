const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  package: { type: Number, required: true }, // in LPA
  location: { type: String, required: true },
  eligibilityCgpa: { type: Number, required: true, default: 0 },
  skillsRequired: { type: [String], default: [] },
  driveDate: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
