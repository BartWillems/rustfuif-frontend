import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import AuthenticationContext from "../global";
import ApiClient from "../helpers/Api";

const Profile = () => {
  const [user] = React.useContext(AuthenticationContext);
  const [games, setGames] = useState([]);
  const history = useHistory();

  useEffect(() => {
    ApiClient.get(`/games`)
      .then(function (res) {
        setGames(res.data);
      })
      .catch(function () {
        setGames([]);
      });
  }, [setGames]);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {user.username}
      </Typography>
      <Divider variant="middle" />
      <Typography variant="h3" gutterBottom>
        My Games
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((row) => (
              <TableRow
                key={row.name}
                onClick={() => history.push(`/games/${row.id}`)}
                style={{ cursor: "pointer" }}
                hover
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.owner?.username}</TableCell>
                <TableCell>{row.start_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Profile;
