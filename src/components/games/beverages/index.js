import React, { useState } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import CardActions from "@material-ui/core/CardActions";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import SettingsIcon from "@material-ui/icons/Settings";
import Divider from "@material-ui/core/Divider";
import ConfigureBeverageForm from "./configure";

const useStyles = makeStyles((theme) => ({
  card: {},
  media: {
    height: 190,
  },
  content: {
    flex: "1 0 auto",
  },
  controls: {
    display: "flex",
    justifyContent: "space-around",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  controlButton: {
    cursor: "pointer",
    margin: "10px",
    color: theme.palette.info.main,
  },
  profit: {
    color: theme.palette.success.main,
    display: "flex",
    alignItems: "center",
  },
  loss: {
    color: theme.palette.error.dark,
    display: "flex",
    alignItems: "center",
  },
}));

export const toEuro = (cents) => {
  return (cents / 100).toFixed(2);
};

function calculatePrice(beverage, offsets) {
  let offset = offsets[beverage.slot_no];
  let price = beverage.starting_price + offset * 10;
  if (price > beverage.max_price) {
    price = beverage.max_price;
  }

  if (price < beverage.min_price) {
    price = beverage.min_price;
  }

  return price;
}

const Price = ({ beverage, offsets }) => {
  const classes = useStyles();

  if (!("slot_no" in beverage) || Object.keys(offsets).length === 0) {
    return <Typography variant="h6">&nbsp;</Typography>;
  }

  const price = calculatePrice(beverage, offsets);

  if (price < beverage.starting_price) {
    return (
      <Typography variant="h6" className={classes.loss}>
        €{toEuro(price)} <TrendingDownIcon />
      </Typography>
    );
  }

  return (
    <Typography variant="h6" className={classes.profit}>
      €{toEuro(price)} <TrendingUpIcon />
    </Typography>
  );
};

const BeverageCards = ({
  beverages,
  gameId,
  loading,
  offsets,
  getBeverages,
}) => {
  const classes = useStyles();
  const [openEdit, setEdit] = useState(false);
  const [editBeverage, setEditBeverage] = useState(null);

  const handleBeverageEdit = (beverage) => {
    setEditBeverage(beverage);
    setEdit(true);
  };

  const handleClose = () => {
    setEdit(false);
  };

  function nextAvailableSlot() {
    let next = 0;

    for (let i = 0; i < beverages.length; i++) {
      if (!("slot_no" in beverages[i])) {
        return next;
      }

      next += 1;
    }
    return next;
  }

  return (
    <div>
      <Grid container spacing={3}>
        {beverages.map((beverage, index) => (
          <Grid
            key={beverage.id || index}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
          >
            <Card className={classes.card}>
              {loading ? (
                <Skeleton
                  animation="wave"
                  variant="rect"
                  className={classes.media}
                />
              ) : (
                <CardMedia
                  className={classes.media}
                  image={
                    beverage.image_url ||
                    `${process.env.PUBLIC_URL}/images/stonks.png`
                  }
                  title={beverage.name || "item not yet configured"}
                />
              )}
              <CardHeader
                title={
                  loading ? (
                    <Skeleton
                      animation="wave"
                      height={10}
                      width="80%"
                      style={{ marginBottom: 6 }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      component="h2"
                      styles={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {beverage.name || "item not yet configured"}
                    </Typography>
                  )
                }
                subheader={<Price beverage={beverage} offsets={offsets} />}
              />
              <Divider />
              <CardActions className={classes.controls}>
                <SettingsIcon
                  className={classes.controlButton}
                  onClick={() => {
                    handleBeverageEdit(beverage);
                  }}
                />

                <Divider orientation="vertical" flexItem />
                <AddShoppingCartIcon className={classes.controlButton} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ConfigureBeverageForm
        gameId={gameId}
        beverage={editBeverage}
        nextAvailableSlot={nextAvailableSlot}
        open={openEdit}
        handleClose={handleClose}
        getBeverages={getBeverages}
      />
    </div>
  );
};

BeverageCards.propTypes = {
  beverages: PropTypes.array.isRequired,
  gameId: PropTypes.any.isRequired,
  offsets: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

export default BeverageCards;
