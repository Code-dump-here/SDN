const User = require('../models/User');
const Question = require('../models/Question');

// Middleware to verify if user is admin
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  } else {
    const err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
};

// Middleware to verify if user is the author of the question
exports.verifyAuthor = async (req, res, next) => {
  try {
    const questionId = req.params.id || req.body.questionId;
    const question = await Question.findById(questionId);
    if (!question) {
      const err = new Error('Question not found');
      err.status = 404;
      return next(err);
    }
    if (question.author.toString() === req.user._id.toString()) {
      return next();
    } else {
      const err = new Error('You are not the author of this question');
      err.status = 403;
      return next(err);
    }
  } catch (error) {
    return next(error);
  }
};
