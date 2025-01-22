import express from 'express';
import { query, validationResult } from 'express-validator';
import { fetchData } from '../api/index.js';
import logger from './logger.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process'; // Import exec to run shell commands

const router = express.Router();

// Resolve the base directory for the data folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../api/data');

/**
 * Helper function to read and parse all JSON files in the data directory.
 * @returns {Promise<Object>} - Sorted JSON data.
 */
const readJsonFiles = async () => {
  try {
    const indexPath = path.join(dataDir, 'index.json');
    const data = await fs.readFile(indexPath, 'utf8');
    const jsonData = JSON.parse(data);

    // Group the data by category
    const groupedData = {};

    for (let apiName in jsonData) {
      const apiData = jsonData[apiName];
      const category = apiData.cat;

      if (!groupedData[category]) {
        groupedData[category] = [];
      }

      // Add the API name to the data
      apiData.name = apiName;
      groupedData[category].push(apiData);
    }

    return groupedData;
  } catch (error) {
    logger.error('Error reading JSON files', { error: error.message });
    throw error;
  }
};

/**
 * GET /api
 * Fetches data from a specified service.
 */
router.get('/api', [
  query('service')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Service must be a non-empty string')
    .escape(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation error', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { service, ...params } = req.query;

    logger.info('API request received', {
      service,
      params,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    const data = await fetchData(service, params);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /catalogue or /catalogue.html
 * Renders the catalogue page with data from JSON files.
 */
router.get(['/catalogue', '/catalogue.html'], async (req, res, next) => {
  try {
    logger.info('Catalogue request received', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    const groupedData = await readJsonFiles();
    res.render('catalogue', { groupedData });
  } catch (error) {
    logger.error('Error reading JSON files', { error: error.message });
    next(error);
  }
});

/**
 * GET /json or /json.html
 * Renders the JSON utilities page.
 */
router.get(['/json', '/json.html'], async (req, res, next) => {
  try {
    // Pass flash messages to the template
    const messages = {
      error: req.flash('error'),
      success: req.flash('success')
    };

    res.render('json', { messages });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /json
 * Handles the request to combine JSON files.
 */
router.post('/json', async (req, res, next) => {
  // Path to the _combine.js script
  const combineScriptPath = path.join(__dirname, '../api/data/_combine.js');

  try {
    // Check if the request body exists and contains btn_render_index
    if (!req.body || !req.body.btn_render_index) {
      req.flash('error', 'Missing btn_render_index in request body');
      return res.redirect('/json');
    }

    // Check if the "Render Index" button was pressed
    if (req.body.btn_render_index === 'btn_render_index') {
      // Launch the _combine.js script
      exec(`node ${combineScriptPath}`, (error, stdout, stderr) => {
        if (error) {
          logger.error('Error running _combine.js', { error: error.message });
          req.flash('error', 'Error combining JSON files');
          return res.redirect('/json');
        }

        // Log any warnings from the script
        if (stderr) {
          logger.warn('_combine.js stderr', { stderr });
        }

        // Log the script's output
        logger.info('_combine.js output', { stdout });

        // Flash success message
        req.flash('success', 'JSON files combined successfully!');

        // Redirect back to the /json page
        res.redirect('/json');
      });
    } else {
      req.flash('error', 'Invalid request');
      res.redirect('/json');
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /status
 * Returns the server status.
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;