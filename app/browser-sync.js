import browserSync from 'browser-sync';

browserSync.init({
  proxy: 'http://localhost:3000',
  files: ['./'],
  ignore: ['node_modules'],
  reloadDelay: 100,
  port: 3001
});

process.on('SIGINT', () => {
  browserSync.exit();
  process.exit();
});