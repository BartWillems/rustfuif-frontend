import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AssessmentIcon from "@material-ui/icons/Assessment";
import PersonIcon from "@material-ui/icons/Person";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import AuthenticationContext from "../../global";
import ApiClient from "../../helpers/Api";
import { Routes } from "../Router";

const UserMenu = () => {
  const [user, setUser] = React.useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  function logout() {
    setLoading(true);
    ApiClient.post("/logout")
      .then(function () {
        setUser(null);
      })
      .catch(function (error) {
        console.log(`unable to logout...: ${error}`);
        setLoading(false);
      });
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        color="inherit"
        disabled={loading}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {user.username}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          component={Link}
          to={Routes.Profile}
          color="inherit"
          onClick={handleClose}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My account" />
        </MenuItem>
        {user.is_admin && (
          <MenuItem
            component={Link}
            to={Routes.AdminPanel}
            color="inherit"
            onClick={handleClose}
          >
            <ListItemIcon>
              <AssessmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Admin Panel" />
          </MenuItem>
        )}
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
