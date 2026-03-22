const express = require("express");
const router = express.Router();
const controller = require("../controllers/questionController");
const { verifyUser, verifyAdmin, verifyAuthor } = require("../authenticate");


router.get("/questions", controller.getQuestions);
router.get("/questions/:questionId", controller.getQuestionById);

router.post("/questions", verifyUser, controller.createQuestion);

// Admin can edit/delete any question; non-admin must be the author
router.put("/questions/:questionId", verifyUser, (req, res, next) => {
  if (req.user.admin) return next();
  verifyAuthor(req, res, next);
}, controller.updateQuestion);
router.delete("/questions/:questionId", verifyUser, (req, res, next) => {
  if (req.user.admin) return next();
  verifyAuthor(req, res, next);
}, controller.deleteQuestion);

// Author-only for everyone:
// router.put("/questions/:questionId", verifyUser, verifyAuthor, controller.updateQuestion);
// router.delete("/questions/:questionId", verifyUser, verifyAuthor, controller.deleteQuestion);

module.exports = router;
