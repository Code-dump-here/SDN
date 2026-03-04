const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');


router.get('/', quizController.getAllQuizzes);
router.get('/:quizId', quizController.getQuizById);
router.post('/', quizController.createQuiz);
router.put('/:quizId', quizController.updateQuiz);
router.delete('/:quizId', quizController.deleteQuiz);


router.get('/:quizId/populate', quizController.getQuizWithCapitalKeyword);
router.post('/:quizId/question', quizController.addQuestionToQuiz);
router.post('/:quizId/questions', quizController.addQuestionsToQuiz);

module.exports = router;
