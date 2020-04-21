import React from 'react';
import { Divider } from 'antd';

import Invitations from './pages/invitations';
import Gamelist from './pages/games/gameList';

const Home = () => {
  return (
    <>
      <Invitations />
      <Divider />
      <Gamelist />
    </>
  );
};

export default Home;
