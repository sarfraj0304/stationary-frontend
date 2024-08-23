import React, { useRef } from "react";
import {
  Grid,
  Typography,
  Slide,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import MyCard from "./MyCard";
import MyIconButton from "./MyIconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MyButton from "./MyButton";
import CloseIcon from "@mui/icons-material/Close";
function MyModalUI({ open, setOpen, ...props }) {
  const myRef = useRef();
  return (
    <MyCard
      sx={{
        borderRadius: { xs: "0px", sm: "15px" },
        borderTopLeftRadius: { xs: "15px", sm: "15px" },
        borderTopRightRadius: { xs: "15px", sm: "15px" },
        display: "flex",
        p: { xs: "17px", sm: "17px" },
        flexDirection: "column",
        width: "650px",
        maxWidth: { xs: "100vw", sm: "calc(100vw - 20px)" },
        maxHeight: { xs: "95vh", sm: "calc(100vh - 20px)" },
        ...props?.sx,
      }}
    >
      {/* Head Start */}
      <Grid
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "10px",
          borderBottom: "2px solid",
          borderColor: "border.main",
        }}
      >
        <Typography variant="h6">{props?.title}</Typography>
        <IconButton
          onClick={() => {
            props?.handleClose && props?.handleClose();
            setOpen(false);
          }}
        >
          <Tooltip title="Close">
            <CloseIcon
              sx={(theme) => ({
                color: "border.primary",
                width: "26px",
                height: "26px",
                transition: "all 0.3s",
                "&:hover": {
                  cursor: "pointer",
                  color: "border.primary",
                },
              })}
            />
          </Tooltip>
        </IconButton>
      </Grid>
      {/* Head End */}
      {/* body Start*/}
      <Grid
        container
        sx={{
          width: "100%",
          display: "flex",
          rowGap: "16px",
          justifyContent: "center",
          alignItems: "flex-start",
          overflowX: "hidden",
          overflowY: "auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: "5px",
            height: "5px",
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
          ...props?.bodySx,
        }}
      >
        {props?.children}
      </Grid>
      {/* body end*/}
      {/* Button Start*/}
      {props?.hideFooter ? null : (
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mt: "10px",
          }}
        >
          <Grid item>
            <Typography
              sx={{
                color: "icon.error",
                fontSize: "12px",
              }}
            >
              {!props.showValidationMsg && `'*' indicates the required field.`}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              columnGap: "20px",
            }}
          >
            <Grid ref={myRef}>
              <Slide
                direction="left"
                container={myRef.current}
                in={props?.isTouched || false}
                mountOnEnter
                unmountOnExit
              >
                <Grid>
                  <MyIconButton
                    disabled={props?.loading || false}
                    sx={{ width: "38px", height: "38px" }}
                    onClick={props?.reset}
                  >
                    <Tooltip title="Reset">
                      <RestartAltIcon color="warning" />
                    </Tooltip>
                  </MyIconButton>
                </Grid>
              </Slide>
            </Grid>
            <MyButton
              color="disable"
              onClick={() => {
                props?.handleClose && props?.handleClose();
                setOpen(false);
              }}
            >
              {"Close"}
            </MyButton>
            <MyButton
              type="submit"
              onClick={() => props?.setValidate && props?.setValidate(true)}
              disabled={props?.loading || false}
            >
              {props?.loading ? (
                <CircularProgress size={30} sx={{ color: "primary.main" }} />
              ) : (
                "Submit"
              )}
            </MyButton>
          </Grid>
        </Grid>
      )}
      {/* Button end*/}
      {props?.footer ? (
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mt: "10px",
          }}
        >
          {props?.footer}
        </Grid>
      ) : null}
    </MyCard>
  );
}
export default MyModalUI;
