const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

exports.getQuizzes = async (req, res) => {
  res.json(await Quiz.find().populate("questions"));
};

exports.createQuiz = async (req, res) => {
  res.json(await Quiz.create(req.body));
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await Question.deleteMany({
      _id: { $in: quiz.questions }
    });
    
    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: "Quiz and its questions deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getCapitalQuestions = async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId).populate({
    path: "questions",
    match: { keywords: "capital" }
  });
  res.json(quiz);
};

exports.addQuestionToQuiz = async (req, res) => {
  const question = await Question.create(req.body);
  const quiz = await Quiz.findById(req.params.quizId);
  quiz.questions.push(question._id);
  await quiz.save();
  res.json(question);
};

exports.addManyQuestionsToQuiz = async (req, res) => {
  const questions = await Question.insertMany(req.body);
  const quiz = await Quiz.findById(req.params.quizId);
  questions.forEach(q => quiz.questions.push(q._id));
  await quiz.save();
  res.json(questions);
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true }
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json(err);
  }
};


