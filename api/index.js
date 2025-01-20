import 'dotenv/config';
import data from './data/index.json' with { type: 'json' };

export const fetchData = async (serviceName, query) => {

  // Retrieve the service configuration from the data file
  const service = data[serviceName];
  if (!service) {
    throw new Error(`Service "${serviceName}" not configured.`);
  }

  // Fetch the API key from environment variables based on the service name
  const apiKeyEnvVar = `${serviceName.toUpperCase()}_API_KEY`;
  const apiKey = process.env[apiKeyEnvVar];

  // Determine the parameters for access_key and request_key
  const accessKey = service.access_key;
  const requestKey = service.request_key;

  // Add the access key and request key to the query parameters
  const queryParams = {
    ...(accessKey ? { [accessKey]: apiKey } : {}),
    ...(requestKey ? { [requestKey]: query } : {}),
  };

  // Construct the full request URL using the service's endpoint and query parameters
  const url = new URL(service.endpoint);

  if (queryParams && Object.keys(queryParams).length > 0) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  console.log('Request URL:', url.toString());

  // Send the HTTP request to the API
  const response = await fetch(url.toString());

  // If the response is not ok, throw an error
  if (!response.ok) {
    throw new Error(`Error fetching data from ${serviceName}: ${response.statusText}`);
  }

  // Parse and return the JSON response
  return await response.json();
};
