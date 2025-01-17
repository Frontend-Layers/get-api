import 'dotenv/config';
import dataWeather from './data/weather.json' with { type: 'json' };

export const fetchData = async (serviceName, queryParams) => {
  const service = dataWeather[serviceName];
  if (!service) {
    throw new Error(`Service "${serviceName}" not configured.`);
  }

  const apiKeyEnvVar = `${serviceName.toUpperCase()}_API_KEY`;
  const apiKey = process.env[apiKeyEnvVar];

  if (!apiKey) {
    throw new Error(`API key for "${serviceName}" not found.`);
  }

  const apiKeyParam = service.apiKeyParam || 'key';
  queryParams = { ...queryParams, [apiKeyParam]: apiKey };

  const url = new URL(service.baseUrl);
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  console.log(`Fetching data from: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    headers: service.headers || {},
  });

  if (!response.ok) {
    throw new Error(`Error fetching data from ${serviceName}: ${response.statusText}`);
  }

  return await response.json();
};
