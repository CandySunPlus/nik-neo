import React from 'react'
import ReactDOM from 'react-dom'
import Neovim from './neovim'


ReactDOM.render(
  <Neovim argv={[]} width={window.innerWidth} height={window.innerHeight} />,
  document.getElementById('Neovim')
);

import './main.css'
