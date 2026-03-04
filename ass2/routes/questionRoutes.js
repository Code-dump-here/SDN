const express = require('express');
const router = express.Router();
const https = require('https');
const axios = require('axios');

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

const apiUrl = process.env.API_URL || 'https://localhost:3443';

// GET /questions
router.get('/', async (req, res) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/api/questions`);
    res.render('questions/list.ejs', { questions: response.data.questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// GET /questions/new
router.get('/new', (req, res) => {
  res.render('questions/new.ejs');
});

// POST /questions
router.post('/', async (req, res) => {
  try {
    const options = req.body.options
      ? req.body.options.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const correctAnswerIndex = parseInt(req.body.correctAnswerIndex);
    await axiosInstance.post(`${apiUrl}/api/questions`, {
      text: req.body.text,
      options,
      correctAnswerIndex
    });
    res.redirect('/questions');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating question: ' + (err.response?.data?.error || err.message));
  }
});

// GET /questions/:id/edit
router.get('/:id/edit', async (req, res) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/api/questions/${req.params.id}`);
    res.render('questions/edit.ejs', { question: response.data.question });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// PUT /questions/:id
router.put('/:id', async (req, res) => {
  try {
    const options = req.body.options
      ? req.body.options.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const correctAnswerIndex = parseInt(req.body.correctAnswerIndex);
    await axiosInstance.put(`${apiUrl}/api/questions/${req.params.id}`, {
      text: req.body.text,
      options,
      correctAnswerIndex
    });
    res.redirect('/questions');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating question: ' + (err.response?.data?.error || err.message));
  }
});

// DELETE /questions/:id
router.delete('/:id', async (req, res) => {
  try {
    await axiosInstance.delete(`${apiUrl}/api/questions/${req.params.id}`);
    res.redirect('/questions');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting question');
  }
});

// GET /questions/:id
router.get('/:id', async (req, res) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/api/questions/${req.params.id}`);
    res.render('questions/detail.ejs', { question: response.data.question });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
