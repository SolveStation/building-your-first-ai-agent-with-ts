/**
 * Simple logging utility for the application
 */

/**
 * Log levels for structured logging
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

/**
 * Logger class for structured logging
 */
export class Logger {
  private static formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };
    return JSON.stringify(logEntry, null, 2);
  }

  /**
   * Log an info message
   */
  static info(message: string, data?: any): void {
    console.log(this.formatMessage(LogLevel.INFO, message, data));
  }

  /**
   * Log a warning message
   */
  static warn(message: string, data?: any): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, data));
  }

  /**
   * Log an error message
   */
  static error(message: string, error?: Error, data?: any): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, { error: error?.message, ...data }));
  }

  /**
   * Log a debug message
   */
  static debug(message: string, data?: any): void {
    console.log(this.formatMessage(LogLevel.DEBUG, message, data));
  }
}
