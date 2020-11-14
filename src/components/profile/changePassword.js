import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import * as Yup from "yup";

import ApiClient from "../../helpers/Api";

const ChangePassword = () => {
  const [error, setError] = useState(null);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          newPasswordRepeated: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          // clear errors
          setError(null);
          setInvalidPassword(false);
          ApiClient.post("/change-password", {
            old: values.currentPassword,
            new: values.newPassword,
          })
            .then(function () {
              setSuccess(true);
            })
            .catch(function (error) {
              if (error.response.status === 401) {
                setError("Invalid password");
                setInvalidPassword(true);
              } else {
                setError(error?.response?.data || "unexpected error occured");
              }
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
        validationSchema={Yup.object().shape({
          currentPassword: Yup.string().required().label("Current Password"),
          newPassword: Yup.string()
            .required()
            .min(8, "Your password should at least be 8 characters long"),
          newPasswordRepeated: Yup.string().oneOf(
            [Yup.ref("newPassword"), null],
            "Passwords must match"
          ),
        })}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Current Password"
              name="currentPassword"
              autoComplete="current-password"
              type="password"
              error={invalidPassword}
            />
            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              autoComplete="current-password"
            />
            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPasswordRepeated"
              label="Confirm Password"
              type="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Submit
            </Button>
            <Snackbar
              open={Boolean(error)}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              onClose={() => setError(false)}
            >
              <MuiAlert elevation={6} variant="filled" severity="error">
                {error}
              </MuiAlert>
            </Snackbar>
            <Snackbar
              open={success}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              onClose={() => setSuccess(false)}
            >
              <MuiAlert elevation={6} variant="filled" severity="success">
                Password successfully changed!
              </MuiAlert>
            </Snackbar>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangePassword;
