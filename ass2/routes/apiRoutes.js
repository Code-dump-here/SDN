const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');

// Quiz API
router.get('/quizzes', quizController.apiGetAllQuizzes);
router.get('/quizzes/:id', quizController.apiGetQuizById);
router.post('/quizzes', quizController.apiCreateQuiz);
router.put('/quizzes/:id', quizController.apiUpdateQuiz);
router.delete('/quizzes/:id', quizController.apiDeleteQuiz);
router.post('/quizzes/:id/question', quizController.addQuestionToQuiz);

// Question API
router.get('/questions', questionController.apiGetAllQuestions);
router.get('/questions/:id', questionController.apiGetQuestionById);
router.post('/questions', questionController.apiCreateQuestion);
router.put('/questions/:id', questionController.apiUpdateQuestion);
router.delete('/questions/:id', questionController.apiDeleteQuestion);

module.exports = router;
