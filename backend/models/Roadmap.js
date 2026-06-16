const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  }
});

const PhaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String },
  topics: [TopicSchema]
});

const RoadmapSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true // A student has one active personalized roadmap
  },
  interests: [{ type: String }],
  skills: [{ type: String }],
  phases: [PhaseSchema],
  recommendedProjects: [
    {
      title: { type: String },
      description: { type: String }
    }
  ],
  recommendedCertifications: [
    {
      title: { type: String },
      provider: { type: String }
    }
  ],
  placementPrep: {
    aptitude: [{ type: String }],
    technical: [{ type: String }],
    interview: [{ type: String }]
  },
  overallProgress: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Pre-save hook to calculate progress
RoadmapSchema.pre('save', function (next) {
  let totalTopics = 0;
  let completedTopics = 0;

  this.phases.forEach(phase => {
    phase.topics.forEach(topic => {
      totalTopics++;
      if (topic.status === 'Completed') {
        completedTopics++;
      } else if (topic.status === 'In Progress') {
        completedTopics += 0.5; // Partial credit for in-progress
      }
    });
  });

  if (totalTopics > 0) {
    this.overallProgress = Math.round((completedTopics / totalTopics) * 100);
  } else {
    this.overallProgress = 0;
  }

  next();
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
