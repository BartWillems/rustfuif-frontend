import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Gamelist from './pages/games/game-list';
import Game from './pages/games/game';
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
    exact: true,
    // routes: [{ path: '/games/:gameId', component: Game }],
  },
  {
    path: '/games/:gameId',
    component: Game,
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
