import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthenticationContext from "../global";
import Home from "./Home";
import Login from "./Login";
import Profile from "./profile";
import CreateGame from "./games/CreateGame";
import Overview from "./games/Overview";
import Admin from "./Admin";
import Register from "./Register";

function PrivateRoute({ children, ...rest }) {
  const [user] = React.useContext(AuthenticationContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        Boolean(user) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const isAdmin = (user) => {
  return user?.is_admin;
};

function AdminRoute({ children, ...rest }) {
  const [user] = React.useContext(AuthenticationContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAdmin(user) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const Router = () => {
  const [user] = React.useContext(AuthenticationContext);

  return (
    <Switch>
      <PrivateRoute path="/" exact>
        <Home />
      </PrivateRoute>
      <PrivateRoute path="/profile" exact>
        <Profile />
      </PrivateRoute>
      <PrivateRoute path="/games/create" exact>
        <CreateGame />
      </PrivateRoute>
      <PrivateRoute path="/games/:gameId" exact>
        <Overview />
      </PrivateRoute>

      <AdminRoute path="/admin-panel" exact>
        <Admin />
      </AdminRoute>

      {!Boolean(user) && (
        <>
          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>
        </>
      )}

      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default Router;
