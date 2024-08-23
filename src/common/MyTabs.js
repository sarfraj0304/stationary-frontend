import { Box, Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import MyCard from "./MyCard";

export default function MyTabs(props) {
  const cardStyle = props.vertical
    ? {
        width: "232px",
        height: "auto",
        maxHeight: "100%",
        overflow: "auto",
        p: "16px",
        "&::-webkit-scrollbar": {
          width: "4px",
          height: "5px",
          display: "none",
        },
        "&::-webkit-scrollbar-track": {
          my: "2px",
          mx: "10px",
          mb: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          border: "5px solid",
          borderColor: "border.scroll",
          borderRadius: "20px",
        },
      }
    : { width: "100%" };

  return (
    <Grid sx={{ display: props.vertical ? "flex" : "", width: "100%" }}>
      <Grid sx={{ ...cardStyle }}>
        <MyCard
          sx={{
            width: "100%",
            borderRadius: "13px",
            overflow: "hidden",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            ...(props?.cardSx ?? {}),
          }}
        >
          <Tabs
            value={props?.value}
            onChange={props?.onChange}
            orientation={props?.vertical ? "vertical" : "horizontal"}
            textColor="inherit"
            variant={props?.variant ? props?.variant : "fullWidth"}
            indicatorColor={"none"}
          >
            {props?.array.map((item, i) => (
              <Tab
                key={i}
                sx={
                  props?.value === i
                    ? {
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                        transition: "all 0.5s",
                        textTransform: "capitalize",
                        fontSize: "16px",
                        minWidth: item?.minWidth,
                        ...(props?.tabSx ?? {}),
                      }
                    : {
                        transition: "all 0.5s",
                        textTransform: "capitalize",
                        fontSize: "16px",
                        width: "100px",
                        minWidth: item?.minWidth,
                        ...(props?.tabSx ?? {}),
                      }
                }
                label={
                  item.customBody
                    ? item.customBody
                    : item?.title
                    ? item.title
                    : item
                }
                disabled={item.disabled}
              />
            ))}
          </Tabs>
        </MyCard>
      </Grid>
      <Grid
        sx={{
          width: props.vertical ? "calc(100% - 210px)" : "100%",
          height: "100%",
        }}
      >
        {props.children}
      </Grid>
    </Grid>
  );
}

export function TabPanel(props) {
  const { children, value, index, vertical, ...other } = props;

  return (
    <Grid hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ pt: "16px", pr: vertical ? "16px" : "" }}>{children}</Box>
      )}
    </Grid>
  );
}
export function NewTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Grid hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </Grid>
  );
}
