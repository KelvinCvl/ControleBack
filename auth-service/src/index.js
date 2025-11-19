require('dotenv').config();
const express = require('express');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
app.use(express.json());

require('express-async-errors');

app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\nAuth Service démarré`);
});

module.exports = app; 