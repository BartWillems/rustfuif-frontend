import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
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
import { Game } from "./models";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(-8),
    right: theme.spacing(0),
  },
}));

type Props = {
  shouldUpdate?: number,
  showCompleted?: boolean,
  showAddButton?: boolean,
}

const GameList = ({ shouldUpdate, showCompleted, showAddButton }: Props) => {
  const classes = useStyles();
  const [games, setGames] = useState<Game[]>([]);
  const history = useHistory();

  async function loadGames(showCompleted?: Boolean) {
    await ApiClient.get(`/games?completed=${Boolean(showCompleted)}`)
      .then(function (response) {
        let games: Object[] = response.data;
        setGames(games.map((game) => new Game(game)));
      })
      .catch(function (error) {
        throw new Error(
          error.response?.statusText || "unexpected error occured"
        );
      });
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
            {games.map((game) => (
              <TableRow
                key={game.id}
                hover
                onClick={() => history.push(`/games/${game.id}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {game.name}
                </TableCell>
                <TableCell align="right">{game.owner.username}</TableCell>
                <TableCell align="right">
                  {DayJS(game.startTime).format("YYYY/MM/DD HH:mm")}
                </TableCell>
                <TableCell align="right">
                  {DayJS(game.closeTime).format("YYYY/MM/DD HH:mm")}
                </TableCell>
                <TableCell align="right">{game.duration()}</TableCell>
                <TableCell align="right">{game.status()}</TableCell>
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
            onClick={() => history.push("/games/create")}
          >
            &nbsp;Add Game
            <AddIcon />
          </Fab>
        )}
      </TableContainer>
    </div>
  );
};

export default GameList;
