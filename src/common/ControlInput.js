import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { default as CheckBoxOutlineBlankIcon } from "@mui/icons-material/CheckBoxOutlineBlank";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useField, useFormikContext } from "formik";
import moment from "moment";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import ToastHandler from "./ToastHandler";
import DataStyle from "./DataStyle";

const toISOFormat = (date, format) => {
  return moment(date, format || "DDMMYYYY").format("YYYY-MM-DD");
};

const ControlInput = {
  Normal: forwardRef((props, ref) => {
    return (
      <MyInput
        {...props}
        ref={ref}
        inputProps={{
          sx: {
            "&::placeholder": {
              textTransform: "capitalize",
            },
          },
        }}
        InputLabelProps={{
          ...props.InputLabelProps,
          sx: { textTransform: "capitalize" },
        }}
      />
    );
  }),
  checkBox: forwardRef((props, ref) => {
    return <ChackBoxComp {...props} ref={ref} />;
  }),
  Multiple: forwardRef((props, ref) => {
    return <MultipleSelect {...props} ref={ref} />;
  }),
  Date: forwardRef((props, ref) => {
    return (
      <DatePicker
        {...props}
        ref={ref}
        InputLabelProps={{ sx: { textTransform: "capitalize" } }}
      />
    );
  }),
  Select: forwardRef((props, ref) => {
    return (
      <SelectType
        {...props}
        ref={ref}
        inputProps={{
          sx: {
            "&::placeholder": {
              textTransform: "capitalize",
            },
          },
        }}
      />
    );
  }),
  SearchSelect: forwardRef((props, ref) => {
    return <SearchSelectType {...props} ref={ref} />;
  }),
  Password: forwardRef((props, ref) => {
    const [type, setType] = useState(false);
    return (
      <MyInput
        variant="standard"
        {...props}
        ref={ref}
        type={type ? "text" : "password"}
        inputProps={{
          maxLength: props?.maxLength ?? null,
          sx: {
            "&::placeholder": {
              textTransform: "capitalize",
            },
          },
        }}
        InputLabelProps={{ sx: { textTransform: "capitalize" } }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                mb:
                  props?.variant === "outlined"
                    ? "0px"
                    : props?.bottom
                    ? props.bottom
                    : "10px",
              }}
            >
              <IconButton
                size="small"
                aria-label="toggle password visibility"
                onClick={() => {
                  setType((prev) => !prev);
                }}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
                sx={{ bgcolor: "background.card2" }}
              >
                {type ? (
                  <Visibility fontSize="small" />
                ) : (
                  <VisibilityOff fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }),
};

export default ControlInput;

const MyInput = React.forwardRef((props, ref) => {
  const {
    sx,
    name,
    handler,
    label,
    handelchange,
    helperMsg = "",
    error,
    ...rest
  } = props;
  const { handleBlur, handleChange, errors, values, touched, setFieldValue } =
    handler;

  useEffect(() => {
    if (rest?.val) {
      setFieldValue(name, rest?.val);
    }
  }, [rest?.val]);
  return (
    <TextField
      label={label ? (props?.validation?.required ? `${label} *` : label) : ""}
      size="small"
      variant={props.variant ? props.variant : "standard"}
      name={name}
      ref={(el) => ref && (ref.current[name] = el)}
      onBlur={handleBlur}
      onChange={(v) => {
        handleChange(v);
        handelchange && handelchange(v);
      }}
      value={props?.img ? values[`${name}`] : values?.[`${name}`] ?? ""}
      error={error ? error : touched[`${name}`] && Boolean(errors[`${name}`])}
      helperText={
        error ? error : (touched[`${name}`] && errors[`${name}`]) || helperMsg
      }
      sx={{
        width: "100%",
        fontSize: "18px",
        "&:hover:not(.Mui-disabled):not(.mui):before": {
          borderBottom: "2px solid",
          borderColor: "border.primary",
        },
        "&.Mui-error": {
          color: "text.secondary",
        },
        ...sx,
      }}
      {...rest}
    />
  );
});

const ChackBoxComp = React.forwardRef((props, ref) => {
  const { sx, name, values, label, setValues, ...rest } = props;
  // const { handleBlur, handleChange, errors, values, touched } = handler;
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={values}
          size="small"
          name={name}
          onChange={(e) => {
            values ? setValues(false) : setValues(true);
          }}
          {...rest}
          sx={{ ...sx }}
        />
      }
      label={label ? (props?.validation?.required ? `${label} *` : label) : ""}
    />
  );
});

