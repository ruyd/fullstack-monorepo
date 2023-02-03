import winston from 'winston'

const format = winston.format.combine(winston.format.timestamp(), winston.format.simple())
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: '_error.log',
      level: 'error',
      format,
    }),
    new winston.transports.File({
      filename: '_trace.log',
      format,
    }),
  ],
})

export default logger
