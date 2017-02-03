import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { browserHistory, Router } from 'react-router';
import { makeMainRoutes } from './routes';

const routes = makeMainRoutes();

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('root')
);
