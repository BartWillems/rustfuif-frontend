import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import AuthenticationContext from "./global";
import Router from "./components/Router";
import ApiClient from "./helpers/Api";
import NavBar from "./components/NavBar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function App() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = React.useContext(AuthenticationContext);

  useEffect(() => {
    ApiClient.get(`/verify-session`)
      .then(function () {
        setLoggedIn(true);
      })
      .catch(function () {
        setLoggedIn(false);
      })
      .finally(function () {
        console.log("OK");
        setLoading(false);
      });
  }, [setLoggedIn]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {(loading && (
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )) || (
        <>
          {isLoggedIn && <NavBar />}
          <Router />
        </>
      )}
    </div>
  );
}

export default App;
