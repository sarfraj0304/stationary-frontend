import React from "react";
import Popover from "@mui/material/Popover";

function MyPopover({
  sx,
  popoverOpen,
  anchorEl,
  popoverClose,
  PaperProps,
  ...props
}) {
  return (
    <Popover
      open={popoverOpen}
      anchorEl={anchorEl}
      onClose={popoverClose}
      marginThreshold={props?.marginThreshold || 16}
      elevation={1}
      PaperProps={{
        sx: (theme) => ({
          bgcolor: "background.paper",
          borderRadius: "6px",
          boxShadow: props?.boxShadow
            ? props.boxShadow
            : `0px 4px 10px 6.5px ${theme.palette.current.main}20,0px -2px 10px 6.5px ${theme.palette.current.main}20,
            0px 1px 10px 0.5px ${theme.palette.contras.main}10,0px -1px 10px 0.5px ${theme.palette.contras.main}10,
            2px 2px 15px -8.5px ${theme.palette.primary.main}30,-2px -2px 15px -8.5px ${theme.palette.primary.main}30`,
          ...PaperProps,
        }),
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
        ...props?.anchorOrigin,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
        ...props?.transformOrigin,
      }}
      sx={{ mt: 1, ...sx }}
      {...props}
    >
      {props.children}
    </Popover>
  );
}

export default MyPopover;
