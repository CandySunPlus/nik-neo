import * as cp from 'child_process'
import Immutable from 'immutable'
import attach from 'neovim-client'
import logger from '../log'

export default class Process {
  constructor(command='', argv=[]) {
    this._process = null;
    this._client = null;
    this._command = command;
    this._argv = Immutable.List(argv).push('--embed').toArray();
    this.started = false;
  }

  attach(cols, rows, onRedraw, onRequest) {
    // attach to nvim process
    let promise = new Promise((resolve, reject) => {

      this._process = cp.spawn(
        this._command,
        this._argv,
        { stdio: ['pipe', 'pipe', process.stderr] }
      );

      this._process.on('error', err => {
        reject(err);
      });

      if (this._process.pid === undefined) {
        reject(new Error(`Failed to spawn process for: ${this._command}`));
      }

      attach(this._process.stdin, this._process.stdout, (err, nvim) => {
        if (err) {
          reject(err);
        }
        this._client = nvim;

        // bind nvim client event listener
        this._client.on('request', this._onRequested(onRequest));
        this._client.on('notification', this._onNotified(onRedraw));
        this._client.on('disconnect', this._onDisconnected);
        // attach nvim client
        this._client.uiAttach(cols, rows, true);
        this.started = true;
        logger.info(`nvim attached: ${this._process.pid} ${rows}x${cols} ${JSON.stringify(this._argv)}.`);

        this._client.command('doautocmd <nomodeline> GUIEnter');

        resolve(nvim);
      });
    });

    return promise;
  }

  get client() {
    return this._client;
  }

  destory() {
    this._client.uiDetach();
    this._client.quit();
    this.started = false;
  }

  _onRequested(onRequest) {
    return (method, args, response) => {
      logger.info('req ' + method);
      if (onRequest) {
        onRequest(method, args, response);
      }
    };
  }

  _onNotified(onRedraw) {
    return (method, args) => {
      if (method === 'redraw') {
        onRedraw(args);
      } else {
        logger.debug('unknown method ' + method);
      }
    }
  }

  _onDisconnected() {
    logger.info(`disconnected: ${this._process.pid}`);
    this.started = false;
  }
}