const SelectType = forwardRef((props, ref) => {
  const {
    sx,
    name,
    handler,
    disable,
    options,
    label,
    validation,
    handelchange,
    isEmptyOnOptionChange,
    error,
    helperMsg,
    helperText,
    ...rest
  } = props;
  const { handleBlur, errors, values, touched } = handler;
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  useMemo(
    () => handelchange && handelchange(values[`${name}`]),
    [values[`${name}`]]
  );

  const handleCheckOptions = () => {
    if (values[`${name}`] && Array.isArray(options)) {
      const temp = options?.some((d) => {
        return d.value == values[`${name}`];
      });
      if (!temp) {
        setFieldValue(field.name, "");
      }
    }
  };

  useMemo(() => {
    if (isEmptyOnOptionChange) {
      if (rest?.checkKey && options != rest?.checkKey) {
        handleCheckOptions();
      } else {
        handleCheckOptions();
      }
    }
  }, [options]);

  return (
    <FormControl
      variant="standard"
      error={touched[`${name}`] && Boolean(errors[`${name}`])}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "flex-end",
      }}
    >
      {label ? (
        <InputLabel
          sx={{
            color:
              touched[`${name}`] && Boolean(errors[`${name}`]) && "#da4e4e",
          }}
        >
          {label ? (validation?.required ? `${label} *` : label) : ""}
        </InputLabel>
      ) : null}
      <Select
        size="small"
        variant={"standard"}
        name={name}
        displayEmpty={label ? false : true}
        ref={(el) => (ref.current[name] = el)}
        value={values[`${name}`] ?? ""}
        label={label ? (validation?.required ? `${label} *` : label) : ""}
        onChange={(e) => {
          handelchange && handelchange(e.target.value);
          setFieldValue(field.name, e.target.value);
        }}
        error={
          error
            ? error
            : (touched[`${name}`] || props?.inline) &&
              Boolean(errors[`${name}`])
        }
        helperText={
          error ? error : (touched[`${name}`] && errors[`${name}`]) || helperMsg
        }
        onBlur={handleBlur}
        sx={{
          width: "100%",
          color:
            (touched[`${name}`] || props?.inline) &&
            Boolean(errors[`${name}`]) &&
            "#da4e4e",
          "&:hover:not(.Mui-disabled):not(.mui):before": {
            borderBottom: "2px solid",
            borderColor: "border.primary",
          },
          "&.Mui-error": {
            color: "text.secondary",
          },

          ...sx,
        }}
        {...rest}
      >
        {Array.isArray(options) &&
          options.map((option, i) => (
            <MenuItem
              key={i}
              disabled={i == disable || option.disable}
              value={option.value}
              title={option.description || ""}
            >
              <DataStyle sx={{ color: "text.primary", fontSize: "1rem" }}>
                {option.key}
              </DataStyle>
            </MenuItem>
          ))}
      </Select>
      <Typography
        sx={{ fontSize: "12px" }}
        color={
          (touched[`${name}`] || props?.inline) && errors[`${name}`]
            ? "error"
            : "text.disable"
        }
      >
        {((touched[`${name}`] || props?.inline) && errors[`${name}`]) ||
          helperText}
      </Typography>
    </FormControl>
  );
});

