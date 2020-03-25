import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Games from './Game';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/games',
    component: Games,
    routes: [
      { path: '/games/my-games', component: Games },
      { path: '/games/1', component: Games },
    ],
  },
];

class Router extends React.Component {
  render() {
    return (
      <Switch>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} exact={route.exact} children={route.component} />
        ))}
      </Switch>
    );
  }
}

export default Router;
