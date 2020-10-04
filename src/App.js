import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

import AuthenticationContext from "./global";
import Router from "./components/Router";
import ApiClient from "./helpers/Api";
import NavBar from "./components/navbar/NavBar";

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
  const [user, setUser] = React.useContext(AuthenticationContext);

  useEffect(() => {
    ApiClient.get(`/users/me`)
      .then(function (res) {
        setUser(res.data);
      })
      .catch(function () {
        setUser(null);
      })
      .finally(function () {
        setLoading(false);
      });
  }, [setUser]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {(loading && (
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )) || (
        <>
          {(user && (
            <>
              <NavBar />
              <Container style={{ padding: "20px 10px" }}>
                <Router />
              </Container>
            </>
          )) || <Router />}
        </>
      )}
    </div>
  );
}

export default App;
