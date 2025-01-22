import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { fetchData } from '../../../api/index.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Weather API Tests', () => {
  it('should fetch data from OpenWeather API', async () => {
    const serviceName = 'OpenWeather';
    const query = 'London';

    const result = await fetchData(serviceName, query);

    expect(result).to.not.be.null;
    expect(result).to.have.property('name');
    expect(result.name).to.equal(query);
  });

  it('should fetch data from WeatherAPI API', async () => {
    const serviceName = 'WeatherAPI';
    const query = 'Paris';

    const result = await fetchData(serviceName, query);

    expect(result).to.not.be.null;
    expect(result).to.have.property('location');
    expect(result.location.name).to.equal(query);
  });

  it('should fetch data from WeatherStack API', async () => {
    const serviceName = 'WeatherStack';
    const query = 'Berlin';

    const result = await fetchData(serviceName, query);

    expect(result).to.not.be.null;
    expect(result).to.have.property('location');
    expect(result.location.name).to.equal(query);
  });

  it('should handle errors for invalid service name', async () => {
    const serviceName = 'InvalidService';
    const query = 'exampleQuery';

    const result = await fetchData(serviceName, query);

    expect(result).to.be.null;
  });

  it('should handle errors for missing API key', async () => {
    const serviceName = 'OpenWeather';
    const query = 'London';

    process.env.OPENWEATHER_API_KEY = '';

    const result = await fetchData(serviceName, query);

    expect(result).to.be.null;
  });
});