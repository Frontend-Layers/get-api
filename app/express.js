import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session'; // For session management
import flash from 'express-flash'; // For flash messages
import apiRoutes from './routes.js';
import notFoundHandler from './not-found.js';
import errorHandler from './error-handler.js';

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates and configures an Express application.
 * @returns {express.Application} - The configured Express app.
 */
export default function createApp() {
    const app = express();

    // Session configuration (required for flash messages)
    app.use(session({
        secret: 'session-secret-key', // Secret key for session signing
        resave: false, // Do not resave unchanged sessions
        saveUninitialized: true, // Save new but unmodified sessions
        cookie: { secure: false } // Set to true if using HTTPS
    }));

    // Enable flash messages
    app.use(flash());

    // Serve static files from the "public" directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Serve the favicon
    app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

    // Middleware to parse JSON request bodies (must be before routes)
    app.use(express.json());

    // Middleware to parse URL-encoded form data (must be before routes)
    app.use(express.urlencoded({ extended: true }));

    // Use API routes
    app.use(apiRoutes);

    // Catch 404 errors and forward to the error handler
    app.use(notFoundHandler);

    // Error handler
    app.use(errorHandler);

    // Set up the view engine (EJS)
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    return app;
}