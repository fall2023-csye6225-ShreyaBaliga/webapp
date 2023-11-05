var winston = require('winston')

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: '/opt/csye6225/combined.log'})],
  });
  
  module.exports = logger;