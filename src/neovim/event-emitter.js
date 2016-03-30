import EventEmitter from 'events';
import logger from '../log'
import NeoVim  from './neovim'
import { UIEventType } from './events'

export default class NeovimEventEmitter extends EventEmitter {
  constructor() {
    super();
    this._neovim = new NeoVim(this);
    this._dispatchEvent();
  }

  _dispatchEvent() {
    this.on('redraw', (evt) => this._neovimMsgHandler(evt));
    this.on('ui', (evt) => this._uiEventHandler(evt));
  }

  _neovimMsgHandler(evt) {
    switch (evt.type) {
      case 'nv_update_bg':
        this._neovim.updateBg.apply(this._neovim, evt.args);
        break;
      case 'nv_update_fg':
        this._neovim.updateFg.apply(this._neovim, evt.args);
        break;
      case 'nv_clear':
        this._neovim.clear.apply(this._neovim, evt.args);
        break;
      case 'nv_highlight_set':
        this._neovim.setHighlight.apply(this._neovim, evt.args);
        break;
      case 'nv_cursor_goto':
        this._neovim.setCursorPosition.apply(this._neovim, evt.args);
        break;
      case 'nv_put':
        this._neovim.putChars.apply(this._neovim, evt.args);
        break;
      case 'nv_resize':
        this._neovim.resize.apply(this._neovim, evt.args);
        break;
      default:
        logger.error(`can't find neovim message event handler for event: ${evt.type}`);
        break;
    }
  }

  _uiEventHandler(evt) {
    switch(evt.type) {
      case UIEventType.ATTACH_SCREEN:
        this._neovim.attachScreen.apply(this._neovim, evt.args);
        break;
      default:
        logger.error(`can't find UI event handler for event: ${evt.type}`);
        break;
    }
  }
}

