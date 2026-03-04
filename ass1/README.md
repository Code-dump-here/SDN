# Simple Quiz API

A RESTful API for managing quizzes and questions using Node.js, Express, and MongoDB.

## Project Structure

```
ass1/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   ├── Quiz.js              # Quiz mongoose model
│   └── Question.js          # Question mongoose model
├── controllers/
│   ├── quizController.js    # Quiz business logic
│   └── questionController.js # Question business logic
├── routes/
│   ├── quizRoutes.js        # Quiz route definitions
│   └── questionRoutes.js    # Question route definitions
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── server.js                 # Main application entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your local machine

3. Update `.env` file if needed (default: mongodb://localhost:27017/SimpleQuiz)

4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:3000

## API Endpoints

### Quiz Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quizzes` | Get all quizzes with populated questions |
| GET | `/quizzes/:quizId` | Get single quiz by ID |
| POST | `/quizzes` | Create new quiz |
| PUT | `/quizzes/:quizId` | Update quiz |
| DELETE | `/quizzes/:quizId` | Delete quiz |
| GET | `/quizzes/:quizId/populate` | Get quiz with questions matching "capital" keyword |
| POST | `/quizzes/:quizId/question` | Add single question to quiz |
| POST | `/quizzes/:quizId/questions` | Add multiple questions to quiz |

### Question Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/questions` | Get all questions |
| GET | `/questions/:questionId` | Get single question by ID |
| POST | `/questions` | Create new question |
| PUT | `/questions/:questionId` | Update question |
| DELETE | `/questions/:questionId` | Delete question |

## Request Examples

### Create a Quiz
```json
POST /quizzes
{
  "title": "Geography Quiz",
  "description": "Test your geography knowledge"
}
```

### Create a Question
```json
POST /questions
{
  "text": "What is the capital of France?",
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "keywords": ["capital", "france", "geography"],
  "correctAnswerIndex": 1
}
```

### Add Single Question to Quiz
```json
POST /quizzes/:quizId/question
{
  "text": "What is the capital of Italy?",
  "options": ["Rome", "Milan", "Venice", "Florence"],
  "keywords": ["capital", "italy"],
  "correctAnswerIndex": 0
}
```

### Add Multiple Questions to Quiz
```json
POST /quizzes/:quizId/questions
{
  "questions": [
    {
      "text": "What is the capital of Spain?",
      "options": ["Barcelona", "Madrid", "Seville", "Valencia"],
      "keywords": ["capital", "spain"],
      "correctAnswerIndex": 1
    },
    {
      "text": "What is the capital of Germany?",
      "options": ["Munich", "Hamburg", "Berlin", "Frankfurt"],
      "keywords": ["capital", "germany"],
      "correctAnswerIndex": 2
    }
  ]
}
```

## Data Models

### Quiz Schema
- `title` (String, required): Quiz title
- `description` (String, required): Quiz description
- `questions` (Array of ObjectIds): References to Question documents

### Question Schema
- `text` (String, required): Question text
- `options` (Array of Strings, required): Answer options (minimum 2)
- `keywords` (Array of Strings): Keywords for categorization
- `correctAnswerIndex` (Number, required): Index of correct answer in options array

## Features

✅ MVC Architecture Pattern
✅ Express Router for modular routing
✅ Mongoose ODM for MongoDB
✅ Full CRUD operations for Quizzes and Questions
✅ Mongoose populate for relational data
✅ Keyword-based question filtering
✅ Input validation
✅ Error handling
✅ RESTful API design

## Notes

- The database name is `SimpleQuiz` as required
- All GET `/quizzes` requests automatically populate questions using Mongoose populate
- The `/quizzes/:quizId/populate` endpoint filters questions with the "capital" keyword
- Questions can be created independently or added directly to a quiz
