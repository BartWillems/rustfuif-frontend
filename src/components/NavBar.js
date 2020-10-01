import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import AuthenticationContext from "../global";
import ApiClient from "../helpers/Api";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const [, setLoggedIn] = React.useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);

  function logout() {
    setLoading(true);
    ApiClient.post("/logout")
      .then(function () {
        console.log("Succesfully logged out!");
        setLoggedIn(false);
      })
      .catch(function (error) {
        console.log(`unable to logout...: ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Beursfuif
        </Typography>
        <Button color="inherit" onClick={logout} disabled={loading}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
