import React from "react";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

import AuthenticationContext from "../../global";
import GameList from "../games/GameList";
import ChangePassword from "./changePassword";

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

const tabs = {
  "#profile": 0,
  "#my-games": 1,
};

const Profile = () => {
  const [user] = React.useContext(AuthenticationContext);
  const [tab, setTab] = React.useState(
    tabs[window.location.hash] || tabs["#profile"]
  );

  return (
    <>
      <Typography component="h2" variant="h2" gutterBottom>
        {user.username}
      </Typography>
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
          <Tab label="Profile" index={tabs["#profile"]} />
          <Tab label="My Games" index={tabs["#my-games"]} />
        </Tabs>
      </Paper>
      <TabPanel value={tab} index={tabs["#profile"]}>
        <ChangePassword />
      </TabPanel>
      <TabPanel value={tab} index={tabs["#my-games"]}>
        <GameList showCompleted={true} />
      </TabPanel>
    </>
  );
};

export default Profile;
