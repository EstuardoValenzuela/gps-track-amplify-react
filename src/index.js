import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import 'mapbox-gl/dist/mapbox-gl.css';

ReactDOM.render(
  <BrowserRouter basename="/gps-tracker">
    <App />
  </BrowserRouter>
, document.getElementById('root'));

serviceWorker.unregister();