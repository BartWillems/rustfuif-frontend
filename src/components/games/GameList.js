import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import ApiClient from "../../helpers/Api";
import DayJS from "../../helpers/DayJS";
import { Routes } from "../Router";

export function getStatus(now, game) {
  if (now > DayJS(game.close_time)) {
    return "Finished";
  }

  if (now > DayJS(game.start_time)) {
    return `Ends in ${DayJS(game.close_time).fromNow()}`;
  }

  return `Starts in ${DayJS(game.start_time).fromNow()}`;
}

function getDuration(game) {
  const diff = DayJS(game.close_time).diff(DayJS(game.start_time));

  return DayJS.duration(diff).humanize();
}

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(-8),
    right: theme.spacing(0),
  },
}));

const GameList = ({ shouldUpdate, showCompleted, showAddButton }) => {
  const classes = useStyles();
  const [games, setGames] = useState([]);
  const history = useHistory();

  async function loadGames(showCompleted) {
    let games = [];

    await ApiClient.get(`/games?completed=${Boolean(showCompleted)}`)
      .then(function (response) {
        games = response.data;
      })
      .catch(function (error) {
        throw new Error(
          error.response?.statusText || "unexpected error occured"
        );
      });

    const now = DayJS();

    const gamesMapped = games.map((game) => ({
      duration: getDuration(game),
      status: getStatus(now, game),
      ...game,
    }));

    setGames(gamesMapped);
  }

  useEffect(() => {
    loadGames(showCompleted).catch(function (error) {
      console.error(`Unable to load games: ${error.message}`);
    });
  }, [shouldUpdate, showCompleted]);

  return (
    <div style={{ position: "relative" }}>
      <Typography variant="h2" gutterBottom>
        Games
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Owner</TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">Close Time</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => history.push(Routes.GameOverview(row.id))}
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.owner?.username}</TableCell>
                <TableCell align="right">
                  {DayJS(row.start_time).format("YYYY/MM/DD HH:mm")}
                </TableCell>
                <TableCell align="right">
                  {DayJS(row.close_time).format("YYYY/MM/DD HH:mm")}
                </TableCell>
                <TableCell align="right">{row.duration}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton && (
          <Fab
            size="small"
            color="primary"
            aria-label="add"
            variant="extended"
            className={classes.fab}
            onClick={() => history.push(Routes.CreateGame)}
          >
            &nbsp;Add Game
            <AddIcon />
          </Fab>
        )}
      </TableContainer>
    </div>
  );
};

GameList.propTypes = {
  shouldUpdate: PropTypes.any,
  showCompleted: PropTypes.bool,
  showAddButton: PropTypes.bool,
};

export default GameList;
