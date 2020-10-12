import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import EuroIcon from "@material-ui/icons/Euro";
import GroupIcon from "@material-ui/icons/Group";
import BarChartIcon from "@material-ui/icons/BarChart";
import TimelineIcon from "@material-ui/icons/Timeline";

import ApiClient from "../../helpers/Api";
import BeverageCards from "./Beverages";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && <Box padding="10px 0">{children}</Box>}
    </div>
  );
}

const Overview = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  const [beverages, setBeverages] = useState([]);
  const [offsets, setSaleOffsets] = useState({});
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    ApiClient.get(`/games/${gameId}/stats/offsets`)
      .then(function (response) {
        setSaleOffsets(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [gameId]);

  function getBeverages() {
    setBeverages(new Array(game?.beverage_count).fill({}));
    setLoading(true);
    ApiClient.get(`/games/${gameId}/beverages`)
      .then(function (response) {
        let beverages = response.data;
        for (let i = 0; i < game.beverage_count; i++) {
          if (!beverages[i]) {
            beverages[i] = {};
          }
        }
        console.log(beverages);
        setBeverages(beverages);
      })
      .catch(function (error) {
        console.error(error.response?.statusText || "unexpected error occured");
      });
    setLoading(false);
  }

  useEffect(getBeverages, [game]);

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {game.name || <Skeleton />}
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
      <TabPanel value={tab} index={0}>
        <BeverageCards
          beverages={beverages}
          loading={loading}
          offsets={offsets}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <p>dink</p>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <p>dink</p>
      </TabPanel>
    </div>
  );
};

export default Overview;
