import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";

import AuthenticationContext from "../global";
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

export default function Login() {
  const classes = useStyles();
  const [hasError, setError] = useState(false);
  const [, setUser] = React.useContext(AuthenticationContext);
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
            Sign in
          </Typography>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              ApiClient.post("/login", values)
                .then(function (response) {
                  setUser(response.data);
                  history.push("/");
                })
                .catch(function (error) {
                  setError(true);
                  console.log(error);
                  setSubmitting(false);
                });
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting }) => (
              <form
                className={classes.form}
                onSubmit={handleSubmit}
                onChange={handleChange}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  autoFocus
                  error={hasError}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={hasError}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                {/* <Alert severity="error">Invalid Credentials!</Alert> */}
                <Snackbar
                  open={hasError}
                  autoHideDuration={6000}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  onClose={() => setError(false)}
                >
                  <Alert severity="error">Invalid Credentials!</Alert>
                </Snackbar>
              </form>
            )}
          </Formik>
        </div>
      </Grid>
    </Grid>
  );
}
