const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Observation Service API',
      version: '1.0.0',
      description: 'API pour gérer les observations de créatures abyssales - DeepSea Archives',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3002}`,
        description: 'Development server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Production server (if applicable)'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from auth-service'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
