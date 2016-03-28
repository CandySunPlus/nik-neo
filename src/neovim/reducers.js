import logger from '../log'
import NeoVim  from './neovim'
import { UIActions } from './actions'

export default function makeReducer() {
  const neovim = new NeoVim();
  return {
    uiReducer: makeUIReducer(neovim),
    neovimMsgReducer: makeNeovimMsgReducer(neovim)
  };
}

function makeNeovimMsgReducer(neovim) {
  return (state=neovim, action) => {
    switch (action.type) {
      case 'nv_update_bg':
        return neovim.updateBg.apply(neovim, action.args);
      case 'nv_update_fg':
        return neovim.updateFg.apply(neovim, action.args);
      case 'nv_clear':
        return neovim.clear.apply(neovim, action.args);
      case 'nv_highlight_set':
        return neovim.setHighlight.apply(neovim, action.args);
      case 'nv_cursor_goto':
        return neovim.setCursorPosition.apply(neovim, action.args);
      case 'nv_put':
        return neovim.putChars.apply(neovim, action.args);
      default:
        return state;
    }
  }
}

function makeUIReducer(neovim) {
  return (state=neovim, action) => {
    switch (action.type) {
      case UIActions.ATTACH_SCREEN:
        return neovim.attachScreen.apply(neovim, action.args);
      default:
        return state;
    }
  }
}
