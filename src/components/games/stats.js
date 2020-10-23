import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import ApiClient from "../../helpers/Api";

async function getStats(gameId, query) {
  return ApiClient.get(`/games/${gameId}/stats/${query}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      let msg = error.response?.statusText || "unexpected error occured";
      console.error(`unable to fetch stats: ${msg}`);
    });
}

export const SalesChart = ({ gameId, shouldUpdate, beverages }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getStats(gameId, "sales").then((sales) => {
      for (let i = 0; i < sales?.length; i++) {
        sales[i].name = beverages[i]?.name || "unconfigured";
      }
      setSales(sales);
    });
  }, [gameId, shouldUpdate, beverages]);

  return (
    <ResponsiveContainer>
      <BarChart data={sales} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const UserSalesChart = ({ gameId, shouldUpdate }) => {
  const [sales, setSales] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    getStats(gameId, "users").then((sales) => {
      setSales(sales);
    });
  }, [gameId, shouldUpdate]);

  return (
    <ResponsiveContainer>
      <BarChart data={sales} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="username" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill={theme.palette.success.light} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 400,
  },
}));

const Stats = ({ gameId, shouldUpdate, beverages }) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Paper className={fixedHeightPaper}>
            <Typography style={{ textAlign: "center" }}>
              Beverage Sales
            </Typography>
            <SalesChart
              gameId={gameId}
              shouldUpdate={shouldUpdate}
              beverages={beverages}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} zeroMinWidth>
          <Paper className={fixedHeightPaper}>
            <Typography style={{ textAlign: "center" }}>User Sales</Typography>
            <UserSalesChart gameId={gameId} shouldUpdate={shouldUpdate} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

Stats.propTypes = {
  shouldUpdate: PropTypes.any,
  gameId: PropTypes.any.isRequired,
  beverages: PropTypes.array.isRequired,
};

export default Stats;
