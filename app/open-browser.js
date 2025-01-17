import open from 'open';

const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;

open(URL).then(() => {
  console.log(`Browser opened at ${URL}`);
}).catch(err => {
  console.error('Error opening browser:', err);
});
