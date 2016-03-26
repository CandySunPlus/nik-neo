import React from 'react'
import ReactDOM from 'react-dom'
import Neovim from './neovim'


ReactDOM.render(
  <Neovim argv={[]} width={800} height={600} />,
  document.getElementById('Neovim')
);
