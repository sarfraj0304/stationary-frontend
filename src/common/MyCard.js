import { Grid } from "@mui/material";
import React from "react";

const MyCard = React.forwardRef((props, ref) => {
  const { sx, ...val } = props;
  return (
    <Grid
      ref={ref}
      sx={(t) => ({
        bgcolor: props?.bgcolor ? props?.bgcolor(t) : "background.paper",
        boxShadow: props?.removeshadow
          ? ""
          : // : "0 .75rem 1.5rem rgba(18,38,63,.03)",
            "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        borderRadius: "13px",

        ...sx,
      })}
      {...val}
    >
      {props.children}
    </Grid>
  );
});

export default MyCard;
