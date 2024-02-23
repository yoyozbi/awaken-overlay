export default interface ILoggerService {
  log(message: string): void;
  logDebug(message: string): void;
  logWarning(message: string): void;
  logError(message: string): void;
  logError(error: Error): void;
  logError(error: unknown): void;
}
