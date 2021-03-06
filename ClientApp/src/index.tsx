import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './App';

// Create browser history to use in the Redux store
const baseUrl =
  document.getElementsByTagName('base')[0].getAttribute('href') || undefined;
const history = createBrowserHistory({ basename: baseUrl });

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  rootElement
);
