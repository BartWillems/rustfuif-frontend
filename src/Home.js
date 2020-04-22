import React, { useState } from 'react';
import { Divider } from 'antd';

import Invitations from './pages/invitations';
import Gamelist from './pages/games/gameList';

const Home = () => {
  const [state, setUpdate] = useState(0);

  function triggerUpdate() {
    setUpdate(state + 1);
  }

  return (
    <>
      <Invitations shouldUpdate={state} triggerUpdate={triggerUpdate} />
      <Divider />
      <Gamelist shouldUpdate={state} />
    </>
  );
};

export default Home;
