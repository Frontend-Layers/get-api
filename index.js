import 'dotenv/config';
import http from 'http';
import url from 'url';
import { fetchData } from './api/index.js';

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (pathname === '/api') {
    const { service, q } = query;

    if (!service || !q) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing "service" or "q" query parameter.' }));
      return;
    }

    try {
      console.log(`Fetching data for service: ${service}, query: ${q}`);
      const data = await fetchData(service, { q, appid: process.env.OPENWEATHER_API_KEY });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (error) {
      console.error('Error during fetchData:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});