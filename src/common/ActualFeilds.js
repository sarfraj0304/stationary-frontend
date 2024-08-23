import { Grid } from "@mui/material";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import ControlInput from "./ControlInput";

export const ActualField = forwardRef(({ item, inputRef, handler }, ref) => {
  useImperativeHandle(ref, () => ({
    focus: (name) => {
      let field = inputRef.current[name?.name];
      if (field) {
        if (
          name.control === "normal" ||
          name.control === "password" ||
          name.control === "date" ||
          name.control === "time" ||
          name.control === "dateTime" ||
          name.control === "multiple" ||
          name.control === "tree" ||
          name.control === "select2" ||
          name.control === "checkBox" ||
          name.control === "dateTimePicker"
        ) {
          field.childNodes[1].childNodes[0].focus();
        } else if (name.control === "select") {
          field.childNodes[0].focus();
        } else if (name.control === "ckeditor") {
          field.editor.container.childNodes[0].focus();
        } else if (name.control === "uploader") {
          name?.mini
            ? field.childNodes[1].childNodes[0].focus()
            : field.childNodes[1].childNodes[0].childNodes[2].childNodes[2].focus();
        } else if (name.control === "fileUploader") {
          field?.childNodes[2]?.childNodes[0]?.childNodes[0]?.childNodes[0]?.focus();
        } else if (name.control === "component") {
          field.focus();
        }
      }
    },
  }));

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={item?.width ? item.width : 6}
      sx={{
        width: "100%",
        py: "9px",
        px: "6px",
        ...item?.style,
      }}
    >
      {useMemo(() => {
        if (item.control == "normal") {
          return (
            <ControlInput.Normal ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "password") {
          return (
            <ControlInput.Password ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "select") {
          return (
            <ControlInput.Select ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "checkBox") {
          return (
            <ControlInput.checkBox ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "select2") {
          return (
            <ControlInput.SearchSelect
              ref={inputRef}
              handler={handler}
              {...item}
            />
          );
        }
        if (item.control == "date") {
          return (
            <ControlInput.Date ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "time") {
          return (
            <ControlInput.Time ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "dateTime") {
          return (
            <ControlInput.DateTime ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "multiple") {
          return (
            <ControlInput.Multiple ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "component") {
          return <item.Component ref={inputRef} handler={handler} {...item} />;
        }
        if (item.control == "ckeditor") {
          return (
            <ControlInput.CkEditor ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "ckeditor5") {
          return (
            <ControlInput.CkEditor5
              ref={inputRef}
              handler={handler}
              {...item}
            />
          );
        }
        if (item.control == "uploader") {
          return (
            <ControlInput.Uploader ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "tree") {
          return (
            <ControlInput.Tree ref={inputRef} handler={handler} {...item} />
          );
        }
        if (item.control == "dateTimePicker") {
          return (
            <ControlInput.DateTimePicker
              ref={inputRef}
              handler={handler}
              {...item}
            />
          );
        }
        if (item.control == "fileUploader") {
          return (
            <ControlInput.Uploader2
              ref={inputRef}
              handler={handler}
              {...item}
            />
          );
        }
      }, [item, handler, ref])}
    </Grid>
  );
});
