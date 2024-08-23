import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DataStyle from "../DataStyle";
import ValidationType, { SearchValidation } from "../ValidationType";
import MyIconButton from "../MyIconButton";
import image from "../Assets/EmptyRow.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import * as Yup from "yup";
import { Formik } from "formik";
import { AllActions, AllStateContext } from "./Reducer";
import { useContext, useMemo, useRef, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { SearchInput2 } from "../SearchInput";

// ------------------ Table components ----------------------

export const MainTableComp = (props) => {
  const { AllData, view, editing, ...rest } = props;
  const { TableData } = AllData;

  return (
    <Grid
      sx={{
        width: "100%",
        minHeight: "100%",
        overflow: "auto",
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
      }}
    >
      {view?.length || editing?.new === true ? (
        <>
          {useMemo(() => {
            const TableDataFun = () => {
              if (editing?.new === true) {
                if (!TableData.find((r) => r.action))
                  TableData.push({
                    action: true,
                    name: "Action",
                    customBody: () => <></>,
                  });
              }

              return TableData;
            };

            return (
              <MainTableCompReturn
                TableData={TableDataFun()}
                view={view}
                editing={editing}
                {...rest}
              />
            );
          }, [TableData, view, editing, rest])}
        </>
      ) : (
        <Grid
          component="span"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            py: "80px",
          }}
        >
          <Grid
            component="img"
            src={image}
            sx={{
              mx: "auto",
              width: "20%",
              mb: "10px",
              mt: "10px",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            No Data Found
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

const MainTableCompReturn = ({
  TableData,
  width,
  view,
  editing,
  dispatch,
  selectedKey,
  data,
  colorRow,
}) => {
  const { count, selected } = useContext(AllStateContext);
  let TableSize = "40px";

  return (
    <Grid
      component={Table}
      id="printPdf@123"
      size="small"
      sx={{
        width: width.max,
        minWidth: "100%",
        height: count > 1 ? "calc(100% - 50px)" : "100%",
      }}
    >
      {useMemo(() => {
        const checkHeadHandel = () => {
          if (data && data?.length) {
            if (selected?.length) {
              dispatch({ action: AllActions.selected, value: [] });
            } else {
              const temp = [];
              data.forEach((v) => {
                temp.push(v);
              });
              dispatch({ action: AllActions.selected, value: temp });
            }
          }
        };

        return (
          <MyTableHead
            TableData={TableData}
            width={width}
            TableSize={TableSize}
            checkHeadHandel={checkHeadHandel}
            selected={selected}
            AllSelect={selected?.length && selected?.length === data?.length}
            dispatch={dispatch}
          />
        );
      }, [TableData, width, TableSize, data, selected, dispatch])}

      {useMemo(
        () => (
          <MyTableBody
            TableData={TableData}
            width={width}
            TableSize={TableSize}
            data={view}
            editing={editing}
            selectedKey={selectedKey}
            dispatch={dispatch}
            colorRow={colorRow}
          />
        ),
        [TableData, width, TableSize, view, editing, selectedKey, dispatch]
      )}
    </Grid>
  );
};

const MyTableHead = ({ TableData, width, TableSize, ...rest }) => {
  return (
    <TableHead
      sx={{
        height: TableSize,
        // bgcolor: "background.card2",
        minWidth: width.min || "900px",
      }}
    >
      <TableRow>
        {TableData.map((v, i) => {
          let Freeze = v.freezeFirst
            ? {
                position: "sticky",
                left: 0,
                zIndex: 1,
                backgroundColor: "#fff",
              }
            : v.freezeLast
            ? {
                position: "sticky",
                right: 0,
                zIndex: 1,
                backgroundColor: "#fff",
              }
            : {};

          return (
            <MyTableHeadComp
              key={i}
              Freeze={Freeze}
              v={v}
              i={i}
              TableSize={TableSize}
              {...rest}
            />
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const MyTableHeadComp = ({
  Freeze,
  checkHeadHandel,
  selected,
  AllSelect,
  dispatch,
  v,
  i,
  TableSize,
}) => {
  const { sortKey, sortType } = useContext(AllStateContext);

  const handleSort = () => {
    if (v?.key === sortKey) {
      dispatch({ action: AllActions.sortTypeOpp });
    } else {
      dispatch({
        action: AllActions.Changes,
        value: { sortKey: v?.key, sortType: "asc" },
      });
    }
  };

  if (v.skipShow) {
    return <></>;
  }

  if (v.checkbox) {
    return (
      <TableCell
        key={i}
        sx={{
          p: "0",
          pl: "8px",
          width: v?.size?.size || "40px",
          minWidth: v?.size?.min,
          maxWidth: v?.size?.max,
          height: TableSize,
          boxSizing: "border-box",
          border: "none",
          ...(v.verticalAlign && { verticalAlign: v.verticalAlign }),
          ...Freeze,
        }}
      >
        <Checkbox
          color="primary"
          size="small"
          indeterminate={selected?.length && !AllSelect ? true : false}
          checked={!!AllSelect}
          onChange={checkHeadHandel}
        />
      </TableCell>
    );
  }
  if (v.action) {
    return (
      <TableCell
        key={i}
        sx={{
          p: "5px 0px",
          pl: "10px",
          width: v?.size?.size || "120px",
          minWidth: v?.size?.min,
          maxWidth: v?.size?.max,
          height: TableSize,
          boxSizing: "border-box",
          border: "none",
          ...(v.verticalAlign && { verticalAlign: v.verticalAlign }),
          ...Freeze,
        }}
      >
        <DataStyle
          handleWrap={true}
          sx={{
            pr: 0,
            textAlign: v.align || "center",
            color: "text.primary",
            fontWeight: "600",
            textTransform: "capitalize",
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            letterSpacing: "0.5px",
          }}
        >
          {v.name}
        </DataStyle>
      </TableCell>
    );
  }

  if (v.customHeading) {
    return (
      <TableCell
        key={i}
        sx={{
          padding: "5px 0px",
          pr: "10px",
          width: v?.size?.size || "120px",
          minWidth: v?.size?.min,
          maxWidth: v?.size?.max,
          height: TableSize,
          boxSizing: "border-box",
          border: "none",
          ...Freeze,
        }}
      >
        {v.customHeading()}
      </TableCell>
    );
  }

  const ShowData = (
    <DataStyle
      handleWrap={true}
      sx={{
        pr: "0px",
        color: "text.primary",
        fontWeight: "600",
        textTransform: "capitalize",
        fontFamily: "Roboto, sans-serif",
        fontSize: "16px",
        letterSpacing: "0.5px",
      }}
    >
      {v.name}
    </DataStyle>
  );

  return (
    <TableCell
      align={v.align || "center"}
      key={i}
      sx={{
        p: "5px 0px",
        pl: "10px",
        width: v?.size?.size || "auto",
        minWidth: v?.size?.min || "130px",
        maxWidth: v?.size?.max,
        height: TableSize,
        boxSizing: "border-box",
        border: "none",
        ...(v.verticalAlign && { verticalAlign: v.verticalAlign }),
        ...Freeze,
      }}
    >
      {v.sorting ? (
        <TableSortLabel
          active={sortKey === v.key}
          direction={sortKey === v.key ? sortType : "asc"}
          onClick={handleSort}
          sx={{
            pr: "10px",
            "&:hover": {
              color: "text.primary",
            },
            "&:focus": {
              color: "text.primary",
            },
          }}
        >
          {ShowData}
        </TableSortLabel>
      ) : (
        ShowData
      )}
    </TableCell>
  );
};

const MyTableBody = ({
  TableData,
  width,
  TableSize,
  data,
  editing,
  selectedKey,
  dispatch,
  colorRow,
}) => {
  const { selected } = useContext(AllStateContext);

  const checkBodyHandel = (v) => {
    let index = selected?.filter(
      (d) => d[selectedKey ?? "uid"] === v[selectedKey ?? "uid"]
    );
    if (index.length === 0) {
      let temp = [...selected];
      temp.push(v);
      dispatch({ action: AllActions.selected, value: temp });
    } else {
      let temp = selected.filter(
        (j) => j[selectedKey ?? "uid"] !== v[selectedKey ?? "uid"]
      );
      dispatch({ action: AllActions.selected, value: temp });
    }
  };

  return (
    <TableBody
      sx={{
        height: TableSize,
        minWidth: width.min || "900px",
      }}
    >
      {useMemo(() => {
        return editing?.new === true ? (
          <TableRow>
            <EditingRow TableData={TableData} editing={editing} />
          </TableRow>
        ) : null;
      }, [editing, TableData])}

      {data?.map((rowData, index) => {
        return (
          <TableRow key={rowData[selectedKey ?? "uid"] || index}>
            {typeof editing?.new === "string" &&
            editing?.new === rowData[selectedKey ?? "uid"] ? (
              <EditingRow
                TableData={TableData}
                editing={editing}
                rowData={rowData}
                colorRow={colorRow}
              />
            ) : (
              <TableBodyReturn
                rowData={rowData}
                selectedKey={selectedKey}
                checkBodyHandel={checkBodyHandel}
                index={index}
                TableData={TableData}
                selected={selected}
                colorRow={colorRow}
              />
            )}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

const TableBodyReturn = ({
  rowData,
  selectedKey,
  checkBodyHandel,
  index,
  TableData,
  selected,
  colorRow,
}) => {
  return TableData.map((col, i) => {
    let Freeze = col.freezeFirst
      ? {
          position: "sticky",
          left: 0,
          zIndex: 1,
          backgroundColor: "#fff",
        }
      : col.freezeLast
      ? {
          position: "sticky",
          right: 0,
          zIndex: 1,
          backgroundColor: "#fff",
        }
      : {};

    if (col.skipShow) {
      return <></>;
    }

    if (col.checkbox) {
      return (
        <TableCell
          key={i}
          sx={{
            padding: "2.5px 3.5px",
            width: "40px",
            height: "40px",
            boxSizing: "border-box",
            border: "none",
            overflow: "hidden",
            ...Freeze,
          }}
        >
          <Grid
            sx={{
              backgroundColor: colorRow?.condition(rowData[colorRow?.key])
                ? colorRow?.color?.success
                : colorRow?.color?.failed || "#F5F6FA",
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              borderLeft: i ? "" : "4px solid #839ABF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              color="primary"
              size="small"
              // disabled={v?.disable && v.disable(data)}
              disabled={col?.disable}
              checked={
                selected?.filter(
                  (v) =>
                    v[selectedKey ?? "uid"] === rowData[selectedKey ?? "uid"]
                )?.length <= 0
                  ? false
                  : true
              }
              onChange={() => checkBodyHandel(rowData)}
            />
          </Grid>
        </TableCell>
      );
    }

    if (col.action) {
      return (
        <TableCell
          key={i}
          sx={{
            padding: "2.5px 3.5px",
            width: "120px",
            height: "40px",
            boxSizing: "border-box",
            border: "none",
            overflow: "hidden",
            ...Freeze,
          }}
        >
          <Grid
            sx={{
              backgroundColor: colorRow?.condition(rowData[colorRow?.key])
                ? colorRow?.color?.success
                : colorRow?.color?.failed || "#F5F6FA",
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              p: "2.5px",
              pl: "8px",
            }}
          >
            {col.customBody && col.customBody(rowData, index, i)}
          </Grid>
        </TableCell>
      );
    }

    return (
      <TableCell
        align={col.align || "center"}
        key={i}
        sx={{
          padding: "2.5px 3.5px",
          maxWidth: "130px",
          height: "40px",
          boxSizing: "border-box",
          border: "none",
          overflow: "hidden",
          ...Freeze,
        }}
      >
        <Grid
          sx={{
            backgroundColor: colorRow?.condition(rowData[colorRow?.key])
              ? colorRow?.color?.success
              : colorRow?.color?.failed || "#F5F6FA",
            width: "100%",
            height: "100%",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: col.align || "center",
            borderLeft: i ? "" : "4px solid #839ABF",
            p: "2.5px",
            pl: "8px",
          }}
        >
          {col.customBody ? (
            col.customBody(rowData, index, i)
          ) : (
            <DataStyle handleWrap={true} {...(col?.dataStyle || {})}>
              {(col.key && rowData[col.key]?.toString()) || "-"}
            </DataStyle>
          )}
        </Grid>
      </TableCell>
    );
  });
};

const EditingRow = ({ TableData, editing, rowData, colorRow }) => {
  const [validate, setValidate] = useState(false);

  const allErrorTemp = {};
  TableData.forEach((v) => {
    if (v.editValidation && v.key) {
      allErrorTemp[v.key] = ValidationType(
        v?.control ?? "table",
        v.editValidation
      );
    } else {
      v.key && (allErrorTemp[v.key] = "");
    }
  });
  const dataValidate = Yup.object(allErrorTemp);

  const handleSubmit = (SubmitData) => {
    editing.onSubmit(SubmitData);
  };

  const inputRef = useRef({});
  return (
    <Formik
      initialValues={
        editing?.useInt
          ? editing?.initialValues ?? rowData ?? {}
          : rowData ?? editing.initialValues ?? {}
      }
      validationSchema={dataValidate}
      onSubmit={handleSubmit}
      validateOnBlur={validate}
      validateOnChange={validate}
    >
      {(formik) => {
        return TableData.map((col, i) => {
          let Freeze = col.freezeFirst
            ? {
                position: "sticky",
                left: 0,
                zIndex: 1,
                backgroundColor: "#fff",
              }
            : col.freezeLast
            ? {
                position: "sticky",
                right: 0,
                zIndex: 1,
                backgroundColor: "#fff",
              }
            : {};

          if (col.checkbox) {
            return (
              <TableCell
                key={i}
                sx={{
                  padding: "2.5px 3.5px",
                  width: "40px",
                  // height: "40px",
                  boxSizing: "border-box",
                  border: "none",
                  overflow: "hidden",
                  ...Freeze,
                }}
              >
                <Grid
                  sx={{
                    backgroundColor: colorRow?.condition(rowData[colorRow?.key])
                      ? colorRow?.color?.success
                      : colorRow?.color?.failed || "#F5F6FA",
                    width: "100%",
                    height: "100%",
                    borderRadius: "6px",
                    borderLeft: i ? "" : "4px solid #839ABF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Checkbox color="primary" size="small" disabled />
                </Grid>
              </TableCell>
            );
          }

          if (col.action) {
            return (
              <TableCell
                key={i}
                sx={{
                  padding: "2.5px 3.5px",
                  width: "120px",
                  // height: "40px",
                  boxSizing: "border-box",
                  border: "none",
                  overflow: "hidden",
                  ...Freeze,
                }}
              >
                <Grid
                  sx={{
                    backgroundColor: colorRow?.condition(rowData[colorRow?.key])
                      ? colorRow?.color?.success
                      : colorRow?.color?.failed || "#F5F6FA",
                    width: "100%",
                    height: "100%",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    p: "2.5px",
                    pl: "8px",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setValidate(true);
                      formik.handleSubmit();
                    }}
                    sx={(theme) => ({
                      backgroundColor: `${theme.palette.icon.green}22`,
                      mr: "10px",
                      "&:hover": {
                        backgroundColor: `${theme.palette.icon.green}32`,
                      },
                    })}
                  >
                    <Tooltip title={"Submit"}>
                      <CheckIcon
                        fontSize="small"
                        sx={{ color: "icon.green" }}
                      />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      editing.onClose();
                    }}
                    sx={(theme) => ({
                      backgroundColor: `${theme.palette.icon.error}22`,
                      "&:hover": {
                        backgroundColor: `${theme.palette.icon.error}32`,
                      },
                    })}
                  >
                    <Tooltip title={"Close"}>
                      <ClearIcon
                        fontSize="small"
                        sx={{ color: "icon.error" }}
                      />
                    </Tooltip>
                  </IconButton>
                </Grid>
              </TableCell>
            );
          }
          if (!col.edit)
            return (
              <TableCell
                align={col.align || "center"}
                key={i}
                sx={{
                  padding: "2.5px 3.5px",
                  maxWidth: "130px",
                  // height: "40px",
                  boxSizing: "border-box",
                  border: "none",
                  overflow: "hidden",
                  ...Freeze,
                }}
              >
                <Grid
                  sx={{
                    backgroundColor: colorRow?.condition(rowData[colorRow?.key])
                      ? colorRow?.color?.success
                      : colorRow?.color?.failed || "#F5F6FA",
                    width: "100%",
                    height: "100%",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderLeft: i ? "" : "4px solid #839ABF",
                  }}
                >
                  {col?.customBody && rowData ? (
                    col.customBody(rowData, i, true)
                  ) : (
                    <DataStyle handleWrap={true} {...(col?.dataStyle || {})}>
                      {rowData && col?.key
                        ? rowData[col?.key]?.toString() || ""
                        : ""}
                    </DataStyle>
                  )}
                </Grid>
              </TableCell>
            );

          let { sx, inputProps, ...restAll } = col?.fieldProps || {};

          return (
            <TableCell
              align={col.align || "center"}
              key={i}
              sx={{
                padding: "2.5px 3.5px",
                maxWidth: "130px",
                // height: "40px",
                boxSizing: "border-box",
                border: "none",
                overflow: "hidden",
                ...Freeze,
              }}
            >
              <Grid
                sx={{
                  backgroundColor: colorRow?.condition(rowData[colorRow?.key])
                    ? colorRow?.color?.success
                    : colorRow?.color?.failed || "#F5F6FA",
                  width: "100%",
                  height: "100%",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft: i ? "" : "4px solid #839ABF",
                  p: col?.editField ? "" : "9px 6px",
                }}
              >
                {col?.editField ? (
                  <col.editField
                    item={{ name: col.key }}
                    handler={formik}
                    inputRef={inputRef}
                  />
                ) : (
                  <TextField
                    size="small"
                    fullWidth
                    name={col.key}
                    ref={(el) => inputRef && (inputRef.current["name"] = el)}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values[`${col.key}`] || ""}
                    error={Boolean(formik.errors[`${col.key}`])}
                    helperText={formik.errors[`${col.key}`]}
                    sx={{
                      // height: formik.errors[`${col.key}`] ? "56px" : "36px",
                      ...(sx || {}),
                    }}
                    inputProps={{
                      sx: {
                        color: "text.secondary",
                        py: "9px",
                        px: "5px",
                        fontSize: "14px",
                      },
                      ...(inputProps || {}),
                    }}
                    {...(restAll || {})}
                  />
                )}
              </Grid>
            </TableCell>
          );
        });
      }}
    </Formik>
  );
};

// ------------------------ footer -------------------------

export const MyTableName = ({ TableName }) => {
  return useMemo(() => {
    return TableName ? (
      <Grid
        sx={{
          width: "100%",
          display: "flex",
          pl: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body1"
          noWrap
          sx={{
            width: "100%",
            color: "text.primary",
            fontWeight: "600",
            textTransform: "capitalize",
            fontSize: "18px",
          }}
        >
          {TableName}
        </Typography>
      </Grid>
    ) : null;
  }, [TableName]);
};

export const DeleteBtnComp = (props) => {
  const myRef = useRef();

  const { selected, updating } = useContext(AllStateContext);

  return (
    <>
      {!props.topBtn?.skipDelete ? (
        <Grid ref={myRef} sx={{ overflow: "hidden", display: "flex" }}>
          <Slide
            direction="left"
            container={myRef.current}
            in={updating}
            mountOnEnter
            unmountOnExit
          >
            <Grid
              sx={{
                mr: "20px",
                display: "flex",
              }}
            >
              <MyIconButton
                sx={{ width: "32px" }}
                disabled={true}
                color="error"
              >
                <CircularProgress size={24} color="primary" />
              </MyIconButton>
            </Grid>
          </Slide>
          <Slide
            direction="left"
            container={myRef.current}
            in={selected?.length ? true : false}
            mountOnEnter
            unmountOnExit
          >
            <Grid
              sx={{
                mr: "20px",
                display: "flex",
              }}
            >
              {props.topBtn?.customBtn ? (
                <>{props.topBtn?.customBtn}</>
              ) : (
                <MyIconButton
                  back={true}
                  sx={{ width: "32px" }}
                  color="error"
                  onClick={props.topBtn?.onDelete}
                >
                  <Tooltip title="Delete">
                    <DeleteIcon sx={{ color: "error.light" }} />
                  </Tooltip>
                </MyIconButton>
              )}
            </Grid>
          </Slide>
        </Grid>
      ) : null}
    </>
  );
};

export const MyTableFooter = ({
  total,
  skipRow,
  search,
  dispatch,
  skipSearch,
  data,
  skipCount,
  restData,
}) => {
  const { size, count, page, searchValue, selected } =
    useContext(AllStateContext);
  const CheckForKey = (data) => {
    const out = data?.map((el) => {
      return Object.hasOwn(el, "hasPermission");
    });
    const unique = [...new Set(out)];
    return unique[0];
  };

  const MyPagination = () => {
    return (
      <>
        {skipCount ? null : total ? (
          <Grid
            sx={{
              height: "40px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            {useMemo(() => {
              return total ? (
                <Typography
                  variant="body2"
                  sx={{
                    mr: "10px",
                    color: "text.secondary",
                  }}
                >
                  Count :
                  <Grid
                    component="span"
                    sx={(theme) => ({
                      color: "text.primary",
                      px: "5px",
                      ml: "5px",
                      borderRadius: "4px",
                      backgroundColor: `${theme.palette.background.card2}99`,
                    })}
                  >
                    {total}
                  </Grid>
                </Typography>
              ) : null;
            }, [total])}

            {useMemo(() => {
              return skipRow ? null : (
                <ChangeRow size={size} total={total} dispatch={dispatch} />
              );
            }, [size, skipRow, dispatch])}

            {useMemo(() => {
              const HandelPageChange = (e, v) => {
                dispatch({ action: AllActions.page, value: v });
              };
              return (
                <>
                  {count > 1 ? (
                    <Pagination
                      color="primary"
                      size="small"
                      page={page}
                      count={count}
                      siblingCount={0}
                      onChange={HandelPageChange}
                    />
                  ) : null}
                </>
              );
            }, [page, count])}
          </Grid>
        ) : null}
      </>
    );
  };

  return (
    <>
      <Grid
        sx={{
          flexDirection: "row",
          width: "100%",
          maxHeight: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          boxSizing: "border-box",
          mb: "5px",
        }}
      >
        <Grid sx={{ width: "40%", display: "flex", alignItems: "center" }}>
          {useMemo(
            () =>
              !skipSearch && (
                <SearchInput2
                  sx={{ mr: "10px" }}
                  placeholder={
                    search?.placeholder ? search?.placeholder : "search"
                  }
                  value={searchValue}
                  clearSearch={() =>
                    dispatch({ action: AllActions.searchValue, value: "" })
                  }
                  onChange={(e) => {
                    if (
                      e.target.value.match(
                        search?.validation
                          ? search?.validation
                          : SearchValidation
                      ) ||
                      !e.target.value
                    )
                      dispatch({
                        action: AllActions.searchValue,
                        value: e.target.value ?? "",
                      });
                  }}
                />
              ),
            [search, searchValue, skipSearch]
          )}
          {selected?.length ? (
            <Typography
              variant="body2"
              sx={{
                mr: "10px",
                color: "text.secondary",
              }}
            >
              Selected :
              <Grid
                component="span"
                sx={(theme) => ({
                  color: "text.primary",
                  px: "5px",
                  ml: "5px",
                  borderRadius: "4px",
                  backgroundColor: `${theme.palette.background.card2}99`,
                })}
              >
                {selected?.length}
              </Grid>
            </Typography>
          ) : null}
        </Grid>
        <Grid
          sx={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
            flexGrow: 3,
            minWidth: "60%",
          }}
        >
          {useMemo(
            () =>
              restData?.refetch && <RefetchComp refetch={restData?.refetch} />,
            [restData?.refetch]
          )}
          {useMemo(
            () => (
              <MyPagination />
            ),
            [count, total, page, size, skipRow]
          )}
        </Grid>
      </Grid>
      {restData?.instruction && restData?.instruction()}

      {CheckForKey(data) && (
        <Grid>
          <Typography
            sx={{
              color: "icon.fieldErr",
              fontSize: "12px",
              m: "0px 0px 10px 5px",
            }}
          >
            Note: Highlighted rows shows user with no permissions.
          </Typography>
        </Grid>
      )}
    </>
  );
};

const RefetchComp = ({ refetch }) => {
  const { updating } = useContext(AllStateContext);
  return (
    <MyIconButton
      back2={true}
      color={updating ? "disabled" : "primary"}
      sx={{ mr: "16px", width: "34px", height: "34px" }}
      disabled={updating}
      tooltip="Refetch Data"
      onClick={() => refetch()}
    >
      <RefreshIcon color={updating ? "disabled" : "primary"} />
    </MyIconButton>
  );
};

const ChangeRow = ({ size, dispatch }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Grid
      sx={{
        display: {
          xs: "none",
          sm: "flex",
          md: "flex",
        },
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Typography
        variant="body2"
        sx={{ ml: "10px", mr: "auto", color: "text.secondary" }}
      >
        Page Size :
      </Typography>
      <Button
        size="small"
        disableRipple
        onClick={() => setOpen((v) => !v)}
        sx={(theme) => ({
          minWidth: "40px",
          color: "text.primary",
          fontSize: "0.875rem",
          height: "25px",
          ml: "5px",
          py: "0px",
          backgroundColor: `${theme.palette.background.card2}99`,
          "&:hover": {
            backgroundColor: "background.card2",
          },
        })}
      >
        {size}
        <ArrowDropDownIcon
          fontSize="small"
          sx={{ color: "text.secondary", width: "20px" }}
        />
      </Button>

      <Select
        value={size}
        onChange={(e) => {
          dispatch({ action: AllActions.size, value: e.target.value });
        }}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        sx={{
          maxWidth: "0px",
          height: "0px",
          overflow: "hidden",
          color: "text.primary",
          fontSize: "1rem",
          maxHeight: "30px",
          p: 0,
          ml: "5px",
          borderRadius: "0px",
          boxShadow: "none",
          "&.MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
            p: 0,
          },
          ".MuiOutlinedInput-notchedOutline": { border: 0 },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            boxShadow: "none",
            border: 0,
          },
        }}
      >
        {[10, 20, 50, 100]?.map((d) => {
          return (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          );
        })}
      </Select>
    </Grid>
  );
};
