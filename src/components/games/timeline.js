import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import ApiClient from "../../helpers/Api";
import { toEuro } from "./beverages";
import DayJS from "../../helpers/DayJS";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function PurchaseTimeline({ gameId, shouldUpdate, beverages }) {
  const classes = useStyles();
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    ApiClient.get(`/games/${gameId}/sales`)
      .then(function (response) {
        setSales(response.data);
        let total = 0;
        response.data.forEach((transaction) => {
          total += transaction.price * transaction.amount;
        });
        setTotal(total);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [gameId, shouldUpdate]);

  return (
    <>
      <Typography variant="h2" component="h2" align="center">
        Total: €{toEuro(total)}
      </Typography>
      <Timeline align="alternate">
        {sales.map((sale, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent>
              <Typography variant="body2" color="textSecondary">
                {DayJS(sale.createdAt).format("HH:mm:ss")}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <FastfoodIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  {`${sale.amount}x ${beverages[sale.slotNo]?.name} (€${toEuro(
                    sale.price
                  )})`}
                </Typography>
                <Typography>€{toEuro(sale.amount * sale.price)}</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}
