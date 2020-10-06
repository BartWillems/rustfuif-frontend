import React, { useState } from "react";
import Divider from "@material-ui/core/Divider";

import Invites from "./Invites";
import GameList from "./games/GameList";

const Home = () => {
  const [state, setUpdate] = useState(0);

  function triggerUpdate() {
    setUpdate(state + 1);
  }
  return (
    <div>
      <Invites shouldUpdate={state} triggerUpdate={triggerUpdate} />
      <Divider variant="middle" style={{ margin: "20px 0" }} />
      <GameList shouldUpdate={state} showAddButton />
    </div>
  );
};

export default Home;
