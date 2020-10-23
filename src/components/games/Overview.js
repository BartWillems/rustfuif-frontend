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
import Alert from "@material-ui/lab/Alert";
import TimelineIcon from "@material-ui/icons/Timeline";
import Countdown from "react-countdown";
import ReconnectingWebSocket from "reconnecting-websocket";

import ApiClient from "../../helpers/Api";
import DayJS from "../../helpers/DayJS";
import BeverageCards from "./beverages";
import Stats from "./stats";

const WebsocketURI =
  process.env.REACT_APP_WS_URL ||
  ((window.location.protocol === "https:" && "wss://") || "ws://") +
    window.location.host +
    "/ws";

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

const renderer = ({ days, hours, minutes, seconds }) => {
  return (
    <span>
      {days > 0 && `${days} ` + (days > 1 ? `days, ` : `day, `)}
      {hours > 0 && `${hours} ` + (hours > 1 ? `hours, ` : `hour, `)}
      {minutes > 0 && `${minutes} ` + (minutes > 1 ? `minutes, ` : `minute, `)}
      {seconds >= 0 && `${seconds} ` + (seconds === 1 ? `second` : `seconds`)}
    </span>
  );
};

const DurationInfo = ({ game }) => {
  if (!game?.start_time) {
    return "";
  }

  const startTime = DayJS(game.start_time);

  if (startTime.isAfter(DayJS())) {
    return (
      <>
        Game starts in:{" "}
        <Countdown date={startTime.toDate()} renderer={renderer} />
      </>
    );
  }

  const closeTime = DayJS(game.close_time);

  if (closeTime.isAfter(DayJS())) {
    return (
      <>
        Game ends in:{" "}
        <Countdown date={closeTime.toDate()} renderer={renderer} />
      </>
    );
  }

  return "Game is finished";
};

const tabs = {
  "#prices": 0,
  "#participants": 1,
  "#stats": 2,
  "#timeline": 3,
};

const Overview = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  const [beverages, setBeverages] = useState([]);
  const [offsets, setSaleOffsets] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(tabs[window.location.hash] || tabs["#prices"]);
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    ApiClient.get(`/games/${gameId}`)
      .then(function (response) {
        console.log(response.data);
        setGame(response.data);
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

  useEffect(getBeverages, [gameId, game]);

  function getBeverages() {
    if (!("id" in game)) {
      return;
    }
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
        setBeverages(beverages);
      })
      .catch(function (error) {
        console.error(error.response?.statusText || "unexpected error occured");
      });
    setLoading(false);
  }

  useEffect(() => {
    if (Object.keys(game).length === 0) return;

    const rws = new ReconnectingWebSocket(`${WebsocketURI}/${gameId}`);

    rws.onmessage = (update) => {
      const { offsets } = JSON.parse(update.data);
      setSaleOffsets(offsets);
    };

    rws.onclose = (msg) => {
      console.log(msg);
      if (!msg.wasClean) {
        console.log("unclean websocket shutdown");
        setConnected(false);
      }
    };

    rws.onerror = () => {
      setConnected(false);
    };

    rws.onopen = () => {
      setConnected(true);
    };

    return () => {
      rws.close(1000);
    };
  }, [gameId, game]);

  return (
    <div>
      <Typography variant="h3">{game.name || <Skeleton />}</Typography>
      <Typography variant="subtitle1" gutterBottom>
        <DurationInfo game={game} />
      </Typography>

      {!isConnected && (
        <Alert severity="warning" style={{ marginBottom: "15px" }}>
          Connection to server lost. Reconnecting...
        </Alert>
      )}

      <Paper>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, tab) => {
            for (const [key, value] of Object.entries(tabs)) {
              if (tab === value) {
                window.location.hash = key;
              }
            }
            setTab(tab);
          }}
          aria-label="game-pages"
          variant="fullWidth"
        >
          <Tab label="Prices" icon={<EuroIcon />} index={tabs["#prices"]} />
          <Tab
            label="Participants"
            icon={<GroupIcon />}
            index={tabs["#participants"]}
          />
          <Tab label="Stats" icon={<BarChartIcon />} index={tabs["#stats"]} />
          <Tab
            label="Timeline"
            icon={<TimelineIcon />}
            index={tabs["#timeline"]}
          />
        </Tabs>
      </Paper>
      <TabPanel value={tab} index={tabs["#prices"]}>
        <BeverageCards
          beverages={beverages}
          loading={loading}
          offsets={offsets}
          gameId={gameId}
          getBeverages={getBeverages}
        />
      </TabPanel>
      <TabPanel value={tab} index={tabs["#participants"]}>
        <p>participants</p>
      </TabPanel>
      <TabPanel value={tab} index={tabs["#stats"]}>
        <Stats gameId={gameId} beverages={beverages} shouldUpdate={offsets} />
      </TabPanel>
      <TabPanel value={tab} index={tabs["#timeline"]}>
        <p>timeline</p>
      </TabPanel>
    </div>
  );
};

export default Overview;