const SearchSelectType = forwardRef((props, ref) => {
  const { sx, name, label, handler, options, handelchange, ...rest } = props;
  const { handleBlur, errors, values, touched } = handler;
  const { setFieldValue } = useFormikContext();

  return (
    <Autocomplete
      name={name}
      clearIcon={rest?.loading ? null : undefined}
      // freeSolo
      options={options}
      inputprops={{
        sx: {
          "&::placeholder": {
            textTransform: "capitalize",
          },
        },
      }}
      disabled={props?.disabled}
      onBlur={handleBlur}
      getOptionLabel={(option) => {
        return option?.label || option;
      }}
      value={values[name]}
      onChange={(e, value) => {
        handelchange && handelchange(value);
        setFieldValue(name, value ? value : "");
      }}
      getOptionDisabled={(option) => option === ""}
      sx={{
        "& .MuiInputBase-root": {
          height: 46,
          pt: 2,
          m: 0,
        },
        textTransform: "capitalize",
        ...sx,
      }}
      {...rest}
      renderInput={(params) => (
        <TextField
          size="small"
          variant="standard"
          ref={(el) => (ref.current[name] = el)}
          label={
            label ? (props?.validation?.required ? `${label} *` : label) : ""
          }
          name={name}
          error={touched[`${name}`] && Boolean(errors[`${name}`])}
          helperText={touched[`${name}`] && errors[`${name}`]}
          {...params}
          {...rest}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {rest?.loading ? (
                  <CircularProgress
                    sx={{ color: "primary.main", mb: 2 }}
                    size={20}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
});

const DatePicker = forwardRef((props, ref) => {
  const { name, handler, label, helperText, ...rest } = props;
  const { handleBlur, errors, values, touched } = handler;
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  //hhhh//h
  const dateFun = (e, v) => {
    v && ToastHandler("warn", "Please Select a valid date");
    props?.handleDate && props.handleDate(e);
    setFieldValue(field.name, e);
  };

  useMemo(() => {
    if (values[name] && !props?.noMinMaxCheck) {
      const min = props?.minDate
        ? moment(toISOFormat(props?.minDate)).valueOf()
        : false;
      const max = props?.maxDate
        ? moment(toISOFormat(props?.maxDate)).valueOf()
        : false;

      const curr =
        typeof values[name] === "string"
          ? moment(values[name]).valueOf()
          : moment(toISOFormat(values[name])).valueOf();

      // const curr = moment(toISOFormat(values[name])).valueOf();

      if (isNaN(curr)) return;

      if (props?.minDate && props?.maxDate && !isNaN(min) && !isNaN(max)) {
        !(min <= curr && max >= curr) && dateFun(null, true);
      } else if (props?.minDate && !isNaN(min)) {
        !(min <= curr) && dateFun(null, true);
      } else if (props?.maxDate && !isNaN(max)) {
        !(max >= curr) && dateFun(null, true);
      }
    }
  }, [props?.minDate, props?.maxDate, values[name]]);

  return (
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

          ".css-zhnlj8-MuiButtonBase-root-MuiPickersDay-root.Mui-selected": {
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
          ".css-1nt6dw2-PrivatePickersYear-button.Mui-selected": {
            backgroundColor: "primary.main !important",
          },
        },
      }}
      onChange={(e) => {
        dateFun(moment(e).isValid() ? moment(e).toDate() : null);
      }}
      views={["year", "month", "day"]}
      name={name}
      value={
        moment(values[name]).isValid() ? moment(values[name]).toDate() : null
      }
      inputFormat={props?.inputFormat ?? "DD/MM/YYYY"}
      {...rest}
      ref={(el) => (ref.current[name] = el)}
      label={label ? (props?.validation?.required ? `${label} *` : label) : ""}
      renderInput={(e) => {
        e.error =
          (touched[`${name}`] || props?.inline) && Boolean(errors[`${name}`]);

        return (
          <TextField
            onClick={(e) =>
              ref.current[
                name
              ]?.childNodes[1]?.childNodes[1]?.childNodes[0]?.click()
            }
            size="small"
            variant={"standard"}
            onBlur={handleBlur}
            helperText={
              ((touched[`${name}`] || props?.inline) && errors[`${name}`]) ||
              rest?.helperMsg ||
              helperText
            }
            name={name}
            InputLabelProps={{ sx: { textTransform: "capitalize" } }}
            readOnly={true}
            sx={{
              minWidth: "100%",
              fontSize: "18px",
              "&:hover:not(.Mui-disabled):not(.mui):before": {
                borderBottom: "2px solid",
                borderColor: "border.primary",
              },
            }}
            {...e}
            {...rest}
            onKeyDown={(keyEvent) => {
              if (keyEvent.key !== "Tab" && keyEvent.key !== "Enter") {
                return keyEvent.preventDefault();
              }
            }}
          />
        );
      }}
    />
  );
});

const MultipleSelect = forwardRef((props, ref) => {
  const {
    name,
    handler,
    options,
    label,
    handelchange,
    error,
    helperText,
    isEmptyOnOptionChange,
    ...rest
  } = props;
  const { handleBlur, touched, errors, values } = handler;

  const [close, setClose] = useState(false);

  const [field] = useField(props);
  const myRef = useRef(null);

  const { setFieldValue } = useFormikContext();
  const filter = createFilterOptions();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  if (options?.length && options?.[0]?.key?.toLowerCase() == "select all") {
    options.shift();
  }

  const calWidth = () => {
    if (values[name]?.length) {
      let count = 0;
      let max = myRef.current?.offsetWidth - 90;
      let myWidth = 0;
      values[name]?.forEach((v) => {
        if (max > myWidth) {
          let p = v?.key?.length || 0;
          myWidth = myWidth + p * 8 + 36;
          if (myWidth < max) count++;
        }
      });
      return count || 1;
    } else {
      return 1;
    }
  };

  const handleChange = (place, value, e, option) => {
    if (!option?.option?.disable) {
      if (option?.option?.value === "4r#!9*/>>f") {
        if (
          options?.filter((obj) => !obj?.disable)?.length ==
          values[name]?.filter((obj) => !obj?.disable)?.length
        ) {
          setFieldValue(name, []);
          handelchange && handelchange([]);
        } else {
          setFieldValue(
            name,
            options?.filter((obj) => !obj?.disable)
          );
          handelchange && handelchange(options);
        }
      } else {
        setFieldValue(name, value);
        handelchange && handelchange(value);
      }
    }
  };
  const checkSelectAll = () => {
    if (
      options?.filter((obj) => !obj?.disable)?.length ==
      values[name]?.filter((obj) => !obj?.disable)?.length
    ) {
      return true;
    }
    return false;
  };

  useMemo(() => {
    if (isEmptyOnOptionChange) {
      if (values[`${name}`]) {
        const tempOptions = [];
        values[`${name}`]?.forEach((elem) => {
          let test = options.some((d) => d.value === elem.value);
          if (test) tempOptions.push(elem);
        });
        setFieldValue(field.name, tempOptions);
      }
    }
  }, [options]);

  return (
    <Autocomplete
      ListboxProps={{ style: { maxHeight: 230, overflow: "auto" } }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      limitTags={props?.limitTags ? props?.limitTags : calWidth()}
      disabled={props?.disabled}
      ref={myRef}
      multiple
      size="small"
      options={options}
      disableCloseOnSelect
      name={name}
      value={values[name]}
      getOptionLabel={(option) => option.key}
      onBlur={(e) => {
        setClose(false);
        handleBlur(e);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        if (options?.length) {
          return [{ key: "Select All", value: "4r#!9*/>>f" }, ...filtered];
        }
        return filtered;
      }}
      renderOption={(props, option, { selected }) => {
        const selectAllProps =
          option.value === "4r#!9*/>>f" ? { checked: checkSelectAll() } : {};

        return (
          <li {...props} style={{ color: option?.disable && "#8b8e9d" }}>
            <Checkbox
              sx={{
                m: 0,
              }}
              value={option.key}
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
              disabled={option?.disable}
              {...selectAllProps}
            />
            {option.key}
          </li>
        );
      }}
      onFocus={() => {
        setClose(true);
      }}
      onChange={props?.onChange ? props.onChange : handleChange}
      renderInput={(params) => (
        <TextField
          variant="standard"
          {...params}
          {...rest}
          label={
            label ? (props?.validation?.required ? `${label} *` : label) : ""
          }
          ref={(el) => (ref.current[name] = el)}
          name={name}
          error={
            error
              ? error
              : (touched[`${name}`] || props?.inline) &&
                Boolean(errors[`${name}`])
          }
          helperText={
            helperText
              ? helperText
              : (touched[`${name}`] || props?.inline) && errors[`${name}`]
          }
        />
      )}
      // sx={{
      //   ".css-i4bv87-MuiSvgIcon-root": {
      //     fontSize: "2.0rem",
      //   },
      // }}
      renderTags={(value, getTagProps) => {
        return close ? (
          <Grid
            sx={{
              maxHeight: "80px",
              mb: "4px",
              overflowX: "scroll",
              "&::-webkit-scrollbar": {
                width: "4px",
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

              /* For Firefox */
              scrollbarColor: "border.scroll",
              scrollbarWidth: "thin",
            }}
          >
            {value?.map((option, index) => (
              <Chip
                key={option?.key + index}
                sx={{ mb: "5px" }}
                size="small"
                label={option.key}
                {...getTagProps({ index })}
              />
            ))}
          </Grid>
        ) : (
          value?.map((option, index) => (
            <Chip
              key={option?.key + index}
              sx={{ mb: "5px" }}
              size="small"
              label={option.key}
              {...getTagProps({ index })}
            />
          ))
        );
      }}
      loading={rest?.loading}
    />
  );
});
