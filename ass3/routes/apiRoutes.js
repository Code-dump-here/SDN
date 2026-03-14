const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');
const authenticate = require('../config/authenticate');

// Quiz API
router.get('/quizzes', quizController.apiGetAllQuizzes);
router.get('/quizzes/:id', quizController.apiGetQuizById);
router.post('/quizzes', authenticate.verifyAdmin, quizController.apiCreateQuiz);
router.put('/quizzes/:id', authenticate.verifyAdmin, quizController.apiUpdateQuiz);
router.delete('/quizzes/:id', authenticate.verifyAdmin, quizController.apiDeleteQuiz);
router.post('/quizzes/:id/question', authenticate.verifyAdmin, quizController.addQuestionToQuiz);

// Question API
router.get('/questions', questionController.apiGetAllQuestions);
router.get('/questions/:id', questionController.apiGetQuestionById);
router.post('/questions', authenticate.verifyAuthor, questionController.apiCreateQuestion);
router.put('/questions/:id', authenticate.verifyAuthor, questionController.apiUpdateQuestion);
router.delete('/questions/:id', authenticate.verifyAuthor, questionController.apiDeleteQuestion);

// Admin-only: get all users
router.get('/users', authenticate.verifyAdmin, quizController.apiGetAllUsers);

module.exports = router;
