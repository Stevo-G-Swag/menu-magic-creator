import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initLogger } from './utils/logger';

initLogger();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);