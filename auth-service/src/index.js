import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import 'express-async-errors';
import authRoutes from './routes/authRoutes.js';
import { swaggerDocs } from './swagger.js';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

swaggerDocs(app);

app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\nAuth Service démarré sur le port ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});

export default app;
