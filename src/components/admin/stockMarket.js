import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import { Formik } from "formik";

import ApiClient from "../../helpers/Api";

const useStyles = makeStyles((theme) => ({
  infoGraphic: {
    padding: theme.spacing(5),
    textAlign: "center",
  },
}));

export const PriceUpdater = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const updatePrices = () => {
    setLoading(true);
    ApiClient.post("/admin/market/update-prices")
      .catch((error) => {
        console.error("unable to update prices", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={2}>
      <Card>
        <CardContent className={classes.infoGraphic}>
          <Typography color="textSecondary" gutterBottom>
            Update Prices
          </Typography>
          <Button
            size="small"
            color="primary"
            onClick={() => updatePrices()}
            disabled={loading}
          >
            Update
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export const UpdateIntervalSlider = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    ApiClient.get("/admin/market/update-interval")
      .then((res) => {
        setInterval(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const updateInterval = (newInterval) => {
    setLoading(true);
    ApiClient.post("/admin/market/update-interval", newInterval, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((res) => {
        setInterval(res.data);
        setLoading(false);
        setHasChanged(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={12}>
      <Card>
        <CardContent className={classes.infoGraphic}>
          <Typography color="textSecondary" gutterBottom>
            Price Update Interval
          </Typography>
          <Formik
            enableReinitialize={true}
            initialValues={{
              interval: interval,
            }}
          >
            {({ values, setFieldValue }) => (
              <>
                <Slider
                  name="duration"
                  min={10}
                  marks={[
                    { value: 10, label: "10 Seconds" },
                    { value: 120, label: "2 Minutes" },
                    { value: 300, label: "5 Minutes" },
                    { value: 600, label: "10 Minutes" },
                  ]}
                  step={10}
                  max={600}
                  disabled={loading}
                  valueLabelDisplay="auto"
                  value={values.interval}
                  onChange={(event, value) => {
                    setFieldValue("interval", value);
                    setHasChanged(value !== interval);
                  }}
                />

                <Button
                  size="small"
                  color="primary"
                  onClick={() => updateInterval(values.interval)}
                  disabled={!hasChanged}
                >
                  Submit
                </Button>
              </>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Grid>
  );
};
