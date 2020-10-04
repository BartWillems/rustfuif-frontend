import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import AuthenticationContext from "../../global";
import ApiClient from "../../helpers/Api";

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
          to={"/profile"}
          color="inherit"
          onClick={handleClose}
        >
          My account
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
