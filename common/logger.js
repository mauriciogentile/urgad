var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs.txt' });

module.exports = winston;