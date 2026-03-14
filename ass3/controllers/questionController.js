const Question = require('../models/Question');

exports.apiGetAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.apiGetQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.apiCreateQuestion = async (req, res) => {
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
    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.apiUpdateQuestion = async (req, res) => {
  try {
    let options = req.body.options;
    let keywords = req.body.keywords;
    if (!Array.isArray(options)) options = [options].filter(Boolean);
    if (!Array.isArray(keywords)) keywords = [keywords].filter(Boolean);
    options = options.filter(v => v && v.trim() !== '');
    keywords = keywords.filter(v => v && v.trim() !== '');
    const correctAnswerIndex = parseInt(req.body.correctAnswerIndex);
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text, options, keywords, correctAnswerIndex },
      { new: true, runValidators: true }
    );
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true, question });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.apiDeleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
