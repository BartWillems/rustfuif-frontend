import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import AuthenticationContext from "../global";
import GameList from "./games/GameList";

const Profile = () => {
  const [user] = React.useContext(AuthenticationContext);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {user.username}
      </Typography>
      <Divider variant="middle" />
      <GameList showCompleted={true} />
    </>
  );
};

export default Profile;
