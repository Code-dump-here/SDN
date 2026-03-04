const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');


// API routes for questions
router.get('/api/questions', require('../controllers/questionController').apiGetAllQuestions);
router.get('/api/questions/:id', require('../controllers/questionController').apiGetQuestionById);
router.post('/api/questions', require('../controllers/questionController').apiCreateQuestion);
router.put('/api/questions/:id', require('../controllers/questionController').apiUpdateQuestion);
router.delete('/api/questions/:id', require('../controllers/questionController').apiDeleteQuestion);
// API route for creating a question
router.post('/api/questions', require('../controllers/questionController').apiCreateQuestion);

// List questions
router.get('/', questionController.getAllQuestions);

// New question form
router.get('/new', (req, res) => {
  res.render('questions/new.ejs');
});

// Create question
router.post('/', questionController.createQuestion);

// Edit question form
router.get('/:id/edit', questionController.editQuestionForm);

// Update question
router.put('/:id', questionController.updateQuestion);

// Delete question
router.delete('/:id', questionController.deleteQuestion);

// Question details
router.get('/:id', questionController.getQuestionById);

module.exports = router;
