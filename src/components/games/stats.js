import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import ApiClient from "../../helpers/Api";
import { toEuro } from "./beverages";
import dayjs from "dayjs";

// 16 material olors as that is the maximum amount of beverages
// Consists of 4 complimenting groups
const colors = [
  //
  "#673ab7",
  "#009688",
  "#ffc107",
  "#607d8b",
  //
  "#e91e63",
  "#2196f3",
  "#8bc34a",
  "#ff5722",
  //
  "#9c27b0",
  "#00bcd4",
  "#ffeb3b",
  "#9e9e9e",
  //
  "#f44336",
  "#3f51b5",
  "#4caf50",
  "#ff9800",
];

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
        <Bar dataKey="sales">
          {sales.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const UserSalesChart = ({ gameId, shouldUpdate }) => {
  const [sales, setSales] = useState([]);

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
        <Bar dataKey="sales">
          {sales.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[15 - (index % 16)]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const BeverageSelect = ({ beverages, onChange }) => {
  const [localBeverage, setLocalBeverage] = useState(beverages[0] ? 0 : "");
  const [hasSelected, setSelected] = useState(false);
  useEffect(() => {
    if (!hasSelected && beverages[0]) {
      setLocalBeverage(0);
      onChange(0);
    }
  }, [beverages, hasSelected, onChange]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalBeverage(value);
    setSelected(true);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select value={localBeverage} onChange={handleChange}>
      {beverages.map((beverage, index) => {
        return (
          <MenuItem value={index} key={index}>
            {beverage.name}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export const PriceHistory = ({ gameId, shouldUpdate, beverage }) => {
  const [prices, setPrices] = useState([]);
  useEffect(() => {
    getStats(gameId, "price-history").then((prices) => {
      setPrices(prices);
    });
  }, [gameId, shouldUpdate]);

  return (
    <>
      <ResponsiveContainer>
        <AreaChart
          data={
            beverage
              ? prices.filter((price) => price.slotNo === beverage.slotNo)
              : []
          }
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis
            dataKey="createdAt"
            tickFormatter={(date) => {
              return dayjs(date).format("HH:mm");
            }}
          />
          <YAxis
            tickFormatter={(cents) => {
              return `€${toEuro(cents)}`;
            }}
          />
          <Tooltip formatter={(cents) => `€${toEuro(cents)}`} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            fill="#eeecfb"
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
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
  const [selectedBeverage, setSelectedBeverage] = useState(null);

  const handleBeverageSelect = (index) => {
    setSelectedBeverage(beverages[index]);
  };

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

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} zeroMinWidth>
          <Paper className={fixedHeightPaper}>
            <Typography style={{ textAlign: "center" }}>
              Price History
            </Typography>
            <BeverageSelect
              beverages={beverages}
              onChange={handleBeverageSelect}
            />
            <PriceHistory
              gameId={gameId}
              shouldUpdate={shouldUpdate}
              beverage={selectedBeverage}
            />
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
