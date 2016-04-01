import React from 'react'
import ReactDOM from 'react-dom'
import Neovim from './neovim'


ReactDOM.render(
  <Neovim argv={[]} fontFamily="Letter Gothic for Powerline" fontSize="12" width={window.innerWidth} height={window.innerHeight} />,
  document.getElementById('Neovim')
);

import './main.css'
