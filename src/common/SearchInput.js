import { MenuItem, Select, TextField } from "@mui/material";
import React, { useRef } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseIcon from "@mui/icons-material/Close";
// import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

export default function SearchInput({
  sx,
  setHideBtn,
  width,
  searchOpt,
  selectValue,
  selectOnChange,
  ...props
}) {
  const myRef = useRef("");
  const myRef2 = useRef("");
  return (
    <>
      {/* for mobile */}
      <TextField
        size="small"
        sx={{
          display: { xs: "block", sm: "none" },
          width: props?.hideBtn ? "100%" : "20px",
          transition: "0.5s",
          ".css-kf507o-MuiInputBase-root-MuiOutlinedInput-root": {
            paddingLeft: "4px",
            paddingRight: "0px",
          },
        }}
        inputProps={{
          sx: {
            "&::placeholder": {
              textTransform: "capitalize",
            },
            "&::-webkit-search-cancel-button": {
              cursor: "pointer",
            },
          },
        }}
        onClick={() => {
          setHideBtn && setHideBtn(true);
        }}
        onBlur={() => {
          setHideBtn && setHideBtn(false);
        }}
        InputProps={{
          ref: myRef2,
          startAdornment: (
            <SearchOutlinedIcon
              onClick={() => myRef2.current.children[1].focus()}
              sx={{
                width: props?.hideBtn ? "20px" : "16px",
                opacity: "0.7",
                textTransform: "capitalize",
              }}
            />
          ),
          sx: {
            borderRadius: "4px",
            width: props?.hideBtn ? "100%" : "40px",
          },
        }}
        {...props}
      />
      {/* for mobile */}
      {/* for laptop */}
      <TextField
        size="small"
        sx={{
          display: { xs: "none", sm: "block" },
          width: searchOpt?.length ? "320px" : width ? width : "230px",
          ".css-kf507o-MuiInputBase-root-MuiOutlinedInput-root": {
            paddingLeft: "0px",
            paddingRight: "0px",
          },
        }}
        InputProps={{
          ref: myRef,
          sx: {
            borderRadius: "4px",
          },
          endAdornment: searchOpt?.length ? (
            <SearchOutlinedIcon
              onClick={() => myRef.current.children[1].focus()}
              sx={{
                width: "28px",
                p: "3px 0px",
                opacity: "0.7",
                textTransform: "capitalize",
                display: { xs: "none", sm: "block" },
              }}
            />
          ) : null,
          startAdornment: searchOpt?.length ? (
            <Select
              value={selectValue || ""}
              onChange={(e) => {
                selectOnChange && selectOnChange(e.target.value);
              }}
              sx={{
                maxWidth: "130px",
                fontSize: "14px",
                borderRadius: "0px",
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  boxShadow: "none",
                  border: 0,
                },
              }}
            >
              {searchOpt?.length &&
                searchOpt?.map((d) => {
                  return (
                    <MenuItem key={d.key} value={d.value}>
                      {d.key}
                    </MenuItem>
                  );
                })}
            </Select>
          ) : (
            <SearchOutlinedIcon
              onClick={() => myRef.current.children[1].focus()}
              sx={{
                width: "28px",
                p: "0px 3px",
                opacity: "0.7",
                textTransform: "capitalize",
                display: { xs: "none", sm: "block" },
              }}
            />
          ),
        }}
        {...props}
      />
    </>
  );
}

export const SearchInput2 = (props) => {
  const { value, clearSearch, ...restProps } = props;

  const myRef = useRef("");

  return (
    <TextField
      size="small"
      inputProps={{
        sx: {
          height: "27px",
          py: "4px",
          "&::placeholder": {
            textTransform: "capitalize",
          },
          "&::-webkit-search-cancel-button": {
            cursor: "pointer",
          },
        },
      }}
      InputProps={{
        ref: myRef,
        endAdornment:
          value && value?.trim() !== "" ? (
            <CloseIcon
              onClick={() => {
                clearSearch();
                myRef.current.children[0].focus();
              }}
              sx={(theme) => ({
                width: "24px",
                mr: "4px",
                color: `${theme.palette.disable.light}80`,
                textTransform: "capitalize",
                p: "0px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "background.card2",
                  border: "1px solid",
                  borderColor: `${theme.palette.disable.light}60`,
                },
              })}
            />
          ) : (
            <SearchOutlinedIcon
              onClick={() => myRef.current.children[0].focus()}
              sx={{
                width: "28px",
                p: "0px 3px",
                opacity: "0.4",
                textTransform: "capitalize",
              }}
            />
          ),
        sx: {
          borderRadius: "4px",
          px: "0px",
          // ".MuiSvgIcon-root": {},
        },
      }}
      {...restProps}
      value={value}
    />
  );
};
