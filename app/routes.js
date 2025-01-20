import express from 'express';
import { query, validationResult } from 'express-validator';
import { fetchData } from '../api/index.js';
import logger from './logger.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Resolve the base directory for the data folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../api/data');

// Helper function to read and parse all JSON files in the data directory
const readJsonFiles = async () => {
  try {
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    const jsonData = {};

    // Read each JSON file and parse it
    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      const data = await fs.readFile(filePath, 'utf8');
      jsonData[file.replace('.json', '')] = JSON.parse(data);
    }

    // Sort data by file name (key)
    const sortedJsonData = Object.keys(jsonData)
      .sort()
      .reduce((acc, key) => {
        acc[key] = jsonData[key];
        return acc;
      }, {});

    return sortedJsonData;
  } catch (error) {
    logger.error('Error reading JSON files', { error: error.message });
    throw error;
  }
};

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

    const data = await fetchData(service, q);
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

    const apiData = await readJsonFiles();

    res.render('catalogue', { data: apiData });
  } catch (error) {
    logger.error('Error reading JSON files', { error: error.message });
    next(error);
  }
});

router.get('/status', (req, res) => {
  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
