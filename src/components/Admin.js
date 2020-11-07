import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import ApiClient from "../helpers/Api";

const useStyles = makeStyles((theme) => ({
  infoGraphic: {
    padding: theme.spacing(2),
    textAlign: "center",
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

const AdminPanel = () => {
  const classes = useStyles();
  const [users, setusers] = useState(0);
  const [games, setGames] = useState(0);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [activeGames, setActiveGames] = useState([]);

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

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Admin Panel
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <NumberStat title="Total Games" data={games} />
        </Grid>
        <Grid item xs={4}>
          <NumberStat title="Registered Users" data={users} />
        </Grid>
        <Grid item xs={4}>
          <NumberStat title="Connected Users" data={connectedUsers.length} />
        </Grid>
        <Grid item xs={6}>
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
                {connectedUsers.map((user) => (
                  <TableRow key={user.id}>
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
        <Grid item xs={6}>
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
                  <TableRow key={game.game_id}>
                    <TableCell align="left" component="th" scope="row">
                      <Game id={game.game_id} />
                    </TableCell>
                    <TableCell align="right">{game.session_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminPanel;
