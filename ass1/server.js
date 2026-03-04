require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/quizzes', quizRoutes);
app.use('/questions', questionRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Simple Quiz API',
    endpoints: {
      quizzes: {
        'GET /quizzes': 'Get all quizzes with populated questions',
        'GET /quizzes/:quizId': 'Get single quiz by ID',
        'POST /quizzes': 'Create new quiz',
        'PUT /quizzes/:quizId': 'Update quiz',
        'DELETE /quizzes/:quizId': 'Delete quiz',
        'GET /quizzes/:quizId/populate': 'Get quiz with questions matching "capital" keyword',
        'POST /quizzes/:quizId/question': 'Add single question to quiz',
        'POST /quizzes/:quizId/questions': 'Add multiple questions to quiz'
      },
      questions: {
        'GET /questions': 'Get all questions',
        'GET /questions/:questionId': 'Get single question by ID',
        'POST /questions': 'Create new question',
        'PUT /questions/:questionId': 'Update question',
        'DELETE /questions/:questionId': 'Delete question'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see available endpoints`);
});
