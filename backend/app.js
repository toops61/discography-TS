const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const discsRoutes = require('./routes/discsRoutes');
const wishesRoutes = require('./routes/wishesRoutes');
const userRoutes = require('./routes/userRoutes');

const uri = process.env.URI;

dotenv.config();

mongoose.connect(uri,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(error => console.log('Connexion à MongoDB échouée !',error));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

//app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/', discsRoutes);
app.use('/', wishesRoutes);
app.use('/', userRoutes);

module.exports = app;