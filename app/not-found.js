import logger from './logger.js';

const notFoundHandler = (req, res) => {
  logger.warn('404 Not Found', { path: req.path });
  res.status(404).json({ error: 'Not found' });
};

export default notFoundHandler;