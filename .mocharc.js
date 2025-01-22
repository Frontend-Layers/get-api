export default {
  extension: ['mjs', 'js'],
  loader: 'esm',
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: './app/public/tests/report',
    reportFilename: 'index.html',
    quiet: true,
  },
};