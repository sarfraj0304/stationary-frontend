import { Badge, Grid, IconButton, Tooltip } from "@mui/material";
import React from "react";

export default function MyIconButton(props) {
  const { back, back2, sx, ...prp } = props;
  return (
    <Tooltip title={props?.tooltip}>
      <Grid
        sx={(theme) => ({
          borderRadius: "50%",
          bgcolor: back2
            ? `${theme.palette.primary.main}11`
            : back
            ? `${theme.palette.icon.error}11`
            : `${theme.palette.icon.warning}11`,
          ...sx,
        })}
      >
        <Badge color="primary" variant="dot" invisible={!props?.show}>
          <IconButton size="small" color="warning" {...prp}>
            {props.children}
          </IconButton>
        </Badge>
      </Grid>
    </Tooltip>
  );
}
