import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// import helmetConfig from './helmet-config.js';
import apiRoutes from './routes.js';
import notFoundHandler from './not-found.js';
import errorHandler from './error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function createApp() {
    const app = express();

    // Serve static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Add favicon middleware
    app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

    // XSS prevention
    // app.use(helmetConfig);

    // API routes
    app.use(apiRoutes);

    // Catch 404
    app.use(notFoundHandler);

    // Error handler
    app.use(errorHandler);

    // View engine setup
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    return app;
}
