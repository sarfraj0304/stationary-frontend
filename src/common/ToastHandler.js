import { Grid } from "@mui/material";
import { toast } from "react-toastify";
import React from "react";

var lastMess = {
  mess: null,
  time: null,
};

const checkValidity = (newMess) => {
  let mess = lastMess;
  try {
    if (mess.mess === newMess) {
      let current = new Date();
      if (current.valueOf() < mess.time) {
        return false;
      } else {
        let current = new Date();
        let curr = current.valueOf() + 5000;
        let data = {
          mess: newMess,
          time: curr,
        };
        lastMess = data;
        return true;
      }
    } else {
      let current = new Date();
      let curr = current.valueOf() + 5000;
      let data = {
        mess: newMess,
        time: curr,
      };
      lastMess = data;
      return true;
    }
  } catch (error) {
    return true;
  }
};

export default function ToastHandler(stat, mess) {
  const ShowData = () => {
    return (
      <Grid sx={{ ml: "10px", textTransform: "capitalize" }}>
        {typeof mess === "string" ? mess : "invalid message"}
      </Grid>
    );
  };
  if (checkValidity(mess)) {
    if (stat === "warn") {
      toast.warn(<ShowData />, {
        theme: "colored",
        autoClose: "false",
        style: {
          boxShadow: "0px 3px 3px #FFFFFF69",
        },
      });
    } else if (stat === "dan") {
      toast.error(<ShowData />, {
        theme: "colored",
        autoClose: "false",
        style: {
          boxShadow: "0px 3px 3px #FFFFFF69",
        },
      });
    } else {
      toast.success(<ShowData />, {
        theme: "colored",
        autoClose: "false",
        style: {
          backgroundColor: "#6fb33c",
          boxShadow: "0px 3px 3px #FFFFFF69",
        },
      });
    }
    return true;
  } else {
    return false;
  }
}
