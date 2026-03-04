require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const connectDB = require('./config/database');

const app = express();
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engines
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: false, layoutsDir: path.join(__dirname, 'views/layouts') }));
app.engine('ejs', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// API routes
app.use('/api', require('./routes/apiRoutes'));

// UI routes
app.use('/quizzes', require('./routes/quizRoutes'));
app.use('/questions', require('./routes/questionRoutes'));

// Home
app.get('/', (req, res) => {
  res.render('home', { layout: 'main' });
});

// HTTPS server
const PORT = process.env.PORT || 3443;
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs/server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs/server.cert'))
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});
