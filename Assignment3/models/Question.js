const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  options: [String],
  keywords: [String],
  correctAnswerIndex: Number
});

module.exports = mongoose.model("Question", questionSchema);
