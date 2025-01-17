import helmet from 'helmet';

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["*"],
      scriptSrc: ["'self'", "*", "'unsafe-inline'"],
      styleSrc: ["'self'", "*", "'unsafe-inline'"],
      imgSrc: ["'self'", "*", "data:"],
      fontSrc: ["'self'", "*"],
      connectSrc: ["'self'", "*"],
      frameSrc: ["*"],
      objectSrc: ["*"],
      mediaSrc: ["*"],
      manifestSrc: ["*"],
    }
  }
});

export default helmetConfig;