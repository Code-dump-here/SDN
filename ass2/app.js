require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

// MongoDB connection
const connectDB = require('./config/database');
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engines

// Register Handlebars engine for .hbs files
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: false }));
// Register EJS engine for .ejs files
app.engine('ejs', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

// Routes

// EJS routes
app.use('/quizzes', require('./routes/quizRoutes'));
app.use('/questions', require('./routes/questionRoutes'));


// Home route uses Handlebars
app.get('/', (req, res) => {
  res.render('layouts/main.hbs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
