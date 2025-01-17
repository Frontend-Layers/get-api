# get-api

Get API is a simple Node.js project designed to fetch data from various API services via HTTP requests. This project supports multiple APIs and allows you to configure API keys and parameters dynamically for different services.

## Features

- Fetch weather data from popular API services
- Modular configuration for adding additional APIs easily.
- Simple HTTP server to handle API requests and responses.
- Configurable API keys and request parameters.

## Project Structure

```
├── api
│   ├── cfg
│   │   └── weather.json
│   └── index.js
├── test
│   ├── report
│   └── test.js
├── index.js
├── package.json
├── README.md
└── .env
```

### Key Files

- **api/data/weather.json**: Configuration for supported APIs.
- **api/index.js**: Logic for fetching data from APIs.
- **test/test.js**: Mocha tests for API endpoints.
- **index.js**: Main server entry point.

## Configuration

### Weather Services Configuration

`api/data/weather.json` contains the configuration for supported weather services. Example:

```json
{
  "openWeather": {
    "baseUrl": "https://api.openweathermap.org/data/2.5/weather",
    "headers": {
      "Content-Type": "application/json"
    },
    "apiKeyParam": "appid"
  },
  "weatherApi": {
    "baseUrl": "https://api.weatherapi.com/v1/current.json",
    "headers": {},
    "apiKeyParam": "key"
  },
  "weatherstack": {
    "baseUrl": "http://api.weatherstack.com/current",
    "headers": {},
    "apiKeyParam": "access_key"
  }
}
```

### Environment Variables

Add your API keys in the `.env` file:

```
OPENWEATHER_API_KEY=your_openweather_api_key
WEATHERAPI_API_KEY=your_weatherapi_api_key
WEATHERSTACK_API_KEY=your_weatherstack_api_key
PORT=3000
```

## Usage

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`.

### API Endpoints

#### Fetch Weather Data

`GET /api?service=<service_name>&q=<query>`

- **service**: The name of the weather service (e.g., `openWeather`, `weatherApi`, `weatherstack`).
- **q**: The query string (e.g., city name).

Example:

```bash
curl "http://localhost:3000/api?service=openWeather&q=Berlin"
curl "http://localhost:3000/api?service=weatherApi&q=Paris"
curl "http://localhost:3000/api?service=weatherstack&q=New York"
```

## Testing

Run the tests using Mocha:

```bash
npm test
```

### Example Tests

```javascript
import { expect } from 'chai';
import fetch from 'node-fetch';
import 'dotenv/config';

const { OPENWEATHER_API_KEY, WEATHERAPI_API_KEY, WEATHERSTACK_API_KEY } = process.env;

describe('API Fetch Test', () => {
  it('should fetch data from OpenWeather API', async () => {
    const city = 'London';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.weather).to.be.an('array');
    expect(data.weather[0]).to.have.property('description');
  });

  it('should fetch data from WeatherApi API', async () => {
    const city = 'Paris';
    const url = `https://api.weatherapi.com/v1/current.json?q=${city}&key=${WEATHERAPI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.current).to.be.an('object');
    expect(data.current).to.have.property('temp_c');
  });

  it('should fetch data from Weatherstack API', async () => {
    const city = 'Berlin';
    const url = `http://api.weatherstack.com/current?query=${city}&access_key=${WEATHERSTACK_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.current).to.have.property('temperature');
  });
});
```

## License

This project is licensed under the MIT License.

