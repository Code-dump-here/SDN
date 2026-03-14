const express = require("express");
const router = express.Router();
const controller = require("../controllers/quizController");
const { verifyUser, verifyAdmin } = require("../authenticate");

// Anyone can GET
router.get("/quizzes", controller.getQuizzes);
router.get("/quizzes/:quizId", controller.getQuizById);
router.get("/quizzes/:quizId/populate", controller.getCapitalQuestions);

// Only Admin can POST, PUT, DELETE
router.post("/quizzes", verifyUser, verifyAdmin, controller.createQuiz);
router.put("/quizzes/:quizId", verifyUser, verifyAdmin, controller.updateQuiz);
router.delete("/quizzes/:id", verifyUser, verifyAdmin, controller.deleteQuiz);

// Nested quiz-question routes - Admin only
router.post("/quizzes/:quizId/question", verifyUser, verifyAdmin, controller.addQuestionToQuiz);
router.post("/quizzes/:quizId/questions", verifyUser, verifyAdmin, controller.addManyQuestionsToQuiz);

module.exports = router;
