// API: Get all quizzes
exports.apiGetAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API: Get quiz by ID
exports.apiGetQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API: Create quiz
exports.apiCreateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// API: Update quiz
exports.apiUpdateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// API: Delete quiz (and its questions)
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
// Add a question to a quiz
exports.addQuestionToQuiz = async (req, res) => {
  try {
    console.log('Received question body (quiz):', req.body);
    // Create the question
    const question = await Question.create(req.body);
    // Add question to quiz
    await Quiz.findByIdAndUpdate(
      req.params.id,
      { $push: { questions: question._id } }
    );
    res.redirect(`/quizzes/${req.params.id}`);
  } catch (error) {
    res.status(400).send('Error adding question: ' + error.message);
  }
};
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    res.render('quizzes/list.ejs', { quizzes });
  } catch (error) {
    res.status(500).send('Error fetching quizzes: ' + error.message);
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).send('Quiz not found');
    res.render('quizzes/detail.ejs', { quiz, questions: quiz.questions });
  } catch (error) {
    res.status(500).send('Error fetching quiz: ' + error.message);
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.redirect('/quizzes');
  } catch (error) {
    res.status(400).send('Error creating quiz: ' + error.message);
  }
};

exports.editQuizForm = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).send('Quiz not found');
    res.render('quizzes/edit.ejs', { quiz });
  } catch (error) {
    res.status(500).send('Error loading quiz: ' + error.message);
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/quizzes');
  } catch (error) {
    res.status(400).send('Error updating quiz: ' + error.message);
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    // Find the quiz to get its questions
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    // Delete all questions associated with this quiz
    await Question.deleteMany({ _id: { $in: quiz.questions } });
    // Delete the quiz itself
    await Quiz.findByIdAndDelete(req.params.id);
    res.redirect('/quizzes');
  } catch (error) {
    res.status(500).send('Error deleting quiz: ' + error.message);
  }
};
