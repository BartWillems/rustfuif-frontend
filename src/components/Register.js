import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import ApiClient from "../helpers/Api";
import { Routes } from "./Router";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "600px",
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
    <div className={classes.container}>
      <h1>Beursfuif</h1>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Formik
        initialValues={{ username: "", password: "", passwordRepeat: "" }}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          ApiClient.post("/register", values)
            .then(function () {
              history.push(Routes.Login);
            })
            .catch(function (error) {
              if (error.response.status === 409) {
                setError("username already exists");
                setErrors({ username: "username already exists" });
              } else {
                setError(error?.response?.data || "unexpected error occured");
              }

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
                <Link component={RouterLink} to={Routes.Login} variant="body2">
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
  );
}
