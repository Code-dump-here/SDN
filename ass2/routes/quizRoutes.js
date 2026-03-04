const express = require('express');
const router = express.Router();
const https = require('https');
const axios = require('axios');

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

const apiUrl = process.env.API_URL || 'https://localhost:3443';

// GET /quizzes
router.get('/', async (req, res) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/api/quizzes`);
    res.render('quizzes/list.ejs', { quizzes: response.data.quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// GET /quizzes/new
router.get('/new', (req, res) => {
  res.render('quizzes/new.ejs');
});

// POST /quizzes
router.post('/', async (req, res) => {
  try {
    await axiosInstance.post(`${apiUrl}/api/quizzes`, {
      title: req.body.title,
      description: req.body.description
    });
    res.redirect('/quizzes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating quiz: ' + (err.response?.data?.error || err.message));
  }
});

// GET /quizzes/:id/edit
router.get('/:id/edit', async (req, res) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/api/quizzes/${req.params.id}`);
    res.render('quizzes/edit.ejs', { quiz: response.data.quiz });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// GET /quizzes/:id/question
router.get('/:id/question', (req, res) => {
  res.render('questions/new.ejs', { quizId: req.params.id });
});

// POST /quizzes/:id/question
router.post('/:id/question', async (req, res) => {
  try {
    const options = req.body.options
      ? req.body.options.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const correctAnswerIndex = parseInt(req.body.correctAnswerIndex);
    await axiosInstance.post(`${apiUrl}/api/quizzes/${req.params.id}/question`, {
      text: req.body.text,
      options,
      correctAnswerIndex
    });
    res.redirect(`/quizzes/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding question: ' + (err.response?.data?.error || err.message));
  }
});

// PUT /quizzes/:id
router.put('/:id', async (req, res) => {
  try {
    await axiosInstance.put(`${apiUrl}/api/quizzes/${req.params.id}`, {
      title: req.body.title,
      description: req.body.description
    });
    res.redirect('/quizzes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating quiz: ' + (err.response?.data?.error || err.message));
  }
});

// DELETE /quizzes/:id
router.delete('/:id', async (req, res) => {
  try {
    await axiosInstance.delete(`${apiUrl}/api/quizzes/${req.params.id}`);
    res.redirect('/quizzes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting quiz');
  }
});

// GET /quizzes/:id
router.get('/:id', async (req, res) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/api/quizzes/${req.params.id}`);
    const quiz = response.data.quiz;
    res.render('quizzes/detail.ejs', { quiz, questions: quiz.questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
