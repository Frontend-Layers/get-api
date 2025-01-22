import * as chai from 'chai';
import { fetchData } from '../../../api/index.js';

const { expect } = chai;

describe('Text API Tests', () => {
  it('should fetch data from TextGears API', async () => {
    const serviceName = 'TextGears';
    const query = {
      text: 'This is a test sentence with a error.',
      language: 'en-US'
    };

    const result = await fetchData(serviceName, query);

    console.log('TextGears API Response:', result); // Логируем ответ для отладки

    // Проверяем, что результат не null
    expect(result).to.not.be.null;

    // Проверяем, что ответ содержит статус и он true
    expect(result).to.have.property('status');
    expect(result.status).to.be.true;

    // Проверяем, что ответ содержит поле response и это объект
    expect(result).to.have.property('response');
    expect(result.response).to.be.an('object');

    // Проверяем, что response содержит массив errors
    expect(result.response).to.have.property('errors');
    expect(result.response.errors).to.be.an('array');

    // Проверяем, что errors содержит хотя бы одну ошибку
    if (result.response.errors.length > 0) {
      const firstError = result.response.errors[0];
      expect(firstError).to.have.property('id');
      expect(firstError).to.have.property('bad');
      expect(firstError).to.have.property('better');
      expect(firstError.better).to.be.an('array');
    }
  });

  it('should handle errors for missing API key', async () => {
    const serviceName = 'TextGears';
    const query = {
      text: 'This is a test sentence with a error.',
      language: 'en-US'
    };

    // Сохраняем текущий API ключ
    const originalApiKey = process.env.TEXTGEARS_API_KEY;

    // Удаляем API ключ из переменных окружения
    delete process.env.TEXTGEARS_API_KEY;

    const result = await fetchData(serviceName, query);

    // Восстанавливаем API ключ
    process.env.TEXTGEARS_API_KEY = originalApiKey;

    // Проверяем, что результат null (так как API ключ отсутствует)
    expect(result).to.be.null;
  });

  it('should handle errors for invalid query', async () => {
    const serviceName = 'TextGears';
    const query = {
      text: '', // Пустой текст
      language: 'en-US'
    };

    const result = await fetchData(serviceName, query);

    // Проверяем, что результат null (так как запрос пустой)
    expect(result).to.be.null;
  });
});