import React, { useState } from "react";
import Invites from "./Invites";

const Home = () => {
  const [state, setUpdate] = useState(0);

  function triggerUpdate() {
    setUpdate(state + 1);
  }
  return (
    <div>
      <Invites shouldUpdate={state} triggerUpdate={triggerUpdate} />
    </div>
  );
};

export default Home;
