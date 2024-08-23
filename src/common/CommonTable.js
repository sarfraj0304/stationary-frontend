import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
  useReducer,
  useContext,
  useDeferredValue,
} from "react";
import MyCard from "./MyCard";
import {
  AllActions,
  AllStateContext,
  initialArg,
  reducer,
} from "./Table/Reducer";
import { CommonSort, CompareObjects, GetParamAllData } from "./Table/Functions";
import {
  DeleteBtnComp,
  MainTableComp,
  MyTableFooter,
  MyTableName,
} from "./Table/TableComp";
import { Grid, TableContainer } from "@mui/material";

//props value
// 1. data : {data:tableData}

function CommonTable(
  {
    data,
    topBtn,
    loading,
    updating,
    style,
    tableName,
    setSelected,
    removeShadow,
    ...restProps
  },
  ref
) {
  const [state, dispatch] = useReducer(reducer, initialArg);

  const { updating: MyUpd, loading: MyLoad, error: MyError, selected } = state;

  const CompData = useRef({});
  CompData.current = state;

  useImperativeHandle(ref, () => ({
    getSelected: () => {
      return selected;
    },
    getSearchKeys: () => {
      return state.allKeys;
    },
    getFilteredData: () => {
      return state.filterData;
    },
    setSelected: (v) => {
      dispatch({ action: AllActions.selected, value: v ?? [] });
      return v ?? true;
    },
    setSearch: (v) => {
      dispatch({ action: AllActions.searchValue, value: v ?? "" });
      return v;
    },
    getData: (v) => {
      console.log(state, "fffff");

      return state?.sortData ?? [];
    },
  }));

  useLayoutEffect(() => {
    if (typeof data !== "object")
      return dispatch({
        action: AllActions.error,
        value: "data is not an object",
      });
  }, []);

  useEffect(() => setSelected && setSelected(selected), [selected]);

  useEffect(() => {
    if (updating !== MyUpd)
      dispatch({ action: AllActions.update, value: !!updating });
  }, [updating, MyUpd]);

  useEffect(() => {
    if (loading !== MyLoad)
      dispatch({ action: AllActions.loading, value: !!loading });
  }, [loading, MyLoad]);

  return (
    <Grid sx={{ width: "100%", height: "100%" }}>
      <AllStateContext.Provider value={state}>
        <TableStyling
          topBtn={topBtn}
          style={style}
          removeShadow={removeShadow}
          tableName={tableName}
        >
          <MainTableValidation error={MyError} isError={data?.error}>
            {useMemo(() => {
              return (
                <TableCompSearchSorting
                  AllData={data}
                  CompData={CompData}
                  dispatch={dispatch}
                  {...restProps}
                />
              );
            }, [data, CompData, dispatch, restProps])}
          </MainTableValidation>
        </TableStyling>
      </AllStateContext.Provider>
    </Grid>
  );
}

export default forwardRef(CommonTable);

