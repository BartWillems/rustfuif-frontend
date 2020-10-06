import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import ApiClient from "../../helpers/Api";

const Overview = () => {
  const { gameId } = useParams();

  const [game, setGame] = useState({});

  useEffect(() => {
    ApiClient.get(`/games/${gameId}`)
      .then(function (response) {
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

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {Boolean(game) && game?.name}
      </Typography>
    </div>
  );
};

export default Overview;
