// app.js
const express = require('express');
const cors = require('cors');
const templateRoutes = require('./routes/metroDataRoutes');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/', templateRoutes);

module.exports = app;
