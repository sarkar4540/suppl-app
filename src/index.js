import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { getRDService } from './components/cash';
window.rDService = getRDService();

if (!window.AndroidRDService && document.location.protocol !== 'https:' && document.location.hostname !== 'localhost') document.location.assign("https://" + document.location.hostname);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
