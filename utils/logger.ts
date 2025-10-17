const ENABLE_LOGS = true;

export const devLog = (...args: any[]) => {
  if (__DEV__ && ENABLE_LOGS) {
    console.log(...args);
  }
};

export const devWarn = (...args: any[]) => {
  if (__DEV__ && ENABLE_LOGS) {
    console.warn(...args);
  }
};

export const devError = (...args: any[]) => {
  if (__DEV__ && ENABLE_LOGS) {
    console.error(...args);
  }
};

export const createLogger = (moduleName: string, enabled = true) => ({
  log: (...args: any[]) => {
    if (__DEV__ && ENABLE_LOGS && enabled) {
      console.log(`[${moduleName}]`, ...args);
    }
  },
  warn: (...args: any[]) => {
    if (__DEV__ && ENABLE_LOGS && enabled) {
      console.warn(`[${moduleName}]`, ...args);
    }
  },
  error: (...args: any[]) => {
    if (__DEV__ && ENABLE_LOGS && enabled) {
      console.error(`[${moduleName}]`, ...args);
    }
  },
});
