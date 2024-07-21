import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, json, printf } = format;

// Define your log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = createLogger({
  level: 'info', // Set the minimum level of logs you want to capture
  format: combine(
    timestamp(),
    json() // or use logFormat for custom format
  ),
  transports: [
    new transports.File({ filename: 'app.log' }), // Log to a file
    new transports.Console() // Also log to console (optional)
  ],
});

export default logger;
