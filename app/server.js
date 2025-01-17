import logger from './logger.js';

const startServer = (app, port) => {
  app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
    logger.info(`Server mode: ${process.env.NODE_ENV}`);
  });
};

export default startServer;