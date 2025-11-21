require("dotenv").config();
const express = require("express");
const taxonomyRoutes = require("./routes/taxonomyRoutes");
const swaggerDocs = require("./swagger");

const app = express();
app.use(express.json());

app.use("/taxonomy", taxonomyRoutes);

swaggerDocs(app);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`taxonomy-service running → http://localhost:${PORT}/api-docs`);
});

