import { Form, Formik } from "formik";
import React, { forwardRef, useMemo, useRef, useState } from "react";
import MyCard from "./MyCard";
import ValidationType from "./ValidationType";
import * as Yup from "yup";
import ControlInput from "./ControlInput";
import { CircularProgress, Grid, Slide, Tooltip } from "@mui/material";
import MyIconButton from "./MyIconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MyButton from "./MyButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MyPopover from "./MyPopover";

export const paramMaker = (e, question) => {
  let temp = "";
  for (const key in e) {
    if (Array.isArray(e[key])) {
      if (e[key] && e[key].length) {
        temp =
          temp +
          e[key]
            .map((d) => {
              return `&${key}=${d?.value || d}`;
            })
            .join("");
      }
    } else {
      if (e[key]) temp = temp + `&${key}=${e[key]}`;
    }
  }
  return question ? `?${temp}` : temp;
};

function CommonFilter(
  {
    handelSubmit,
    loading,
    hideLoading,
    propsArray,
    removeshadow,
    submitText,
    exposeSetFieldValue,
    isPopover,
    ...rest
  },
  ref
) {
  const [validate, setValidate] = useState(false);
  const inputRef = useRef({});
  const containerRef = useRef("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverState, setPopoverState] = useState(false);

  const popoverClick = (e) => {
    setAnchorEl(e.currentTarget);
    setPopoverState(true);
  };

  const popoverClose = () => {
    setAnchorEl(null);
    setPopoverState(false);
  };

  useMemo(() => {
    if (!loading && validate) {
      setValidate(false);
      isPopover && popoverClose();
    }
  }, [loading]);

  const { validationSchema, rows, maxRows } = useMemo(() => {
    const validationSchema = {},
      rows = {},
      maxRows = [];

    propsArray.forEach((d) => {
      if (d?.field?.validation) {
        validationSchema[d?.field?.name] = ValidationType(
          d?.field?.control,
          d?.field?.validation
        );
      }
      if (d?.row >= 0) {
        if (rows[d?.row]) {
          rows[d?.row] = [...rows[d?.row], { ...d?.field }];
        } else {
          rows[d?.row] = [{ ...d?.field }];
          maxRows.push(d?.row);
        }
      } else {
        !rows["1"] && maxRows.push(1);
        rows["1"] = rows["1"]
          ? [...rows["1"], { ...d?.field }]
          : [{ ...d?.field }];
      }
    });
    return { validationSchema, rows, maxRows };
  }, [propsArray]);

  function MemoizedFunction({ values, initialValues, errors, touched }) {
    return useMemo(() => {
      if (values && initialValues) {
        const val = {},
          init = {};

        propsArray.forEach((d) => {
          const name = d?.field?.name;
          val[name] = values[name];
          init[name] = rest?.initialValues2
            ? rest?.initialValues2[name]
            : initialValues[name];
        });

        return {
          isTouched: !(JSON.stringify(val) == JSON.stringify(init)),
          val,
          init,
        };
      }
      return false;
    }, [values, errors, touched]);
  }

  function MemoizedFunctionTemp({
    values,
    isTouched,
    errors,
    rows,
    maxRows,
    formik,
    setFieldValue,
    val,
    init,
    initialValues,
  }) {
    return useMemo(() => {
      const MainForm = [],
        OutForm = [];
      maxRows.forEach((d, i) => {
        let btnMd = 0;
        if (maxRows.length - 1 == i && d != 0 && !isPopover) {
          rows[d].forEach((g) => {
            btnMd = g?.width ? btnMd + g.width : btnMd + 4;
            btnMd == 12 && (btnMd = 0);
          });
          btnMd == 0 ? (btnMd = 12) : (btnMd = 12 - btnMd);
        }

        const fields = (
          <Grid
            key={i}
            container
            sx={{
              width: "100%",
              rowGap: "10px",
              flexWrap: "wrap",
              justifyContent: "space-between",
              mb:
                i < maxRows.length - 1 && d != 0 && !isPopover ? "6px" : "0px",
            }}
          >
            {rows[d].map((item, i) => {
              const len = rows[d].length;
              const temp = len - 1 == i ? (len % 2 == 0 ? 6 : 12) : 6;
              if (item.control == "normal") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",
                      px: "6px",
                    }}
                  >
                    <ControlInput.Normal
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "select") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",
                      px: "6px",
                    }}
                  >
                    <ControlInput.Select
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "checkBox") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.checkBox
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "select2") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.SearchSelect
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "date") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.Date
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "time") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.Time
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "multiple") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.Multiple
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "ckeditor") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.CkEditor
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "ckeditor5") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.CkEditor5
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "uploader") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.Uploader
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
              if (item.control == "tree") {
                return (
                  <Grid
                    item
                    key={item.name + i}
                    xs={12}
                    sm={temp}
                    md={item?.width ? item.width : 4}
                    sx={{
                      width: "100%",

                      px: "6px",
                    }}
                  >
                    <ControlInput.Tree
                      ref={inputRef}
                      handler={formik}
                      {...item}
                    />
                  </Grid>
                );
              }
            })}
            {rest?.hideSubmitButton ? (
              ""
            ) : maxRows?.length - 1 == i ? (
              <Grid
                item
                xs={12}
                sm={12}
                md={btnMd}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  my: "auto",
                  px: "6px",
                }}
              >
                <Grid ref={containerRef}>
                  <Slide
                    direction="left"
                    container={containerRef.current}
                    in={isTouched}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid>
                      <MyIconButton
                        disabled={loading}
                        sx={{ mx: "10px" }}
                        onClick={() => {
                          setValidate(false);
                          let temp = {};
                          temp = rest?.manualReset
                            ? rest?.manualReset(
                                setFieldValue,
                                val,
                                init,
                                initialValues,
                                values
                              )
                            : {};
                          temp = { ...initialValues, ...temp };
                          !isPopover && handelSubmit(temp);
                          !rest?.manualReset && formik.handleReset();
                        }}
                      >
                        <Tooltip title="Reset">
                          <RestartAltIcon color={"warning"} />
                        </Tooltip>
                      </MyIconButton>
                    </Grid>
                  </Slide>
                </Grid>

                <MyButton
                  type="submit"
                  onClick={() => {
                    setValidate(true);
                    isPopover && formik.submitForm();
                    setPopoverState(false);
                  }}
                  disabled={validate && loading}
                  // sx={{
                  //   minWidth: {
                  //     xs: isTouched ? "110px" : "140px",
                  //     sm: isTouched ? "140px" : "155px",
                  //   },
                  // }}
                >
                  {validate && loading && !hideLoading ? (
                    <CircularProgress
                      size={25}
                      sx={{ color: "primary.main" }}
                    />
                  ) : (
                    submitText ?? "Apply"
                  )}
                </MyButton>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        );

        if (d == 0 && isPopover) {
          OutForm.push(fields);
        } else {
          MainForm.push(fields);
        }
      });

      return { MainForm, OutForm };
    }, [values, isTouched, errors, rows, maxRows]);
  }

  return maxRows?.length ? (
    <Formik
      initialValues={rest?.initialValues || {}}
      validateOnBlur={validate}
      validateOnChange={validate}
      onSubmit={handelSubmit}
      validationSchema={Yup.object(validationSchema)}
    >
      {(formik) => {
        const { values, errors, touched, initialValues, setFieldValue } =
          formik;

        exposeSetFieldValue && exposeSetFieldValue(setFieldValue);

        const { isTouched, val, init } = MemoizedFunction({
          values,
          initialValues,
          errors,
          touched,
        });

        const { MainForm, OutForm } = MemoizedFunctionTemp({
          values,
          isTouched,
          errors,
          rows,
          maxRows,
          formik,
          setFieldValue,
          val,
          init,
          initialValues,
        });

        return (
          <Form>
            {isPopover ? (
              <>
                <Grid
                  sx={{
                    display: "flex",
                    ml: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid ref={containerRef} sx={{ overflow: "hidden" }}>
                    <Slide
                      direction="left"
                      container={containerRef.current}
                      in={
                        !(
                          JSON.stringify(rest?.initialValues) ==
                          JSON.stringify(rest?.initialValues2)
                        )
                      }
                      mountOnEnter
                      unmountOnExit
                    >
                      <Grid>
                        <MyIconButton
                          disabled={loading}
                          sx={{ mr: "10px" }}
                          onClick={() => {
                            setValidate(false);
                            let temp = {};
                            temp = rest?.manualReset
                              ? rest?.manualReset(
                                  setFieldValue,
                                  val,
                                  init,
                                  initialValues,
                                  values
                                )
                              : {};
                            temp = { ...initialValues, ...temp };
                            handelSubmit(temp);
                            !rest?.manualReset && formik.handleReset();
                          }}
                        >
                          <Tooltip title="Reset">
                            <RestartAltIcon color={"warning"} />
                          </Tooltip>
                        </MyIconButton>
                      </Grid>
                    </Slide>
                  </Grid>
                  <Grid sx={{ pb: "10px" }}>{OutForm}</Grid>
                  <MyIconButton
                    show={
                      !(
                        JSON.stringify(rest?.initialValues) ==
                        JSON.stringify(rest?.initialValues2)
                      )
                    }
                    back2={true}
                    color="primary"
                    onClick={popoverClick}
                    sx={{ ...rest.isPopoverBtnSx }}
                  >
                    {rest?.customIcon ? rest?.customIcon : <FilterAltIcon />}
                  </MyIconButton>
                </Grid>
                <MyPopover
                  popoverOpen={popoverState}
                  anchorEl={anchorEl}
                  popoverClose={popoverClose}
                >
                  <Grid
                    sx={(theme) => ({
                      width: "400px",
                      p: "10px ",
                      borderRadius: "10px",
                      overflow: "hidden",
                      ...rest.isPopoverSx,
                    })}
                  >
                    {MainForm}
                  </Grid>
                </MyPopover>
              </>
            ) : (
              <MyCard
                sx={{
                  p: "16px 10px 22px 10px",
                  mb: "10px",
                }}
                removeshadow={removeshadow ?? false}
              >
                {MainForm}
              </MyCard>
            )}
          </Form>
        );
      }}
    </Formik>
  ) : (
    ""
  );
}

export default forwardRef(CommonFilter);
