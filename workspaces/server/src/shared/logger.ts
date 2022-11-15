import axios from 'axios'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.simple(), winston.format.metadata()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: '_error.log', level: 'error' }),
    new winston.transports.File({ filename: '_trace.log' }),
  ],
})

export function activateAxiosTrace() {
  axios.interceptors.request.use(config => {
    // using console to avoid sensitive data in logs
    // eslint-disable-next-line no-console
    console.log('Request', config.url, config.method, config.data)
    return config
  })

  axios.interceptors.response.use(config => {
    // eslint-disable-next-line no-console
    console.log('Response', config.data, config.statusText)
    return config
  })
}

export default logger
