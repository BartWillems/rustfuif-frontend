import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CheckIcon from "@material-ui/icons/Check";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import BlockIcon from "@material-ui/icons/Block";
import BugReportIcon from "@material-ui/icons/BugReport";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import ApiClient from "../../helpers/Api";
import { InviteTypes } from "../Invites";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(-8),
    right: theme.spacing(0),
  },
}));

const InviteResponse = ({ state }) => {
  switch (state) {
    case InviteTypes.ACCEPTED:
      return <CheckIcon />;
    case InviteTypes.DECLINED:
      return <BlockIcon />;
    case InviteTypes.PENDING:
      return <HourglassEmptyIcon />;
    default:
      console.error("invalid invite state: ", state);
      return <BugReportIcon />;
  }
};

const loadParticipants = (gameId, setParticipants) => {
  ApiClient.get(`/games/${gameId}/users`)
    .then(function (response) {
      setParticipants(response.data);
    })
    .catch(function (error) {
      console.error(`unable to load participants: ${error}`);
    });
};

export default function Participants({ gameId }) {
  const classes = useStyles();
  const [participants, setParticipants] = useState([]);
  const [inviteMenu, showInviteMenu] = useState(false);

  useEffect(() => {
    loadParticipants(gameId, setParticipants);
  }, [gameId]);

  const refreshParticipants = useCallback(() => {
    loadParticipants(gameId, setParticipants);
  }, [gameId]);

  return (
    <div style={{ position: "relative" }}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((invite) => (
              <TableRow key={invite.userId}>
                <TableCell component="th" scope="row">
                  {invite.username}
                </TableCell>
                <TableCell align="right">
                  <InviteResponse state={invite.invitationState} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        size="small"
        color="primary"
        aria-label="add"
        variant="extended"
        className={classes.fab}
        onClick={() => showInviteMenu(true)}
      >
        &nbsp;Invite User
        <AddIcon />
      </Fab>
      <InviteUser
        gameId={gameId}
        open={inviteMenu}
        handleClose={showInviteMenu}
        refreshParticipants={refreshParticipants}
      />
    </div>
  );
}

const InviteUser = ({ gameId, open, handleClose, refreshParticipants }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    ApiClient.get(`/games/${gameId}/available-users`)
      .then(function (response) {
        setUsers(response.data);
      })
      .catch(function (error) {
        console.error(`unable to load available users: ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gameId]);

  function invite() {
    setSubmitting(true);
    ApiClient.post(`/games/${gameId}/invitations`, { userId: selectedUser.id })
      .then(function (response) {
        console.log(response);
        handleClose(false);
        refreshParticipants();
      })
      .catch(function (error) {
        console.error("unable to invite user: ", error);
      })
      .finally(function () {
        setSubmitting(false);
      });
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle>Invite user</DialogTitle>
        <DialogContent style={{ minWidth: "500px" }}>
          <Autocomplete
            id="user-invite-dropdown"
            options={users}
            getOptionLabel={(option) => option.username}
            disabled={loading}
            renderInput={(params) => <TextField {...params} label="Users" />}
            onChange={(event, user) => {
              setSelectedUser(user);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            color="primary"
            disabled={isSubmitting || !Boolean(selectedUser)}
            onClick={() => invite()}
          >
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
