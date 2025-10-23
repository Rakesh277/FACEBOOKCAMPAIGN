import fs from "fs";
import path from "path";

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, "server.log");

const getTimestamp = () => new Date().toISOString();

export const logger = (msg: string) => {
  const formatted = `[${getTimestamp()}] [LOG]: ${msg}`;
  console.log(formatted);
  fs.appendFileSync(logFilePath, formatted + "\n");
};

export const errorLogger = (msg: string) => {
  const formatted = `[${getTimestamp()}] [ERROR]: ${msg}`;
  console.error(formatted);
  fs.appendFileSync(logFilePath, formatted + "\n");
};