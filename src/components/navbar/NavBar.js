import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import UserMenu from "./UserMenu";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          onClick={() => history.push("/")}
          variant="h6"
          className={classes.title}
          style={{ cursor: "pointer" }}
        >
          Beursfuif
        </Typography>
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
