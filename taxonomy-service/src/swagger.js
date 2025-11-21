const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Taxonomy Service API",
      version: "1.0.0",
      description: "Microservice d'analyse et classification des espèces",
    },
    servers: [
      {
        url: "http://localhost:3003",
      },
    ],
  },
  apis: [__dirname + "/routes/*.js"]

};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
