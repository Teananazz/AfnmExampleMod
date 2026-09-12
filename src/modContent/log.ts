import log from 'loglevel';

// Configure your logger preferences once
log.setLevel('debug');

// Optional: Prefix log messages for your mod/game engine
const prefix = '[Mod Engine]';

export const logger = {
  trace: (...args: any[]) => log.trace(prefix, ...args),
  debug: (...args: any[]) => log.debug(prefix, ...args),
  info:  (...args: any[]) => log.info(prefix, ...args),
  warn:  (...args: any[]) => log.warn(prefix, ...args),
  error: (...args: any[]) => log.error(prefix, ...args),
};

export default logger;