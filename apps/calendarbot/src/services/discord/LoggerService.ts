import { injectable } from 'inversify';
import ILoggerService from './ILoggerService';
import { createLogger, transports, format, Logger as WinstonLogger } from "winston";

@injectable()
export default class LoggerService implements ILoggerService {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      transports: [new transports.Console()],
      format: format.combine(format.colorize(), format.timestamp(), format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`
      })
      ),
    });
  }

  logDebug(message: string): void {
    this.logger.debug(message);
  }

  log(message: string): void {
    this.logger.info(message);
  }

  logWarning(message: string): void {
    this.logger.warn(message)
  }

  logError(message: string): void;
  logError(error: Error): void;
  logError(error: unknown): void {
    this.logger.error(error);
  }
}
