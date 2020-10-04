import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import ScheduleIcon from "@material-ui/icons/Schedule";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import Divider from "@material-ui/core/Divider";

import DayJS from "../helpers/DayJS";
import ApiClient from "../helpers/Api";

const InviteTypes = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
};

const useStyles = makeStyles((theme) => ({
  content: {
    flex: "1 0 auto",
  },
  controls: {
    display: "flex",
    alignItems: "space-between",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const InviteGrid = ({ invitations, loading, respond }) => {
  const classes = useStyles();
  return (
    <Grid item>
      <Grid container justify="flex-start" spacing={4}>
        {invitations.map((invitation) => (
          <Grid key={invitation.id} item>
            <Card className={classes.root}>
              <CardContent className={classes.content}>
                <Typography variant="h5" component="h2">
                  {invitation?.game?.name}
                </Typography>
                <List component="nav" aria-label="main mailbox folders">
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={invitation?.game?.owner?.username} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={DayJS().from(invitation?.game?.start_time)}
                    />
                  </ListItem>
                </List>
              </CardContent>
              <Divider variant="middle" />
              <CardActions disableSpacing className={classes.controls}>
                <IconButton
                  aria-label="decline the invite"
                  onClick={() => respond(invitation, InviteTypes.DECLINED)}
                >
                  <ClearIcon />
                </IconButton>
                <IconButton
                  aria-label="accept the invite"
                  onClick={() => respond(invitation, InviteTypes.ACCEPTED)}
                >
                  <DoneIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

InviteGrid.propTypes = {
  invitations: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

const Invites = ({ shouldUpdate, triggerUpdate }) => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [invites, setInvites] = useState({
    [InviteTypes.PENDING]: [],
    [InviteTypes.ACCEPTED]: [],
    [InviteTypes.DECLINED]: [],
  });

  const [loading, setLoading] = useState(false);

  const getInvitations = () => {
    setLoading(true);
    ApiClient.get("/invitations")
      .then(function (response) {
        const invitations = {
          [InviteTypes.PENDING]: [],
          [InviteTypes.ACCEPTED]: [],
          [InviteTypes.DECLINED]: [],
        };

        response.data.forEach(function (invitation) {
          invitations[invitation.state].push(invitation);
        });

        setInvites(invitations);
      })
      .catch(function (error) {
        console.error(`Unable to load invites: ${error.message}`);
      });

    setLoading(false);
  };

  useEffect(getInvitations, [shouldUpdate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerUpdate();
    }, 30_000);

    return () => clearTimeout(timer);
  }, [triggerUpdate]);

  const respond = (invitation, answer) => {
    ApiClient.post(`/invitations/${invitation.id}/${answer}`)
      .then(function () {
        triggerUpdate();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Invites
      </Typography>
      <Paper square>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="invite inbox"
        >
          <Tab label="Pending" index={0} />
          <Tab label="Accepted" index={1} />
          <Tab label="Declined" index={2} />
        </Tabs>
      </Paper>
      {loading && (
        <div
          className={classes.root}
          style={{ position: "relative", margin: "5px" }}
        >
          <CircularProgress style={{ marginLeft: "50%" }} />
        </div>
      )}
      <TabPanel value={tab} index={0}>
        <InviteGrid
          invitations={invites[InviteTypes.PENDING]}
          loading={loading}
          respond={respond}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <InviteGrid
          invitations={invites[InviteTypes.ACCEPTED]}
          loading={loading}
          respond={respond}
        />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <InviteGrid
          invitations={invites[InviteTypes.DECLINED]}
          loading={loading}
          respond={respond}
        />
      </TabPanel>
    </div>
  );
};

export default Invites;
