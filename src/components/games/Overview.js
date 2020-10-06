import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EuroIcon from "@material-ui/icons/Euro";
import GroupIcon from "@material-ui/icons/Group";
import BarChartIcon from "@material-ui/icons/BarChart";
import TimelineIcon from "@material-ui/icons/Timeline";

import ApiClient from "../../helpers/Api";

const Overview = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  const [tab, setTab] = useState(0);

  useEffect(() => {
    ApiClient.get(`/games/${gameId}`)
      .then(function (response) {
        console.log(response.data);
        setGame(response.data);
        // const status = getStatus(moment.now(), response.data);
        // setInfo(status);
      })
      .catch(function (error) {
        console.error(
          "unable to load game: " + error.response?.statusText ||
            "unexpected error occured"
        );
      });
  }, [gameId]);

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {Boolean(game) && game?.name}
      </Typography>
      <Paper>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, tab) => setTab(tab)}
          aria-label="game-pages"
          variant="fullWidth"
        >
          <Tab label="Prices" icon={<EuroIcon />} index={0} />
          <Tab label="Participants" icon={<GroupIcon />} index={1} />
          <Tab label="Stats" icon={<BarChartIcon />} index={2} />
          <Tab label="Timeline" icon={<TimelineIcon />} index={3} />
        </Tabs>
      </Paper>
    </div>
  );
};

export default Overview;
