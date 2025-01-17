import express from 'express';
import { query, validationResult } from 'express-validator';
import { fetchData } from '../api/index.js';
import logger from './logger.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Resolve the base directory for content.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentPath = path.join(__dirname, '../api/data/content.json');

router.get('/api', [
  query('service')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Service must be a non-empty string')
    .escape(),
  query('q')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Query must be a non-empty string')
    .escape()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation error', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { service, q } = req.query;

    logger.info('API request received', {
      service,
      query: q,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    const data = await fetchData(service, { q });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get(['/catalogue', '/catalogue.html'], async (req, res, next) => {
  try {
    logger.info('Catalogue request received', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    const data = await fs.readFile(contentPath, 'utf8');
    const apiData = JSON.parse(data);

    res.render('catalogue', { data: apiData });
  } catch (error) {
    logger.error('Error reading content.json', { error: error.message });
    next(error);
  }
});


export default router;
