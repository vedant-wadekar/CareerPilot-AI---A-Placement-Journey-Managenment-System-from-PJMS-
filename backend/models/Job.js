const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String, required: true }, // descriptive eligibility text, e.g. "CGPA > 8.0, CSE/IT only"
  deadline: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
