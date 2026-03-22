require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Routes
app.use('/auth', require('./routes/authApi'));
app.use('/auth', require('./routes/authClient'));
app.use('/api', require('./routes/apartments'));
app.use('/view', require('./routes/residents'));

// Redirect root to login
app.get('/', (req, res) => res.redirect('/auth/signin'));

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (req.headers['content-type'] === 'application/json' || req.path.startsWith('/api') || req.path === '/auth/login') {
    return res.status(status).json({ message: err.message });
  }
  res.status(status).send(err.message);
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
