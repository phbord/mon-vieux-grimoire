const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bookRoutes = require('./routes/book');
const utilsConnect = require('./utils/connect');
require('dotenv').config();

const app = express();
const uri = `${process.env.MONGODB_ROOT}${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_URI_PART}?retryWrites=true&w=majority`;

// Accès au corps de la requête
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(e => console.log(`Connexion à MongoDB échouée ! - ${e}`)
);

//utilsConnect.mongooseConnect();

// Appliqué à toutes les routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/api/books', bookRoutes);

module.exports = app;