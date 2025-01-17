import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmetConfig from './app/helmet-config.js';
import logger from './app/logger.js';
import apiRoutes from './app/routes.js';
import notFoundHandler from './app/not-found.js';
import errorHandler from './app/error-handler.js';
import startServer from './app/server.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'app', 'public')));

// XSS prevention
app.use(helmetConfig);

// API routes
app.use(apiRoutes);

// Catch 404
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views'));

// Start the server
startServer(app, PORT);