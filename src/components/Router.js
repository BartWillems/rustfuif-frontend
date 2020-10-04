import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthenticationContext from "../global";
import Home from "./Home";
import Login from "./Login";
import Profile from "./Profile";

function PrivateRoute({ children, ...rest }) {
  const [isLoggedIn] = React.useContext(AuthenticationContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        Boolean(isLoggedIn) ? (
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

const Router = () => {
  const [isLoggedIn] = React.useContext(AuthenticationContext);

  return (
    <Switch>
      <PrivateRoute path="/" exact>
        <Home />
      </PrivateRoute>
      <PrivateRoute path="/profile" exact>
        <Profile />
      </PrivateRoute>
      {!Boolean(isLoggedIn) && (
        <Route path="/login">
          <Login />
        </Route>
      )}

      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default Router;
