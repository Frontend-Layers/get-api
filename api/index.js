import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../app/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const indexPath = path.join(dataDir, 'index.json');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  logger.info('Created data directory');
}

// Ensure the index.json file exists
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, JSON.stringify({}), 'utf-8');
  logger.info('Created empty index.json');
}

// Load the data from index.json
const data = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

/**
 * Fetches data from a specified API service.
 * @param {string} serviceName - The name of the service (e.g., "LanguageTool").
 * @param {Object} query - The query or input data for the API (dynamic parameters).
 * @returns {Promise<Object|null>} - The API response or null if an error occurs.
 */
export const fetchData = async (serviceName, query = {}) => {
  // Retrieve the service configuration from the data file
  const service = data[serviceName];
  if (!service) {
    logger.error(`Service "${serviceName}" not configured.`);
    return null;
  }

  // Fetch the API key from environment variables based on the service name
  const apiKeyEnvVar = `${serviceName.toUpperCase()}_API_KEY`;
  const apiKey = process.env[apiKeyEnvVar];

  // Determine the parameters for access_key and request_key
  const accessKey = service.access_key;
  const requestKey = service.request_key;

  // Prepare the query parameters
  const queryParams = { ...query }; // Copy user-provided query parameters

  // Add the access key (API key) if required
  if (accessKey && apiKey) {
    queryParams[accessKey] = apiKey;
  } else if (accessKey && !apiKey) {
    logger.warn(`API key for service "${serviceName}" is missing. Proceeding without it.`);
  }

  // Add the request key (main query parameter) if required
  if (requestKey && query[requestKey]) {
    queryParams[requestKey] = query[requestKey];
  }

  // Check if the service requires additional parameters
  const postParams = service.post || [];
  postParams.forEach(param => {
    if (query[param] !== undefined) {
      queryParams[param] = query[param];
    } else {
      logger.warn(`Parameter "${param}" is missing in query data for service "${serviceName}".`);
    }
  });

  // Construct the full request URL using the service's endpoint
  const url = new URL(service.endpoint);

  // Determine the HTTP method (default to GET if not specified)
  const method = service.method || 'GET';

  // Prepare the request options
  const requestOptions = {
    method,
    headers: service.header || {},
  };

  // Handle GET and POST requests differently
  if (method === 'GET') {
    // For GET requests, append query parameters to the URL
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  } else if (method === 'POST') {
    // For POST requests, add the body based on the Content-Type
    if (service.header['Content-Type'] === 'application/x-www-form-urlencoded') {
      requestOptions.body = new URLSearchParams(queryParams); // For form data
    } else if (service.header['Content-Type'] === 'application/json') {
      requestOptions.body = JSON.stringify(queryParams); // For JSON data
    } else {
      logger.warn(`Unsupported Content-Type for POST request: ${service.header['Content-Type']}`);
      return null;
    }
  } else {
    logger.error(`Unsupported HTTP method: ${method}`);
    return null;
  }

  // Log request details
  logger.info(`Request URL: ${url.toString()}`);
  logger.info(`Request Method: ${method}`);
  logger.info(`Request Headers: ${JSON.stringify(requestOptions.headers)}`);
  if (requestOptions.body) {
    logger.info(`Request Body: ${requestOptions.body}`);
  }

  try {
    // Send the HTTP request to the API
    const response = await fetch(url.toString(), requestOptions);

    // If the response is not ok, log the error and return null
    if (!response.ok) {
      const errorMessage = `Error fetching data from ${serviceName}: ${response.statusText}`;
      logger.error(errorMessage);
      logger.error(`Response Status: ${response.status}`);
      logger.error(`Response Data: ${await response.text()}`);
      return null;
    }

    // Parse and return the JSON response
    const result = await response.json();
    logger.info(`Successfully fetched data from ${serviceName}`);
    return result;
  } catch (error) {
    logger.error(`Failed to fetch data from ${serviceName}: ${error.message}`);
    return null;
  }
};