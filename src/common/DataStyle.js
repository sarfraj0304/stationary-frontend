import { Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const DataStyle = (props) => {
  const myRef = useRef();

  const [show, setShow] = useState(false);

  const style = typeof props.sx === "object" ? props.sx : {};

  if (props.number) style.fontFamily = "Roboto, sans-serif";

  useEffect(() => {
    function onLineWrapDoSomething() {
      try {
        if (myRef?.current.offsetWidth < myRef?.current.scrollWidth) {
          setShow(true);
        } else {
          setShow(false);
        }
      } catch (error) {
        //
      }
    }

    const resizeObserver = new ResizeObserver(onLineWrapDoSomething);
    resizeObserver.observe(myRef?.current);
    return () => {
      resizeObserver.disconnect(myRef?.current);
    };
  }, []);

  return (
    <Tooltip
      arrow
      title={
        props.tooltipEnabled || (props.handleWrap && show) ? props.children : ""
      }
    >
      <Typography
        noWrap
        ref={myRef}
        variant="body2"
        onClick={props?.handleClick}
        sx={{
          pr: "10px",
          maxWidth: "100%",
          color: "text.secondary",
          ...style,
        }}
      >
        {props.children}
      </Typography>
    </Tooltip>
  );
};

export default DataStyle;
