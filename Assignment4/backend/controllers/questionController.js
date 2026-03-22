const Question = require("../models/Question");

exports.getQuestions = async (req, res) => {
  res.json(await Question.find().populate("author", "username"));
};

exports.createQuestion = async (req, res) => {
  try {
    // Set the author to the currently authenticated user
    const questionData = { ...req.body, author: req.user._id };
    res.json(await Question.create(questionData));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteQuestion = async (req, res) => {
  await Question.findByIdAndDelete(req.params.questionId);
  res.json({ message: "Question deleted" });
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId).populate("author", "username");
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json(err);
  }
};
