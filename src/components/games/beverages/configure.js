import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Formik, Form, Field, useField, useFormikContext } from "formik";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import { debounce } from "@material-ui/core";

import ApiClient from "../../../helpers/Api";

const useStyles = makeStyles((theme) => ({
  spacer: {
    flexGrow: 1,
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Schema = Yup.object().shape({
  image_url: Yup.string().url("Not a valid URL"),
});

const debounceImageSearch = debounce(function (input, setImageURL, setLoading) {
  setLoading(true);
  ApiClient.get(`/images?query=${input}`).then(function (res) {
    setImageURL("image_url", res?.data?.results[0]?.image);
  });
  setLoading(false);
}, 500);

const ImageURL = (props) => {
  const {
    values: { name, image_url },
    touched,
    setFieldValue,
  } = useFormikContext();
  const [field] = useField(props);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (image_url.trim() !== "") {
      return;
    }
    if (name.trim() !== "" && touched.name) {
      debounceImageSearch(name, setFieldValue, setLoading);
    }
  }, [name, touched.name, setFieldValue, image_url]);

  return (
    <>
      <Field {...props} {...field} disabled={loading} />
    </>
  );
};

const ConfigureBeverage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState(null);

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Configure Beverage
      </Typography>
      <Formik
        initialValues={{
          name: "",
          image_url: "",
        }}
        onSubmit={async (values) => {
          // values.close_time = values.start_time.add(values.duration, "hours");
          // await ApiClient.post("/games", values)
          //   .then(() => {
          //     history.push("/");
          //   })
          //   .catch((error) => {
          //     // setError(error.message);
          //     console.log("qmsldkjf");
          //   });
          console.log(values);
          setError("Unimplemented!");
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

            <Grid container spacing={3}>
              <Grid item xs={10}>
                <ImageURL
                  name="image_url"
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Image URL"
                />
              </Grid>
              <Grid item xs={2}>
                {values.image_url ? (
                  <img src={values.image_url} width="100%" alt={values.name} />
                ) : (
                  <img
                    src={`${process.env.PUBLIC_URL}/images/stonks.png`}
                    width="100%"
                    alt={values.name}
                  />
                )}
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isSubmitting}
              style={{ float: "right" }}
            >
              Submit
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
    </div>
  );
};

export default ConfigureBeverage;
