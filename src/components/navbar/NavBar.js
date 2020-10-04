import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

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
      <Container style={{ padding: "0" }}>
        <Toolbar>
          <Typography
            onClick={() => history.push("/")}
            variant="h6"
            style={{ cursor: "pointer" }}
          >
            Beursfuif
          </Typography>
          {/* Span is used as a spacer */}
          <span className={classes.title} />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
