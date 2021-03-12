import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Alert from "@material-ui/lab/Alert";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ReconnectingWebSocket from "reconnecting-websocket";

import ApiClient from "../helpers/Api";
import WebsocketURI from "../helpers/Websocket";

const useStyles = makeStyles((theme) => ({
  infoGraphic: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  controls: {
    display: "flex",
    justifyContent: "space-around",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  controlButton: {
    cursor: "pointer",
    margin: "10px",
    color: theme.palette.info.main,
  },
}));

const NumberStat = ({ title, data }) => {
  const classes = useStyles();
  return (
    <Card>
      <CardContent className={classes.infoGraphic}>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h2">{data}</Typography>
      </CardContent>
    </Card>
  );
};

const Game = ({ id }) => {
  const [game, setGame] = useState({});
  useEffect(() => {
    ApiClient.get(`/games/${id}`)
      .then((resp) => {
        setGame(resp.data);
      })
      .catch((error) => {
        console.error("unable to fetch games count", error);
      });
  }, [id]);
  return game?.name || "";
};

const Cache = ({ stats }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({});

  const statusText = () => {
    if (loading) {
      return "Loading...";
    }
    if (!status.enabled) {
      return "Disabled";
    }
    if (!status.healthy) {
      return "Unhealthy";
    }

    return "Healthy";
  };

  const hitRatio = () => {
    if (Object.keys(stats).length === 0) return "...";

    if (stats.cache_misses === 0) {
      return "100";
    }

    return (
      (stats.cache_hits / (stats.cache_hits + stats.cache_misses)) *
      100
    ).toFixed(2);
  };

  // either enable or disable the cache
  const setCache = (status) => {
    setLoading(true);
    ApiClient.post(`/admin/server/cache/${status}`)
      .then((resp) => {
        setStatus(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(`unable to ${status} cache`, error);
      });
  };

  useEffect(() => {
    ApiClient.get("/admin/server/cache")
      .then((resp) => {
        setStatus(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("unable to fetch cache status", error);
      });
  }, []);

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Card>
        <CardContent className={classes.infoGraphic}>
          <Typography color="textSecondary">Cache</Typography>
          <Typography variant="h2">{statusText()}</Typography>
          <Tooltip title={`Cache hits: ${stats.cache_hits}`}>
            <Typography color="textSecondary">
              Hit Ratio {hitRatio()}%
            </Typography>
          </Tooltip>
        </CardContent>
        <Divider />
        {!loading && (
          <CardActions className={classes.controls}>
            {status.enabled ? (
              <>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => setCache("disable")}
                >
                  Disable Cache
                </Button>
              </>
            ) : (
              <Button
                size="small"
                color="primary"
                onClick={() => setCache("enable")}
              >
                Enable Cache
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

const ServerStatus = ({ stats }) => {
  return (
    <>
      <Typography color="textSecondary" gutterBottom>
        Server Status
      </Typography>

      <Grid container spacing={2}>
        <Cache stats={stats} />
      </Grid>
    </>
  );
};

const AdminPanel = () => {
  const classes = useStyles();
  const [isConnected, setConnected] = useState(true);
  const [users, setusers] = useState(0);
  const [games, setGames] = useState(0);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [activeGames, setActiveGames] = useState([]);
  const [serverStats, setServerStats] = useState({});

  useEffect(() => {
    ApiClient.get("/admin/games/count")
      .then((resp) => {
        setGames(resp.data);
      })
      .catch((error) => {
        console.error("unable to fetch games count", error);
      });
  }, []);

  useEffect(() => {
    ApiClient.get("/admin/users/count")
      .then((resp) => {
        setusers(resp.data);
      })
      .catch((error) => {
        console.error("unable to fetch registered users count", error);
      });
  }, []);

  useEffect(() => {
    ApiClient.get("/admin/websockets/connected-users")
      .then((resp) => {
        setConnectedUsers(resp.data);
      })
      .catch((error) => {
        console.error("unable to fetch registered users count", error);
      });
  }, []);

  useEffect(() => {
    ApiClient.get("/admin/websockets/active-games")
      .then((resp) => {
        setActiveGames(resp.data);
      })
      .catch((error) => {
        console.error("unable to fetch registered users count", error);
      });
  }, []);

  useEffect(() => {
    ApiClient.get("/admin/server/stats")
      .then((resp) => {
        setServerStats(resp.data);
      })
      .catch((error) => {
        console.error("unable to fetch server stats", error);
      });
  }, []);

  useEffect(() => {
    const rws = new ReconnectingWebSocket(`${WebsocketURI}/admin`);

    rws.onmessage = (update) => {
      console.log(update.data);
      const message = JSON.parse(update.data);

      if (message.ConnectedUsers) {
        setConnectedUsers(message.ConnectedUsers);
      }

      if (message.ActiveGames) {
        setActiveGames(message.ActiveGames);
      }

      // TODO: keep track of price updates & stock market crashes etc
      // if (message.PriceUpdate) {
      //   ...
      // }
    };

    rws.onclose = (msg) => {
      if (!msg.wasClean) {
        console.error("unclean websocket shutdown", msg);
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
  }, []);

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Admin Panel
      </Typography>
      {!isConnected && (
        <Alert severity="warning" style={{ marginBottom: "15px" }}>
          Connection to server lost. Reconnecting...
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} lg={4}>
          <NumberStat title="Total Games" data={games} />
        </Grid>
        <Grid item xs={6} md={4} lg={4}>
          <NumberStat title="Registered Users" data={users} />
        </Grid>
        <Grid item xs={6} md={4} lg={4}>
          <NumberStat title="Connected Users" data={connectedUsers.length} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Typography color="textSecondary" gutterBottom>
            Connected Users
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Username</TableCell>
                  <TableCell align="right">ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {connectedUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" component="th" scope="row">
                      {user.username}
                    </TableCell>
                    <TableCell align="right">{user.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Typography color="textSecondary" gutterBottom>
            Active Games
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Game</TableCell>
                  <TableCell align="right">Connected Users</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeGames.map((game) => (
                  <TableRow key={game.gameId}>
                    <TableCell align="left" component="th" scope="row">
                      <Game id={game.gameId} />
                    </TableCell>
                    <TableCell align="right">{game.sessionCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <br />
      <ServerStatus stats={serverStats} />
    </div>
  );
};

export default AdminPanel;
