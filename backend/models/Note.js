const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Bug', 'Task', 'Otomasyon', 'Genel']
  },
  codeSnippet: {
    type: String,
    default: ''
  },
  taskLink: {
    type: String,
    default: ''
  },
  environment: {
    browser: { type: String, default: '' },
    os: { type: String, default: '' },
    device: { type: String, default: '' }
  },
  screenshot: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);