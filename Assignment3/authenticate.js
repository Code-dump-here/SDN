const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Question = require("./models/Question");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Verifies that the request carries a valid JWT token and loads req.user
exports.verifyUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const err = new Error("No token provided");
    err.status = 401;
    return next(err);
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error("User not found");
      err.status = 401;
      return next(err);
    }
    req.user = user;
    next();
  } catch (error) {
    const err = new Error("Invalid token");
    err.status = 401;
    return next(err);
  }
};

// Verifies that the authenticated user has admin privileges
// Must be used AFTER verifyUser in the middleware chain
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  const err = new Error("You are not authorized to perform this operation!");
  err.status = 403;
  return next(err);
};

// Verifies that the authenticated user is the author of the question
// Must be used AFTER verifyUser in the middleware chain
exports.verifyAuthor = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }

    if (question.author && question.author.equals(req.user._id)) {
      return next();
    }

    const err = new Error("You are not the author of this question");
    err.status = 403;
    return next(err);
  } catch (error) {
    return next(error);
  }
};
