// API: Get all questions
exports.apiGetAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API: Get question by ID
exports.apiGetQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API: Update question
exports.apiUpdateQuestion = async (req, res) => {
  try {
    let options = req.body.options;
    let keywords = req.body.keywords;
    if (!Array.isArray(options)) options = [options].filter(Boolean);
    if (!Array.isArray(keywords)) keywords = [keywords].filter(Boolean);
    options = options.filter(v => v && v.trim() !== '');
    keywords = keywords.filter(v => v && v.trim() !== '');
    const correctAnswerIndex = parseInt(req.body.correctAnswerIndex);
    const updateData = {
      text: req.body.text,
      options,
      keywords,
      correctAnswerIndex
    };
    const question = await Question.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true, question });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// API: Delete question
exports.apiDeleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// API endpoint for creating a question (returns JSON)
exports.apiCreateQuestion = async (req, res) => {
  try {
    // Clean up options and keywords
    let options = req.body.options;
    let keywords = req.body.keywords;
    if (!Array.isArray(options)) options = [options].filter(Boolean);
    if (!Array.isArray(keywords)) keywords = [keywords].filter(Boolean);
    options = options.filter(v => v && v.trim() !== '');
    keywords = keywords.filter(v => v && v.trim() !== '');
    const correctAnswerIndex = parseInt(req.body.correctAnswerIndex);
    const questionData = {
      text: req.body.text,
      options,
      keywords,
      correctAnswerIndex
    };
    const question = await Question.create(questionData);
    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
const Question = require('../models/Question');

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.render('questions/list.ejs', { questions });
  } catch (error) {
    res.status(500).send('Error fetching questions: ' + error.message);
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send('Question not found');
    res.render('questions/detail.ejs', { question });
  } catch (error) {
    res.status(500).send('Error fetching question: ' + error.message);
  }
};

exports.createQuestion = async (req, res) => {
  try {
    console.log('Received question body:', req.body);
    const question = await Question.create(req.body);
    res.redirect('/questions');
  } catch (error) {
    console.error('Question creation error:', error);
    res.status(400).send('Error creating question: ' + error.message + '\n' + error.stack);
  }
};

exports.editQuestionForm = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send('Question not found');
    res.render('questions/edit.ejs', { question });
  } catch (error) {
    res.status(500).send('Error loading question: ' + error.message);
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/questions');
  } catch (error) {
    res.status(400).send('Error updating question: ' + error.message);
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect('/questions');
  } catch (error) {
    res.status(500).send('Error deleting question: ' + error.message);
  }
};
