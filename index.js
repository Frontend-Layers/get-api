import 'dotenv/config';
import createApp from './app/express.js';
import startServer from './app/server.js';

const PORT = process.env.PORT || 3000;
const app = createApp();

// Start the server
startServer(app, PORT);