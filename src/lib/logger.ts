type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
}

function formatMessage({ message, context, data }: LogEntry): string {
  const prefix = context ? `[${context}]` : '';
  const parts = [prefix, message].filter(Boolean).join(' ');
  return data !== undefined ? `${parts} ${JSON.stringify(data)}` : parts;
}

function log(entry: LogEntry): void {
  const msg = formatMessage(entry);
  switch (entry.level) {
    case 'error':
      // eslint-disable-next-line no-console
      console.error(msg);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(msg);
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(msg);
  }
}

export const logger = {
  info: (message: string, data?: unknown, context?: string) =>
    log({ level: 'info', message, context, data }),
  warn: (message: string, data?: unknown, context?: string) =>
    log({ level: 'warn', message, context, data }),
  error: (message: string, data?: unknown, context?: string) =>
    log({ level: 'error', message, context, data }),
};
