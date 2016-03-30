import Enum from 'enum'
import moment from 'moment'

const NODE_ENV = (() => {
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return 'production';
})();

const LogLevel = new Enum(['INFO', 'WARING', 'ERROR', 'DEBUG']);

class Log {
  constructor(node_env) {
    if (node_env == 'production') {
      this._level = LogLevel.ERROR;
    } else {
      this._level = LogLevel.DEBUG;
    }
  }

  setLevel(level) {
    this._level = level;
  }

  info(...args) {
    if ([LogLevel.INFO, LogLevel.DEBUG].includes(this._level)) {
      args.unshift(`[I][${moment().format('YYYY-MM-DD hh:mm:ss')}]`);
      console.log.apply(console, args);
    }
  }

  debug(...args) {
    if ([LogLevel.INFO, LogLevel.WARING, LogLevel.ERROR, LogLevel.DEBUG].includes(this._level)) {
      args.unshift(`[D][${moment().format('YYYY-MM-DD hh:mm:ss')}]`);
      console.log.apply(console, args);
    }
  }

  warn(...args) {
    if ([LogLevel.WARING, LogLevel.DEBUG].includes(this._level)) {
      args.unshift(`[W][${moment().format('YYYY-MM-DD hh:mm:ss')}]`);
      console.log.apply(console, args);
    }
  }

  error(...args) {
    if ([LogLevel.ERROR, LogLevel.DEBUG].includes(this._level)) {
      args.unshift(`[E][${moment().format('YYYY-MM-DD hh:mm:ss')}]`);
      console.log.apply(console, args);
    }
  }
}

export default new Log(NODE_ENV);
