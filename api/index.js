import 'dotenv/config';
import cfgWeather from './cfg/weather.json' with { type: 'json' };

export const fetchData = async (serviceName, queryParams) => {
    const service = cfgWeather[serviceName];
    if (!service) {
        throw new Error(`Service "${serviceName}" not configured.`);
    }

    const apiKeyEnvVar = `${serviceName.toUpperCase()}_API_KEY`;
    const apiKey = process.env[apiKeyEnvVar];

    if (!apiKey) {
        throw new Error(`API key for "${serviceName}" not found.`);
    }

    queryParams = { ...queryParams, key: apiKey };

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