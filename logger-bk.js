const winston = require("winston");
//const MESSAGE = Symbol.for('message');

const level = process.env.LOG_LEVEL || 'debug';

const logger = new winston.createLogger ({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.prettyPrint(),
                winston.format.simple()
            ),
            level: level
        })
    ]
});


// const jsonFormatter = (logEntry) => {
//     const base = { timestamp: new Date() };
//     const json = Object.assign(base, logEntry)
//     logEntry[MESSAGE] = JSON.stringify(json);
//     return logEntry;
// }

// const logger = new winston.createLogger ({
//     transports: new winston.transports.Console(),
//     format: winston.format(jsonFormatter)(),
//     level: level
// });

module.exports = logger;