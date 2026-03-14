const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');

exports.apiGetAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.apiGetQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.apiCreateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.apiUpdateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.apiDeleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });
    await Question.deleteMany({ _id: { $in: quiz.questions } });
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addQuestionToQuiz = async (req, res) => {
  try {
    let options = req.body.options;
    let keywords = req.body.keywords;
    if (!Array.isArray(options)) options = [options].filter(Boolean);
    if (!Array.isArray(keywords)) keywords = [keywords].filter(Boolean);
    options = options.filter(v => v && v.trim() !== '');
    keywords = keywords.filter(v => v && v.trim() !== '');
    const correctAnswerIndex = parseInt(req.body.correctAnswerIndex);
    const author = req.user ? req.user._id : null;
    const question = await Question.create({ text: req.body.text, options, keywords, correctAnswerIndex, author });
    await Quiz.findByIdAndUpdate(req.params.id, { $push: { questions: question._id } });
    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.apiGetAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
