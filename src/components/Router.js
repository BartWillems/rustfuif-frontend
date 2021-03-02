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

export const Routes = {
  Home: "/",
  Login: "/login",
  Register: "/register",
  Profile: "/profile",
  CreateGame: "/games/create",
  GameOverview: (id) => {
    id = id || ":gameId";
    return `/games/${id}`;
  },
  AdminPanel: "/admin-panel",
};

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
              pathname: Routes.Login,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const isAdmin = (user) => {
  return user?.isAdmin;
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
      <PrivateRoute path={Routes.Home} exact>
        <Home />
      </PrivateRoute>
      <PrivateRoute path={Routes.Profile} exact>
        <Profile />
      </PrivateRoute>
      <PrivateRoute path={Routes.CreateGame} exact>
        <CreateGame />
      </PrivateRoute>
      <PrivateRoute path={Routes.GameOverview()} exact>
        <Overview />
      </PrivateRoute>

      <AdminRoute path={Routes.AdminPanel} exact>
        <Admin />
      </AdminRoute>

      {!Boolean(user) && (
        <>
          <Route path={Routes.Login}>
            <Login />
          </Route>

          <Route path={Routes.Register}>
            <Register />
          </Route>
        </>
      )}

      <Route path="*">
        <Redirect to={Routes.Home} />
      </Route>
    </Switch>
  );
};

export default Router;
