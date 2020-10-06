import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import HomeIcon from "@material-ui/icons/Home";

import UserMenu from "./UserMenu";

const useStyles = makeStyles((theme) => ({
  spacer: {
    flexGrow: 1,
  },
  homeIcon: {
    marginRight: theme.spacing(1),
    float: "left",
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar position="static">
      <Container style={{ padding: "0" }}>
        <Toolbar>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => history.push("/")}
          >
            <HomeIcon className={classes.homeIcon} />
            <Typography variant="h6" style={{ float: "left" }}>
              Beursfuif
            </Typography>
          </div>
          <span className={classes.spacer} />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
