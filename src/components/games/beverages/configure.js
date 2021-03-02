import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Formik, Form, Field, useField, useFormikContext } from "formik";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import { debounce } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

import ApiClient from "../../../helpers/Api";
import { toEuro } from "./index";

const useStyles = makeStyles((theme) => ({
  spacer: {
    flexGrow: 1,
  },
}));

const debounceImageSearch = debounce(function (input, setImageURL, setLoading) {
  setLoading(true);
  ApiClient.get(`/images?query=${input}`).then(function (res) {
    const url = res?.data?.results[0]?.image;
    if (url?.length) {
      setImageURL("imageUrl", url);
    }
  });
  setLoading(false);
}, 500);

const ImageURL = (props) => {
  const {
    values: { name, imageUrl },
    touched,
    setFieldValue,
  } = useFormikContext();
  const [field] = useField(props);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (imageUrl?.trim() !== "") {
      return;
    }
    if (name.trim() !== "" && touched.name) {
      debounceImageSearch(name, setFieldValue, setLoading);
    }
  }, [name, touched.name, setFieldValue, imageUrl]);

  return (
    <>
      <Field {...props} {...field} disabled={loading} />
    </>
  );
};

const PriceInput = ({ name, label }) => {
  return (
    <Field
      component={TextField}
      variant="outlined"
      margin="normal"
      as="input"
      required
      fullWidth
      label={label}
      name={name}
      type="number"
      inputProps={{
        precision: 2,
        step: 0.1,
        min: 0,
      }}
      InputProps={{
        startAdornment: <InputAdornment position="start">€</InputAdornment>,
      }}
    />
  );
};

async function create(gameId, beverage) {
  return ApiClient.post(`/games/${gameId}/beverages`, beverage);
}

async function update(gameId, beverage) {
  return ApiClient.put(`/games/${gameId}/beverages`, beverage);
}

const ConfigureBeverageForm = ({
  gameId,
  beverage,
  nextAvailableSlot,
  open,
  handleClose,
  refreshBeverages,
}) => {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  async function setBeverageConfig(config) {
    let action = update;

    if (!Number.isInteger(config.slotNo)) {
      config.slotNo = nextAvailableSlot();
      action = create;
    }

    // remove the empty image url as that would be an invalid url
    if (!config.imageUrl?.length) {
      delete config.imageUrl;
    }

    config.startingPrice = Math.round(config.startingPrice * 100);
    config.minPrice = Math.round(config.minPrice * 100);
    config.maxPrice = Math.round(config.maxPrice * 100);

    return await action(gameId, config)
      .then(function () {
        refreshBeverages();
        handleClose();
      })
      .catch(function (error) {
        if (error?.response?.status === 409) {
          setError("The beverages are out of sync, please reload your page.");
        } else {
          setError(`Error: ${error.response?.data || "unknown error occured"}`);
        }
        console.log(error.response);
      });
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle>Configure Beverage</DialogTitle>

        <Formik
          initialValues={{
            name: beverage?.name || "",
            imageUrl: beverage?.imageUrl || "",
            minPrice: beverage?.minPrice ? toEuro(beverage.minPrice) : "",
            maxPrice: beverage?.maxPrice ? toEuro(beverage.maxPrice) : "",
            startingPrice: beverage?.startingPrice
              ? toEuro(beverage.startingPrice)
              : "",
            slotNo: beverage?.slotNo,
          }}
          onSubmit={async (values) => {
            await setBeverageConfig({ ...values });
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(),
            imageUrl: Yup.string().url("Not a valid URL"),
            minPrice: Yup.number().positive().required().label("Minimum price"),
            maxPrice: Yup.number().positive().required().label("Maximum price"),
            startingPrice: Yup.number()
              .positive()
              .required()
              .label("Start price"),
          })}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className={classes.form}>
              <DialogContent>
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
                      name="imageUrl"
                      component={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Image URL"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {values.imageUrl ? (
                      <img
                        src={values.imageUrl}
                        width="100%"
                        alt={values.name}
                      />
                    ) : (
                      <img
                        src={`${process.env.PUBLIC_URL}/images/stonks.png`}
                        width="100%"
                        alt={values.name}
                      />
                    )}
                  </Grid>
                </Grid>
                <PriceInput name="minPrice" label="Minimum Price" />
                <PriceInput name="maxPrice" label="Maximum Price" />
                <PriceInput name="startingPrice" label="Start Price" />
              </DialogContent>

              <DialogActions>
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
              </DialogActions>
              <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setError(null)}
              >
                <MuiAlert elevation={6} variant="filled" severity="error">
                  {error}
                </MuiAlert>
              </Snackbar>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ConfigureBeverageForm;
