import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Game from './pages/games/gameDetails';
import Login from './pages/login';
import Register from './pages/register';
import { isLoggedIn } from './helpers/Session';

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const Router = () => {
  return (
    <Switch>
      <PrivateRoute path="/" exact>
        <Home />
      </PrivateRoute>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <PrivateRoute path="/games/:gameId">
        <Game />
      </PrivateRoute>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default Router;
