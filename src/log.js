import Enum from 'es6-enum'
import moment from 'moment'

const NODE_ENV = (() => {
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return 'production';
})();

const LogLevel = Enum('INFO', 'WARING', 'ERROR', 'DEBUG');

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

  info(content) {
    if ([LogLevel.INFO, LogLevel.DEBUG].includes(this._level)) {
      console.info(`[I][${moment().format('YYYY-MM-DD hh:mm:ss')}] ${content}`);
    }
  }

  debug(content) {
    if ([LogLevel.INFO, LogLevel.WARING, LogLevel.ERROR, LogLevel.DEBUG].includes(this._level)) {
      console.debug(`[D][${moment().format('YYYY-MM-DD hh:mm:ss')}] ${content}`)
    }
  }

  warn(content) {
    if ([LogLevel.WARING, LogLevel.DEBUG].includes(this._level)) {
      console.warn(`[W][${moment().format('YYYY-MM-DD hh:mm:ss')}] ${content}`)
    }
  }

  error(content) {
    if ([LogLevel.ERROR, LogLevel.DEBUG].includes(this._level)) {
      console.error(`[E][${moment().format('YYYY-MM-DD hh:mm:ss')}] ${content}`)
    }
  }
}

export default new Log(NODE_ENV);
