import { injectable } from 'inversify';
import ILoggerService from './ILoggerService';
import { createLogger, transports, format, Logger as WinstonLogger } from "winston";

@injectable()
export default class LoggerService implements ILoggerService {
	private logger: WinstonLogger;




	constructor(name: string = "") {
		const logConfig = {
			level: 'debug',
			format: format.combine(
				format.timestamp({ format: 'YYYY-MM-dd HH:mm:ss.SSS' }),
				format.printf((log) => `${[log.timestamp]} | ${log.level} | ${name} | ${log.message}`)
			)
		};
		this.logger = createLogger({
			transports: [new transports.Console(logConfig)],
			format: format.combine(
				format.splat(),
				format.simple()
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
