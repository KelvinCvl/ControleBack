const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const speciesRoutes = require('./routes/species');
const observationRoutes = require('./routes/observations');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    message: 'Observation service is running ✅',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/species', speciesRoutes);
app.use('/observations', observationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`\n🚀 Observation Service started on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📚 Swagger: http://localhost:${PORT}/api-docs\n`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});