// upper Most styling
const TableStyling = (props) => {
  let header = props?.tableName || props.topBtn?.addBtn ? "40px" : 0;

  return (
    <MyCard
      sx={{
        width: "100%",
        p: "10px 10px",
        maxHeight: "calc(100% - 90px)",
        ...props.style,
      }}
      removeshadow={props?.removeShadow}
    >
      <Grid
        sx={{
          width: "100%",
          height: props?.tableName
            ? { sm: "70px", md: "70px", lg: header }
            : header,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: props?.tableName ? "space-between" : "flex-end",
          flexDirection: { sm: "column", md: "column", lg: "row" },
          mb: props?.tableName ? 1 : 0.5,
        }}
      >
        {props?.tableName && (
          <Grid
            sx={{
              width: { sm: "100%", md: "100%", lg: "40%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <MyTableName TableName={props?.tableName} />
          </Grid>
        )}

        <Grid
          sx={{
            width: { sm: "100%", md: "100%", lg: "60%" },
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {!!header && <DeleteBtnComp topBtn={props.topBtn} />}

          {props.topBtn?.addBtn ? props.topBtn?.addBtn : ""}
        </Grid>
      </Grid>
      <Grid sx={{ width: "100%", height: `calc(100% - ${header})` }}>
        {props.children}
      </Grid>
    </MyCard>
  );
};

// Throw Error if any
const MainTableValidation = (props) => {
  const { error, isError } = props;

  return (
    <>
      {error || isError ? (
        <Grid
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "390px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Error...
        </Grid>
      ) : (
        props?.children
      )}
    </>
  );
};

// handle search & sorting component
const TableCompSearchSorting = (props) => {
  const { AllData, handleBackend, CompData, dispatch, ...restProps } = props;

  const { data, TableData, param, setParam, removeParam, ...restData } =
    AllData;

  const { filterData, defaultSort, sortType, sortKey, loading } =
    useContext(AllStateContext);

  // validateParam
  const validateParam = () => {
    if (!removeParam) {
      let NewParams = {};
      let AllParams = GetParamAllData(param);
      if (!isNaN(AllParams?.p) && AllParams?.p !== CompData.current.page) {
        NewParams.page = parseInt(AllParams.p);
      }
      if (!isNaN(AllParams?.s) && AllParams?.s !== CompData.current.size) {
        NewParams.size = parseInt(AllParams.s);
      }
      if (handleBackend && AllParams.search !== CompData.current.searchValue) {
        NewParams.searchValue = AllParams.search ?? "";
      }
      if (
        AllParams.sort &&
        (AllParams.sort === "asc" || AllParams.sort === "desc") &&
        AllParams.sort !== CompData.current.sortType
      ) {
        NewParams.sortType = AllParams.sort;
      }
      if (AllParams.key && AllParams.key !== CompData.current.sortKey) {
        NewParams.sortKey = AllParams.key;
      }

      if (JSON.stringify(NewParams) !== "{}") {
        return NewParams;
      }
      return {};
    } else {
      return {};
    }
  };

  //Add default Sort
  const AddDefaultSort = () => {
    let AllSortKeys = {};
    let defaultSort = {};
    TableData.forEach((v) => {
      if (v.sorting) {
        Object.assign(AllSortKeys, {
          [v?.key]: { value: "asc", type: v.type || "string" },
        });
        if (v.defaultSort) {
          defaultSort = {
            key: v?.key,
            value:
              v.defaultSort === "asc" || v.defaultSort === "desc"
                ? v.defaultSort
                : "asc",
          };
        }
        if (JSON.stringify(defaultSort) === "{}") {
          defaultSort = { key: v?.key, value: "asc" };
        }
      }
    });
    if (JSON.stringify(defaultSort) === "{}") {
      defaultSort = false;
    }
    Object.assign(AllSortKeys, { default: defaultSort });
    return { defaultSort: AllSortKeys };
  };

  //Add All Search Keys
  const AddSearchKeys = () => {
    let temp = [];
    TableData.forEach((v) => {
      if (v.search) {
        temp.push(v.key ?? "");
      }
    });
    return { allKeys: temp };
  };

  useLayoutEffect(() => {
    if (!Array.isArray(TableData))
      dispatch({
        action: AllActions.error,
        value: "data>TableData is not a array",
      });
    else if ((!removeParam || handleBackend) && (!param || !setParam)) {
      dispatch({
        action: AllActions.error,
        value: "data>param/setParam is invalid",
      });
    } else {
      let temp1 = AddSearchKeys();
      let temp2 = validateParam();
      let temp3 = AddDefaultSort();
      dispatch({
        action: AllActions.Changes,
        value: {
          ...temp1,
          ...temp2,
          ...temp3,
          validated: true,
          handleBackend: !!handleBackend,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (data) dispatch({ action: AllActions.filterData, value: data });
  }, [data]);

  useEffect(() => {
    if (!loading) {
      let temp = validateParam();
      if (JSON.stringify(temp) !== "{}")
        dispatch({
          action: AllActions.Changes,
          value: temp,
        });
    }
  }, [param]);

  useEffect(() => {
    if (defaultSort?.default && filterData) {
      if (sortKey && sortType && !!defaultSort[sortKey]) {
        if (sortType === "asc" || sortType === "desc") {
          let tempSort = [];
          if (!handleBackend)
            tempSort = CommonSort(
              sortKey,
              sortType,
              filterData,
              defaultSort[sortKey]?.type
            );
          else tempSort = filterData;
          dispatch({
            action: AllActions.AddKey,
            value: { sortData: tempSort },
          });
        } else {
          dispatch({
            action: AllActions.Changes,
            value: {
              sortType: "asc",
            },
          });
        }
      } else {
        dispatch({
          action: AllActions.Changes,
          value: {
            sortKey: defaultSort.default?.key,
            sortType: defaultSort.default?.value,
          },
        });
      }
    } else if (defaultSort && !loading) {
      dispatch({
        action: AllActions.AddKey,
        value: { sortData: filterData },
      });
    }
  }, [defaultSort, sortType, sortKey, filterData, loading]);

  return (
    <>
      {useMemo(
        () => (
          <TableCompPagination
            AllData={{ ...restData, removeParam, param, setParam, TableData }}
            handleBackend={handleBackend}
            CompData={CompData}
            dispatch={dispatch}
            {...restProps}
          />
        ),
        [
          restData,
          removeParam,
          param,
          setParam,
          TableData,
          handleBackend,
          CompData,
          dispatch,
          restProps,
        ]
      )}
    </>
  );
};

//handle pagination component
const TableCompPagination = (props) => {
  const {
    pagination,
    AllData,
    handleBackend,
    dispatch,
    selectedKey,
    ...restProps
  } = props;
  const { total, ...restData } = AllData;

  const {
    size,
    page,
    count,
    selected,
    sortData: data,
    PaginationComp,
    loading,
    validated,
  } = useContext(AllStateContext);

  const [view, setView] = useState();

  useLayoutEffect(() => {
    if (validated) {
      let NewParams = {};
      if (!isNaN(page)) NewParams.page = 1;
      if (!isNaN(size)) NewParams.size = pagination?.setMaxRows ?? 10;
      if (!isNaN(count)) NewParams.count = 1;
      dispatch({ action: AllActions.Changes, value: NewParams });
    }
  }, [validated]);

  useEffect(() => {
    if (data) {
      let NewParams = {};
      NewParams.dataLength = data?.length ?? 0;
      NewParams.PaginationComp = true;
      if (size && data?.length > size && !handleBackend) {
        NewParams.count = Math.ceil(data?.length / size);
        setView(data.slice((page - 1) * size, page * size));
      } else if (size && data?.length < size && !handleBackend) {
        NewParams.count = 0;
        setView(data);
      } else if (data?.length && size) {
        NewParams.count = Math.ceil((total ?? size) / size);
        setView(data);
      } else {
        NewParams.count = 0;
        setView([]);
      }

      //select data changes when you change any row property of table
      if (selected?.length) {
        let temp = selected?.filter((d) =>
          data?.some(
            (o2) => d[selectedKey ?? "uid"] === o2[selectedKey ?? "uid"]
          )
        );
        NewParams.selected = [...temp];
      }
      dispatch({ action: AllActions.Changes, value: NewParams });
    }
  }, [size, data, total]);

  useEffect(() => {
    if (data?.length && PaginationComp) {
      if (count < page) {
        dispatch({ action: AllActions.page, value: 1 });
      } else if (data?.length && !handleBackend) {
        setView(data.slice((page - 1) * size, page * size));
      } else if (data?.length && handleBackend) {
        setView(data);
      }
    }
  }, [page, count, PaginationComp]);

  const FinalTab = useMemo(
    () => (
      <MainTable
        skipRow={!!pagination?.skipPagination}
        view={view}
        data={data}
        dispatch={dispatch}
        selectedKey={selectedKey}
        AllData={{
          ...restData,
          total: handleBackend ? total : data?.length,
          handleBackend,
        }}
        {...restProps}
      />
    ),
    [
      pagination,
      view,
      data,
      dispatch,
      restData,
      handleBackend,
      total,
      restProps,
      selectedKey,
    ]
  );

  if (!PaginationComp || !view || loading)
    return (
      <Grid sx={{ width: "100%", height: "100%" }}>
        <Grid
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "390px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading...
        </Grid>
      </Grid>
    );

  return FinalTab;
};

//render Main table
const MainTable = (props) => {
  const {
    AllData,
    skipRow,
    search,
    view,
    data,
    dispatch,
    width,
    editing,
    skipSearch,
    selectedKey,
    skipCount,
    colorRow,
  } = props;
  const {
    total,
    removeParam,
    param,
    setParam,
    handleBackend,
    TableData,
    ...restData
  } = AllData;
  const {
    PaginationComp,
    page,
    size,
    defaultSort,
    sortType,
    sortKey,
    searchValue,
  } = useContext(AllStateContext);

  const [paramState, setParamState] = useState(null);
  const deferredParam = useDeferredValue(paramState);

  useEffect(() => {
    let actualParams = GetParamAllData(param);
    actualParams.p = page;
    actualParams.s = size;
    if (defaultSort?.default) {
      actualParams["sort"] = sortType;
      actualParams.key = sortKey;
    }
    if (handleBackend) {
      if (searchValue && searchValue?.trim() !== "")
        actualParams.search = searchValue;
      else delete actualParams.search;
    } else delete actualParams.search;
    if (!CompareObjects(actualParams, GetParamAllData())) {
      setParamState(actualParams);
    }
  }, [page, size, sortKey, sortType, searchValue]);

  useEffect(() => {
    if (!removeParam && PaginationComp && deferredParam) {
      setParam(deferredParam);
    }
  }, [deferredParam, PaginationComp]);

  return (
    <Grid sx={{ width: "100%", height: "100%" }}>
      {skipSearch && skipCount ? null : (
        <MyTableFooter
          total={total}
          skipRow={skipRow}
          search={search}
          dispatch={dispatch}
          skipSearch={skipSearch}
          skipCount={skipCount}
          data={data}
          restData={restData}
        />
      )}

      <TableContainer
        sx={{
          width: "100%",
          minHeight: "100px",
          height: "100%",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      >
        {useMemo(() => {
          return (
            <MainTableComp
              view={view}
              data={data}
              width={width}
              AllData={{ TableData }}
              dispatch={dispatch}
              editing={editing}
              selectedKey={selectedKey}
              colorRow={colorRow}
            />
          );
        }, [view, data, width, TableData, editing, selectedKey, colorRow])}
      </TableContainer>
    </Grid>
  );
};
