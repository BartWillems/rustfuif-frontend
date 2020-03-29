import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Gamelist from './Game';
import Login from './pages/login';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/games',
    component: Gamelist,
    routes: [{ path: '/games/1', component: Gamelist }],
  },
  {
    path: '/login',
    component: Login,
  },
];

class Router extends React.Component {
  render() {
    return (
      <Switch>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} exact={route.exact} component={route.component} />
        ))}
      </Switch>
    );
  }
}

export default Router;
