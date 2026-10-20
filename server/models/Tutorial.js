const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    thumbnail: { type: String },
    videoUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

tutorialSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Tutorial', tutorialSchema);
