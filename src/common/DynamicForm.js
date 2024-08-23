import React, {
  forwardRef,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import TextField from "@mui/material/TextField";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  createFilterOptions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import moment from "moment";
import MyButton from "./MyButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useImperativeHandle } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FIELD": {
      return [...state, action.payload];
    }
    case "REMOVE_FIELD": {
      const temp = [...state];
      temp.splice(action.payload, 1);
      return temp;
    }
    case "UPDATE_FIELD": {
      return state.map((field, index) =>
        index === action.payload.index
          ? { ...field, [action.payload.fieldName]: action.payload.value }
          : field
      );
    }
    case "RESET_FORM": {
      return [action.payload];
    }
    default:
      return state;
  }
};

const DynamicForm = forwardRef(
  ({ initialValues, inputData, addDisabledFun, ...props }, ref) => {
    let [state, dispatch] = useReducer(formReducer, initialValues);
    const [errors, setErrors] = useState(props?.errors || []);
    const [selectAll, setSelectAll] = useState([]);

    const formRef = useRef();
    const fieldRef = useRef();

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    useEffect(() => {
      if (props?.handleChange) {
        props.handleChange(state);
      }
    }, [state]);

    useImperativeHandle(ref, () => ({
      onSubmit: handleSubmit,
      focus: () => {
        const formElements = Array.from(fieldRef.current.elements);

        for (let element of formElements) {
          if (
            element.tagName === "INPUT" &&
            ((element.value === "" &&
              element.getAttribute("aria-invalid") == "true") ||
              element.getAttribute("aria-invalid") == "true")
          ) {
            element.focus();
            break;
          }
        }
      },
      handleReset: () => {
        setErrors([]);
        dispatch({
          type: "RESET_FORM",
          payload: props?.initialData,
        });
      },
      handleErrors: handleUpdateErrors,
    }));

    async function handleUpdateErrors() {
      const newErrors = await Promise.allSettled(
        state.map(async (field) => {
          const errorObj = {};
          await Promise.allSettled(
            inputData?.map(async (el) => {
              if (el?.validation) {
                try {
                  await (
                    (typeof el?.validation == "function" &&
                      el.validation(field)) ||
                    el.validation
                  ).validate(field[el.name]);
                  errorObj[el.name] = "";
                } catch (err) {
                  err.message !== "this is invalid"
                    ? (errorObj[el.name] = err.message)
                    : (errorObj[el.name] = "");
                }
              } else {
                errorObj[el.name] = "";
              }
            })
          );
          return errorObj;
        })
      );

      let tempArr = [];
      newErrors.map((el) => {
        tempArr.push(el.value);
      });
      return tempArr;
    }

    // console.log(props?.customFn, "vvvv");
    if (props?.customFn) {
      useMemo(async () => await props.customFn(), [state]);
    } else {
      useMemo(async () => {
        if (errors?.length) {
          const newErrors = await handleUpdateErrors();
          setErrors(newErrors);
          props?.setErrors && props.setErrors(newErrors);
        }
      }, []);
    }

    const handleAddField = () => {
      setSelectAll([]);
      dispatch({
        type: "ADD_FIELD",
        payload: props?.initialData,
      });
    };

    const handleRemoveField = (index) => {
      dispatch({ type: "REMOVE_FIELD", payload: index });
    };

    const handleChange = (
      index,
      fieldName,
      value,
      type,
      options,
      actualOptions
    ) => {
      const newErrors = errors.slice();
      if (newErrors?.[index]?.[fieldName].length) {
        newErrors[index][fieldName] = "";
      }
      if (type === "multiselect") {
        const temp = () => {
          if (value.find((option) => option.value === "4r#!9*/>>f"))
            return setSelectAll(
              selectAll.length === actualOptions.length ? [] : actualOptions
            );
          setSelectAll(value);
        };
        temp();
        dispatch({
          type: "UPDATE_FIELD",
          payload: {
            index,
            fieldName,
            value:
              value.find((option) => option.value === "4r#!9*/>>f") !==
              undefined
                ? selectAll.length === actualOptions.length
                  ? []
                  : [...actualOptions]
                : value,
          },
        });
      } else {
        dispatch({
          type: "UPDATE_FIELD",
          payload: { index, fieldName, value },
        });
      }

      setErrors(newErrors);
    };

    async function handleSubmit(event) {
      event?.preventDefault();
      const newErrors = await handleUpdateErrors();
      setErrors(newErrors);
      props?.setErrors && props.setErrors(newErrors);
      if (newErrors?.some((el) => Object.values(el)?.find((t) => t !== ""))) {
        return newErrors;
      }
      props?.handleSubmit(state, newErrors);
    }

    return (
      <form onSubmit={handleSubmit} ref={fieldRef}>
        {props?.hideAddBtn ? (
          <></>
        ) : (
          <Grid
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <MyButton
              startIcon={<AddIcon />}
              onClick={handleAddField}
              disabled={addDisabledFun && addDisabledFun(state)}
            >
              Add
            </MyButton>
          </Grid>
        )}
        {props?.showHeading && (
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: props?.hideAllSideButton ? "100%" : "85%",
              p: 1,
            }}
          >
            {inputData?.map((heading) => (
              <Grid
                xs={heading?.width ?? 6}
                sx={{
                  width: "100%",
                  height: "36px",
                  ...props?.headingStyle,
                  p: 1,
                  fontFamily:
                    heading.label.toLowerCase().includes("salary") &&
                    "Roboto, sans-serif",
                }}
                key={heading.label}
                item
              >
                {heading?.customHeading ?? heading.label}
              </Grid>
            ))}
          </Grid>
        )}
        {state.map((field, index) => (
          <Grid
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: props?.showPartition ? 1 : null,
            }}
          >
            <Grid
              container
              sx={{
                marginBottom: props?.rowGap ?? "20px",
                width: props?.hideAllSideButton
                  ? "100%"
                  : inputData?.some((el) => el?.type === "toggle")
                  ? "80%"
                  : "85%",
                bgcolor: props?.showPartition
                  ? "rgba(240, 240, 240, 0.5)"
                  : null,
                borderRadius: props?.showPartition ? 2 : null,
                pb: props?.showPartition ? 2 : null,
              }}
            >
              {inputData?.map((el, i) => {
                if (el?.type === "normal") {
                  return (
                    <Grid
                      key={i}
                      item
                      xs={el?.width ?? 6}
                      sx={{ width: "100%", p: 1, ...(el?.sx ?? {}) }}
                      {...el?.responsive}
                    >
                      <TextField
                        ref={ref}
                        variant="standard"
                        label={el?.required ? `${el?.label}*` : el?.label}
                        value={field[el?.name]}
                        onChange={(e) =>
                          handleChange(index, el?.name, e.target.value)
                        }
                        disabled={
                          typeof el?.disabled == "function"
                            ? el?.disabled(field) ?? false
                            : el?.disabled ?? false
                        }
                        multiline={el?.multiline}
                        minRows={el?.minRows}
                        maxRows={el?.maxRows}
                        sx={{ width: "100%" }}
                        error={
                          errors?.length
                            ? !!errors[index]?.[el?.name]?.length
                            : false
                        }
                        helperText={
                          errors?.length ? errors[index]?.[el?.name] : ""
                        }
                        inputProps={{
                          maxLength: el?.maxLength ?? null,
                        }}
                        style={{ marginRight: "10px" }}
                      />
                    </Grid>
                  );
                }
                if (el?.type === "select") {
                  const op = el?.options(field, state);
                  return (
                    <Grid
                      key={i}
                      item
                      xs={el?.width ?? 6}
                      sx={{ width: "100%", p: 1, ...(el?.sx ?? {}) }}
                      {...el?.responsive}
                    >
                      <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                        <InputLabel
                          sx={{
                            color:
                              errors?.length &&
                              errors[index]?.[el?.name]?.length
                                ? "#d04343"
                                : null,
                          }}
                          id={`${el?.label}${i}`}
                        >
                          {el?.required ? `${el?.label}*` : el?.label}
                        </InputLabel>
                        <Select
                          ref={ref}
                          labelId={`${el?.label}${i}`}
                          value={field[el?.name]}
                          disabled={
                            typeof el?.disabled == "function"
                              ? el?.disabled(field) ?? false
                              : el?.disabled ?? false
                          }
                          //   label={el?.age}
                          onChange={(e) => {
                            handleChange(index, el?.name, e.target.value);
                            el?.handleChange &&
                              el?.handleChange(e.target.value, field);
                          }}
                          error={
                            errors?.length
                              ? !!errors[index]?.[el?.name]?.length
                              : false
                          }
                        >
                          {op?.map((opt, ind) => (
                            <MenuItem
                              disabled={
                                opt?.disabled ||
                                (opt?.disFun &&
                                  opt.disFun(opt?.key, field[el?.name], state))
                              }
                              key={ind}
                              value={opt?.value}
                            >
                              {opt?.key}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: "#d04343" }}>
                          {errors?.length ? errors[index]?.[el?.name] : ""}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  );
                }
                if (el?.type === "checkbox") {
                  return (
                    <Grid
                      key={i}
                      item
                      xs={el?.width ?? 6}
                      sx={{ width: "100%", p: 1, ...(el?.sx ?? {}) }}
                      {...el?.responsive}
                    >
                      <FormControlLabel
                        required={el?.required}
                        sx={{
                          pt: 1,
                          color: "text.secondary",
                        }}
                        control={
                          <Checkbox
                            ref={ref}
                            disabled={
                              typeof el?.disabled == "function"
                                ? el?.disabled(field) ?? false
                                : el?.disabled ?? false
                            }
                            checked={field[el?.name]}
                            sx={{
                              color:
                                errors?.length &&
                                errors[index]?.[el?.name]?.length
                                  ? "#d04343"
                                  : null,
                            }}
                            onChange={(e) => {
                              handleChange(index, el?.name, e.target.checked);
                              el?.handleChange &&
                                el?.handleChange(e.target.checked, field);
                            }}
                          />
                        }
                        label={el?.required ? `${el?.label}*` : el?.label}
                      />
                    </Grid>
                  );
                }
                if (el?.type === "multiselect") {
                  const op = el.options(field) ?? [];

                  return (
                    <Grid
                      key={i}
                      item
                      xs={el?.width ?? 6}
                      sx={{ width: "100%", p: 1, ...(el?.sx ?? {}) }}
                      {...el?.responsive}
                    >
                      <Autocomplete
                        multiple
                        options={op}
                        disableCloseOnSelect
                        limitTags={2}
                        getOptionLabel={(option) => option.key}
                        isOptionEqualToValue={(option, value) =>
                          option.key === value.key
                        }
                        value={field[el?.name]}
                        filterOptions={(options, params) => {
                          const filter = createFilterOptions();
                          const filtered = filter(options, params);
                          return [
                            { key: "Select All", value: "4r#!9*/>>f" },
                            ...filtered,
                          ];
                        }}
                        disabled={
                          typeof el?.disabled == "function"
                            ? el?.disabled(field) ?? false
                            : el?.disabled ?? false
                        }
                        onChange={(event, newValue, e, option) => {
                          handleChange(
                            index,
                            el?.name,
                            newValue,
                            el?.type,
                            option,
                            op
                          );
                          el?.handleChange &&
                            el?.handleChange(newValue, field, state, index);
                        }}
                        renderOption={(props, option, { selected }) => {
                          return (
                            <li {...props}>
                              <Checkbox
                                ref={ref}
                                icon={icon}
                                required={el?.required}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={
                                  option.value === "4r#!9*/>>f"
                                    ? selectAll?.length > 1 &&
                                      !!(selectAll.length === op?.length)
                                    : selected
                                }
                                disabled={option?.disable}
                              />
                              {option.key}
                            </li>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            ref={ref}
                            variant="standard"
                            sx={{ width: "100%" }}
                            {...params}
                            label={el?.required ? `${el?.label}*` : el?.label}
                            error={
                              errors?.length
                                ? !!errors[index]?.[el?.name]?.length
                                : false
                            }
                            helperText={
                              errors?.length ? errors[index]?.[el?.name] : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                  );
                }
                if (el?.type === "date") {
                  return (
                    <Grid
                      key={i}
                      item
                      xs={el?.width ?? 6}
                      sx={{ width: "100%", p: 1, ...(el?.sx ?? {}) }}
                      {...el?.responsive}
                    >
                      <DesktopDatePicker
                        PopperProps={{
                          sx: {
                            ".MuiPickersCalendarHeader-root": {
                              backgroundColor: "#8C4AF2",
                              marginTop: 0,
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              maxHeight: "50px",
                              color: "#fff",
                            },

                            ".css-zhnlj8-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
                              {
                                backgroundColor: "primary.main !important",
                              },

                            ".css-1tkx1wf-MuiSvgIcon-root-MuiPickersCalendarHeader-switchViewIcon":
                              {
                                color: "text.contrasPrimary",
                              },
                            ".css-i4bv87-MuiSvgIcon-root": {
                              color: "text.contrasPrimary",
                            },
                            ".css-ec3312-MuiTypography-root-PrivatePickersMonth-root.Mui-selected":
                              {
                                backgroundColor: "primary.main !important",
                              },
                            ".css-1nt6dw2-PrivatePickersYear-button.Mui-selected":
                              {
                                backgroundColor: "primary.main !important",
                              },
                          },
                        }}
                        maxDate={
                          ((typeof el?.maxDate == "function" &&
                            el?.maxDate(field)) ||
                            el?.maxDate) ??
                          ""
                        }
                        minDate={
                          ((typeof el?.minDate == "function" &&
                            el?.minDate(field)) ||
                            el?.minDate) ??
                          ""
                        }
                        disabled={
                          typeof el?.disabled == "function"
                            ? el?.disabled(field) ?? false
                            : el?.disabled ?? false
                        }
                        onChange={(e) => {
                          handleChange(
                            index,
                            el?.name,
                            moment(e).isValid()
                              ? moment(e, "DDMMYYYY").format("DD-MM-YYYY")
                              : ""
                          );
                        }}
                        views={["year", "month", "day"]}
                        name={el?.name}
                        inputFormat="DD/MM/YYYY"
                        label={el?.required ? `${el?.label}*` : el?.label}
                        value={
                          field[el?.name]
                            ? moment(field[el?.name], "DD-MM-YYYY")
                            : null
                        }
                        renderInput={(e) => {
                          e.error =
                            errors?.length && errors[index]?.[el?.name]?.length
                              ? true
                              : false;
                          return (
                            <TextField
                              ref={ref}
                              {...e}
                              name={el?.name}
                              size="small"
                              variant={"standard"}
                              InputLabelProps={{
                                sx: { textTransform: "capitalize" },
                              }}
                              sx={{
                                minWidth: "100%",
                                fontSize: "18px",
                                "&:hover:not(.Mui-disabled):not(.mui):before": {
                                  borderBottom: "2px solid",
                                  borderColor: "border.primary",
                                },
                              }}
                              helperText={
                                errors?.length ? errors[index]?.[el?.name] : ""
                              }
                              onKeyDown={(keyEvent) => {
                                if (
                                  keyEvent.key !== "Tab" &&
                                  keyEvent.key !== "Enter"
                                ) {
                                  return keyEvent.preventDefault();
                                }
                              }}
                            />
                          );
                        }}
                      />
                    </Grid>
                  );
                }
                if (el?.type === "time") {
                  return (
                    <Grid
                      key={i}
                      item
                      xs={el?.width ?? 6}
                      sx={{ width: "100%", p: 1, ...(el?.sx ?? {}) }}
                      {...el?.responsive}
                    >
                      <DesktopTimePicker
                        maxTime={
                          ((typeof el?.maxTime == "function" &&
                            el?.maxTime(field)) ||
                            el?.maxTime) ??
                          ""
                        }
                        disabled={
                          typeof el?.disabled == "function"
                            ? el?.disabled(field) ?? false
                            : el?.disabled ?? false
                        }
                        minTime={
                          ((typeof el?.minTime == "function" &&
                            el?.minTime(field)) ||
                            el?.minTime) ??
                          ""
                        }
                        onChange={(e) => {
                          el?.handleTime &&
                            el?.handleTime(
                              moment(e).isValid() ? moment(e).toISOString() : ""
                            );
                          handleChange(
                            index,
                            el?.name,
                            moment(e).isValid() ? moment(e).toISOString() : ""
                          );
                        }}
                        name={el?.name}
                        value={
                          field[el?.name]
                            ? moment(field[el?.name]).toISOString()
                            : null
                        }
                        inputFormat={el?.inputFormat ?? "HH:mm"}
                        label={el?.required ? `${el?.label}*` : el?.label}
                        renderInput={(e) => {
                          e.error =
                            errors?.length && errors[index]?.[el?.name]?.length
                              ? true
                              : false;
                          return (
                            <TextField
                              ref={ref}
                              {...e}
                              name={el?.name}
                              size="small"
                              variant="standard"
                              helperText={
                                errors?.length ? errors[index]?.[el?.name] : ""
                              }
                              InputLabelProps={{
                                sx: { textTransform: "capitalize" },
                              }}
                              sx={{
                                width: "100%",
                                fontSize: "18px",
                                "&:hover:not(.Mui-disabled):not(.mui):before": {
                                  borderBottom: "2px solid",
                                  borderColor: "border.primary",
                                },
                              }}
                              onKeyDown={(keyEvent) => {
                                if (
                                  keyEvent.key !== "Tab" &&
                                  keyEvent.key !== "Enter"
                                ) {
                                  return keyEvent.preventDefault();
                                }
                              }}
                            />
                          );
                        }}
                      />
                    </Grid>
                  );
                }
              })}
            </Grid>
            {props?.hideAllSideButton ? null : (
              <Grid
                sx={{
                  width: "15%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {inputData?.some((el) => el?.type === "toggle") && (
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {inputData?.map((el, i) => {
                      if (el?.type === "toggle") {
                        return (
                          <Grid
                            key={i}
                            item
                            xs={el?.width ?? 6}
                            sx={{ width: "100%", p: 1 }}
                            {...el?.responsive}
                          >
                            <Switch
                              ref={ref}
                              checked={field[el?.name]}
                              onChange={(e) => {
                                handleChange(index, el?.name, e.target.checked);
                                el?.isChecked &&
                                  el?.isChecked(field, state, e, index);
                              }}
                            />
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                )}
                {props?.hideAddBtn && (
                  <IconButton size="small" onClick={handleAddField}>
                    <AddCircleOutlineOutlinedIcon
                      fontSize="small"
                      color={"warning"}
                    />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveField(index)}
                  disabled={state?.length < 2 ? true : false}
                  sx={{
                    visibility:
                      (props?.condition ? props?.condition(field) : false) ||
                      (props?.hideRemoveIcon && state?.length < 2)
                        ? "hidden"
                        : null,
                  }}
                >
                  <RemoveCircleOutlineIcon
                    fontSize="small"
                    color={state?.length < 2 ? "" : "warning"}
                  />
                </IconButton>
              </Grid>
            )}
          </Grid>
        ))}
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
          }}
        >
          {props?.additionalButtons && props?.additionalButtons()}
          {props?.hideSubmitBtn ? (
            <>
              <button
                type="submit"
                ref={formRef}
                style={{ display: "none" }}
              ></button>
            </>
          ) : (
            <MyButton type="submit">
              {props?.isLoading ? (
                <CircularProgress size={25} sx={{ color: "white" }} />
              ) : props?.btnText ? (
                props?.btnText
              ) : (
                "Submit"
              )}
            </MyButton>
          )}
        </Grid>
      </form>
    );
  }
); //

export default DynamicForm;
