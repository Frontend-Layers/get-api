// test/test.js
import { expect } from 'chai';
import fetch from 'node-fetch';
import 'dotenv/config';

const { OPENWEATHER_API_KEY, WEATHERAPI_API_KEY } = process.env;

const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const weatherApiBaseUrl = 'https://api.weatherapi.com/v1/current.json';

describe('API Fetch Test', () => {
  it('should fetch data from openWeather API', async () => {
    const city = 'London';
    const url = `${openWeatherBaseUrl}?q=${city}&appid=${OPENWEATHER_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.weather).to.be.an('array');
    expect(data.weather[0]).to.have.property('description');
  });

  it('should fetch data from weatherApi API', async () => {
    const city = 'Paris';
    const url = `${weatherApiBaseUrl}?q=${city}&key=${WEATHERAPI_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.current).to.be.an('object');
    expect(data.current).to.have.property('temp_c');
  });
});
