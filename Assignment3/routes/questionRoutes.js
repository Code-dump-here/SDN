const express = require("express");
const router = express.Router();
const controller = require("../controllers/questionController");
const { verifyUser, verifyAuthor } = require("../authenticate");

// Anyone can GET
router.get("/questions", controller.getQuestions);
router.get("/questions/:questionId", controller.getQuestionById);

// Only a verified user (author) can create a question
router.post("/questions", verifyUser, controller.createQuestion);

// Only the author of the question can update or delete it
router.put("/questions/:questionId", verifyUser, verifyAuthor, controller.updateQuestion);
router.delete("/questions/:questionId", verifyUser, verifyAuthor, controller.deleteQuestion);

module.exports = router;
