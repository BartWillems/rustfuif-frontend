import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import ApiClient from "../helpers/Api";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  image: {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/login-beer.jpg)`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const history = useHistory();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <h1>Beursfuif</h1>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Formik
            initialValues={{ username: "", password: "", passwordRepeat: "" }}
            onSubmit={(values, { setSubmitting }) => {
              ApiClient.post("/register", values)
                .then(function () {
                  history.push("/login");
                })
                .catch(function (error) {
                  setError(error?.response?.data || "unexpected error occured");
                  setSubmitting(false);
                });
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().required().label("Username"),
              password: Yup.string()
                .required()
                .min(8, "Your password should at least be 8 characters long"),
              passwordRepeat: Yup.string().oneOf(
                [Yup.ref("password"), null],
                "Passwords must match"
              ),
            })}
          >
            {({ isSubmitting }) => (
              <Form className={classes.form}>
                <Field
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  autoFocus
                />
                <Field
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
                <Field
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="passwordRepeat"
                  label="Confirm Password"
                  type="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Register
                </Button>
                <Grid container>
                  <Grid item>
                    <Link component={RouterLink} to="/login" variant="body2">
                      {"Already have an account? Log In"}
                    </Link>
                  </Grid>
                </Grid>
                <Snackbar
                  open={Boolean(error)}
                  autoHideDuration={6000}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  onClose={() => setError(false)}
                >
                  <Alert severity="error">{error}</Alert>
                </Snackbar>
              </Form>
            )}
          </Formik>
        </div>
      </Grid>
    </Grid>
  );
}
