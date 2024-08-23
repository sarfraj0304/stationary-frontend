import {
  Fade,
  Paper,
  Grid,
  Modal,
  Typography,
  ClickAwayListener,
  CircularProgress,
  IconButton,
  Checkbox,
} from "@mui/material";
import MyButton from "./MyButton";
import Image from "./Assets/15120-delete.json";
import Image1 from "./Assets/error1.json";
import Image2 from "./Assets/error2.json";
import Lottie from "lottie-react";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function MyModal(props) {
  const { open, setOpen, close, disableEscapeKeyDown } = props;
  const [param, setParams] = useSearchParams();
  const handleClose = (e) => {
    e.target.id == "modalClose@123" && close && setOpen(false);
    if (props?.removeParams) {
      setParams("");
      param;
    }
    let firstLogin = sessionStorage.getItem("firstLogin");
    if (firstLogin) {
      sessionStorage.removeItem("firstLogin");
    }
  };
  return (
    <Modal
      hideBackdrop
      sx={{
        border: "none",
      }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      closeAfterTransition
      disableEscapeKeyDown={disableEscapeKeyDown ?? false}
    >
      <Fade in={open}>
        <Grid
          id="modalClose@123"
          sx={(theme) => ({
            width: "100%",
            height: "100%",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${theme.palette.contras.main}10`,
          })}
        >
          <ClickAwayListener onClickAway={handleClose}>
            <Grid>{props.children}</Grid>
          </ClickAwayListener>
        </Grid>
      </Fade>
    </Modal>
  );
}

export function DeletePopup({
  type,
  confirm,
  open,
  setOpen,
  btnText,
  setSelectData,
  disabled,
  loading,
  deletePermanentText,
}) {
  const [deleteRecord, setDeleteRecord] = useState(false);

  return (
    <MyModal open={open} setOpen={setOpen}>
      <Paper
        elevation={9}
        sx={{
          width: "500px",
          padding: deletePermanentText
            ? "20px 30px 15px 0px"
            : "20px 30px 30px 0px",
          borderRadius: "26px",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Lottie animationData={Image} />
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                p: "10px 10px",
                fontWeight: "bold",
                textTransform: "capitalize",
                color: "error.light",
              }}
            >
              Are you sure?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                p: "5px 10px",
                color: "text.secondary",
                fontSize: "16px",
              }}
            >
              {type
                ? type
                : "Please remember that after deleting the data you will lost data forever, related data as well."}
            </Typography>
            <Grid
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                pt: "15px",
              }}
            >
              <MyButton
                disabled={loading}
                onClick={() => {
                  setOpen(false);
                  setSelectData && setSelectData([]);
                }}
                sx={{
                  mr: "10px",
                  bgcolor: "disable.contrastText",
                  "&:hover": {
                    bgcolor: "disable.contrastText",
                  },
                  color: "text.head",
                }}
              >
                cancel
              </MyButton>

              <MyButton
                disabled={loading || disabled || false}
                onClick={() => {
                  confirm(deleteRecord);
                  deleteRecord && setDeleteRecord(false);
                }}
              >
                {loading ? (
                  <CircularProgress size={30} sx={{ color: "primary.main" }} />
                ) : btnText ? (
                  btnText
                ) : (
                  "Remove"
                )}
              </MyButton>
            </Grid>
          </Grid>
        </Grid>
        {deletePermanentText && (
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              pl: "20px",
              pt: "15px",
            }}
          >
            <Checkbox
              value={deleteRecord}
              onChange={() => setDeleteRecord((prev) => !prev)}
            />
            <Typography>{deletePermanentText ?? "-"}</Typography>
          </Grid>
        )}
      </Paper>
    </MyModal>
  );
}

export function ConfirmationPopup({
  active,
  confirm,
  open,
  setOpen,
  btnText,
  cancelText,
  titleMsg,
  titleMsg1,
  bodyMsg,
  bodyMsg1,
  formPrint,
  onClose,
  loading,
  showCloseBtn,
  customButton,
  customCancel,
  imgOfConfirm,
  ...props
}) {
  return (
    <MyModal
      open={open}
      setOpen={setOpen}
      disableEscapeKeyDown={props?.disableEscapeKeyDown}
    >
      <Paper
        elevation={9}
        sx={{
          width: "500px",
          paddingBottom: "15px",
          borderRadius: "26px",
          position: "relative",
        }}
      >
        <Grid container>
          {showCloseBtn && (
            <Grid
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "end",
                right: "0px",
                top: "0px",
                position: "absolute",
                borderRadius: "50%",

                bgcolor: "background.paper",
              }}
            >
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          )}
          <Grid container>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                p: "10px",
              }}
            >
              <Lottie
                animationData={
                  active ? imgOfConfirm || Image2 : imgOfConfirm || Image1
                }
              />
            </Grid>

            <Grid item xs={8}>
              <Typography
                variant="h5"
                sx={{
                  pt: "28px",
                  pb: "8px",
                  textTransform: "capitalize",
                  color: active ? "icon.green" : "icon.warning",
                }}
              >
                {active
                  ? titleMsg || "Want to Activate ?"
                  : titleMsg1
                  ? titleMsg1
                  : titleMsg
                  ? titleMsg
                  : "Want To Deactivate ?"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  pb: props?.Addon ? "0px" : "20px",
                  pr: "10px",
                  color: "text.secondary",
                }}
              >
                {active
                  ? bodyMsg ||
                    "Once activated you have access to  all the data."
                  : bodyMsg1
                  ? bodyMsg1
                  : bodyMsg
                  ? bodyMsg
                  : "Once deactivated you no longer have access to all the data. "}
              </Typography>
              {props?.Addon && props.Addon}
              <Grid
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  // pb: "20px",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                {customCancel ? (
                  customCancel
                ) : (
                  <MyButton
                    color="disable"
                    onClick={onClose ? onClose : () => setOpen(false)}
                    sx={{
                      // mr: "20px",
                      bgcolor: "disable.main",
                      "&:hover": {
                        bgcolor: "disable.light",
                      },
                      color: "text.primary",
                    }}
                  >
                    {!showCloseBtn ? "cancel" : "No"}
                  </MyButton>
                )}

                {customButton ? (
                  customButton
                ) : (
                  <MyButton
                    variant="contained"
                    disabled={loading || props?.disableButton}
                    sx={(theme) => ({
                      px: formPrint && "0px",
                      textTransform: "capitalize",
                      mr: "30px",
                    })}
                    onClick={confirm}
                  >
                    {loading ? (
                      <CircularProgress
                        size={30}
                        sx={{ color: "primary.main" }}
                      />
                    ) : btnText ? (
                      btnText
                    ) : (
                      "Remove"
                    )}
                  </MyButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </MyModal>
  );
}
