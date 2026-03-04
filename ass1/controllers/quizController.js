const Quiz = require('../models/Quiz');
const Question = require('../models/Question');


exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quizzes',
      error: error.message
    });
  }
};


exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error.message
    });
  }
};


exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
};


exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('questions');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating quiz',
      error: error.message
    });
  }
};


exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting quiz',
      error: error.message
    });
  }
};


exports.getQuizWithCapitalKeyword = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: 'questions',
      match: { keywords: 'capital' }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz with capital keyword',
      error: error.message
    });
  }
};


exports.addQuestionToQuiz = async (req, res) => {
  try {

    const question = await Question.create(req.body);
    

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,  
      { $push: { questions: question._id } },
      { new: true }
    ).populate('questions');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Question added to quiz successfully',
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding question to quiz',
      error: error.message
    });
  }
};


exports.addQuestionsToQuiz = async (req, res) => {
  try {

    if (!req.body.questions || !Array.isArray(req.body.questions)) {
      return res.status(400).json({
        success: false,
        message: 'Questions array is required'
      });
    }


    const questions = await Question.insertMany(req.body.questions);
    

    const questionIds = questions.map(q => q._id);
    

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $push: { questions: { $each: questionIds } } },
      { new: true }
    ).populate('questions');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(201).json({
      success: true,
      message: `${questions.length} questions added to quiz successfully`,
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding questions to quiz',
      error: error.message
    });
  }
};
