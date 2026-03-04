const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// API routes for quizzes
router.get('/api/quizzes', require('../controllers/quizController').apiGetAllQuizzes);
router.get('/api/quizzes/:id', require('../controllers/quizController').apiGetQuizById);
router.post('/api/quizzes', require('../controllers/quizController').apiCreateQuiz);
router.put('/api/quizzes/:id', require('../controllers/quizController').apiUpdateQuiz);
router.delete('/api/quizzes/:id', require('../controllers/quizController').apiDeleteQuiz);
// Show form to add a single question to quiz
router.get('/:id/question', (req, res) => {
  res.render('questions/new.ejs', { quizId: req.params.id });
});
// Add a single question to quiz (form)
router.get('/:id/question', (req, res) => {
  res.render('questions/new.ejs', { quizId: req.params.id });
});

// Add a single question to quiz (submit)
router.post('/:id/question', require('../controllers/quizController').addQuestionToQuiz);

// List quizzes
router.get('/', quizController.getAllQuizzes);

// New quiz form
router.get('/new', (req, res) => {
  res.render('quizzes/new.ejs');
});

// Create quiz
router.post('/', quizController.createQuiz);

// Edit quiz form
router.get('/:id/edit', quizController.editQuizForm);

// Update quiz
router.put('/:id', quizController.updateQuiz);

// Delete quiz
router.delete('/:id', quizController.deleteQuiz);

// Quiz details
router.get('/:id', quizController.getQuizById);


module.exports = router;
