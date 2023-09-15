const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const utilsConnect = require('./utils/connect');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const app = express();

// Accès au corps de la requête
app.use(express.json());

utilsConnect.mongooseConnect();

// Appliqué à toutes les routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;