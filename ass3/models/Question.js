const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v && v.length >= 2;
      },
      message: 'At least 2 options are required'
    }
  },
  keywords: {
    type: [String],
    default: []
  },
  correctAnswerIndex: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    validate: {
      validator: function(v) {
        return v >= 0 && v < this.options.length;
      },
      message: 'Correct answer index must be valid'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
