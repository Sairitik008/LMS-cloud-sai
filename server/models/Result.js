const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mockTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
      required: true,
      index: true,
    },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    timeTaken: { type: Number }, // in seconds
    answers: [
      {
        questionIndex: { type: Number },
        selectedOption: { type: String },
        isCorrect: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

// High-performance compound indexes for student query history and leaderboard aggregation
resultSchema.index({ student: 1, createdAt: -1 });
resultSchema.index({ mockTest: 1, score: -1 });

module.exports = mongoose.model('Result', resultSchema);
