import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import Slider from "@material-ui/core/Slider";
import * as Yup from "yup";

import DayJS from "../../helpers/DayJS";
import ApiClient from "../../helpers/Api";

const useStyles = makeStyles((theme) => ({
  spacer: {
    flexGrow: 1,
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Schema = Yup.object().shape({
  beverage_count: Yup.number()
    .min(2, "Not enough beverages, at least 2")
    .max(16, "Too much beverages (16 max)")
    .required("Required"),
});

const CreateGame = () => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState();

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Create Game
      </Typography>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <Formik
          initialValues={{
            name: "",
            beverage_count: 5,
            start_time: DayJS().add(2, "minutes"),
            duration: 1,
          }}
          onSubmit={async (values) => {
            values.close_time = values.start_time.add(values.duration, "hours");

            await ApiClient.post("/games", values)
              .then(() => {
                history.push("/");
              })
              .catch((error) => {
                setError(error.message);
              });
          }}
          validationSchema={Schema}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className={classes.form}>
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                autoFocus
              />
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="beverage_count"
                label="Total Beverages"
                min="2"
                type="number"
              />
              <Field
                component={DateTimePicker}
                label="Start Time"
                inputVariant="outlined"
                fullWidth
                required
                style={{ marginBottom: "10px", marginTop: "10px" }}
                name="start_time"
              />

              <p>Duration</p>

              <Slider
                name="duration"
                min={1}
                marks={[
                  { value: 1, label: "1 Hour" },
                  { value: 6, label: "6 Hours" },
                  { value: 12, label: "12 Hours" },
                  { value: 24, label: "1 Day" },
                ]}
                step={1}
                max={24}
                valueLabelDisplay="auto"
                value={values.duration}
                onChange={(event, value) => setFieldValue("duration", value)}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting}
                style={{ float: "right" }}
              >
                Create
              </Button>
              <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setError(null)}
              >
                <Alert severity="error">{error}</Alert>
              </Snackbar>
            </Form>
          )}
        </Formik>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default CreateGame;
