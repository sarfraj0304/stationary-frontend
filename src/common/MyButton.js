import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";

export default function MyButton(props) {
  const { sx } = props;
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        minWidth: { xs: "110px", sm: "140px" },
        minHeight: { xs: "auto", sm: "36px" },
        textTransform: "capitalize",
        borderRadius: "8px",
        fontSize: { xs: "13px", sm: "16px" },
        ...sx,
      }}
    >
      {props.children}
    </Button>
  );
}

// custom submit button
export function NewProgressButton({
  progress,
  handleSubmit,
  handelClose,
  loading,
}) {
  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        minWidth: progress === 100 ? "18%" : "fit-content",
        ml: 2,
      }}
    >
      <Box
        onClick={handelClose}
        sx={{
          position: "relative",
          justifyContent: "center",
          alignItems: "center ",
          height: "45px",
          width: "45px",
          borderRadius: "50%",
          bgcolor: "disable.main",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "#b7b8cc",
          },
        }}
      >
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        >
          <Typography
            variant="caption"
            textAlign={"center"}
            color="text.sidebar"
            mt={"5px"}
          >
            <ArrowBackIcon />
          </Typography>
        </Box>
      </Box>
      <Grid
        component="button"
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          display: "flex",
          minWidth: progress === 100 ? "150px" : "fit-content",
          position: "relative",
          cursor: loading ? "not-allowed" : "pointer",
          border: "none",
          bgcolor: "transparent",
        }}
      >
        <Box
          sx={{
            zIndex: 10,
            bgcolor: "background.default",
            borderRadius: "50%",
            p: "2px",
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center ",
            }}
          >
            <Box sx={{ position: "absolute", top: 0, left: 0 }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={45}
                sx={{ color: "#e8e8e8" }}
              />
            </Box>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={45}
              sx={{ color: "primary.light" }}
            />
            <Box
              sx={{
                top: "15%",
                left: "15%",
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                height: "70%",
                width: "70%",
                bgcolor: loading ? "disable.main" : "primary.light",
                "&:hover": {
                  bgcolor: loading
                    ? "disable.main"
                    : progress === 100
                    ? null
                    : "primary.main",
                },
              }}
            >
              <Typography
                variant="caption"
                textAlign={"center"}
                color="white"
                mt={"5px"}
              >
                {loading ? (
                  <CircularProgress size={30} />
                ) : (
                  <ArrowForwardIcon />
                )}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "95%",
            bgcolor: loading ? "disable.main" : "primary.light",
            height: "45px",
            display: progress === 100 ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            borderRadius: "25px",
            position: "absolute",
            left: 7,
            top: 3,
            "&:hover": {
              bgcolor: loading ? "disable.main" : "primary.main",
            },
          }}
        >
          <Typography sx={{ marginLeft: 4 }}>Submit</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
