const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
// Loads environment variables from a .env file into process.env.
require('dotenv').config();

const initializeMiddlewares = (app) => {
  // Enable All CORS Requests.
  app.use(cors());
  // Parses incoming requests with JSON payloads.
  app.use(express.json());
  // Parses incoming requests with urlencoded payloads.
  app.use(express.urlencoded({ extended: true }));
  // Secure app by setting various HTTP headers.
  app.use(helmet());
}

const initializeExpress = () => {
  const app = express();
  // Initialize all middlewares.
  initializeMiddlewares(app);
  // Load Rest API routes.
  app.use('/api', routes);
  // Error handler.
  app.use((err, _req, res, _next) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
      status: 'failure',
      message,
    })
  })
  // Start app on given port.
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}!`));
}

initializeExpress();