import { createContext } from "react";
import { CommonSearch } from "./Functions";

export const AllStateContext = createContext({});

export const initialArg = {
  loading: true,
  updating: false,
  error: false,
  searchValue: "",
  selected: [],
  allKeys: null,
  defaultSort: null,
  page: null,
  size: null,
  count: null,
  sortType: null,
  sortKey: null,
  filterData: null,
};

export const AllActions = {
  update: "setUpdating",
  error: "updateError",
  searchValue: "updateSearchValue",
  selected: "updateSelected",
  allKeys: "updateAllKeys",
  defaultSort: "updateDefaultSort",
  Changes: "BulkChanges",
  page: "updatePage",
  size: "updateSize",
  sortKey: "changeSortKey",
  sortType: "changeSortType",
  sortTypeOpp: "oppositeOfType",
  AddKey: "addNewKey",
  loading: "updateLoading",
  filterData: "changeFilter",
};

export const FilterReducerFun = (state, data, searchValue, check) => {
  let tempState = { ...state };
  let tempFilter;

  if (check) {
    tempState.Data = data;
  }

  if (
    data &&
    !state.handleBackend &&
    searchValue &&
    searchValue?.trim() !== ""
  ) {
    tempFilter = CommonSearch(
      { search: searchValue, keys: state.allKeys },
      data
    );
  } else {
    tempFilter = data;
  }
  tempState.searchValue = searchValue;
  tempState.filterData = tempFilter;
  return tempState;
};

export function reducer(state, action) {
  switch (action.action) {
    case AllActions.update:
      return {
        ...state,
        updating: action.value,
      };
    case AllActions.loading:
      return { ...state, loading: action.value };
    case AllActions.error:
      return { ...state, error: action.value };

    case AllActions.searchValue:
      return FilterReducerFun(state, state.Data, action.value);
    case AllActions.allKeys:
      return { ...state, allKeys: action.value };

    case AllActions.selected:
      return { ...state, selected: action.value };
    case AllActions.filterData: {
      return FilterReducerFun(state, action.value, state.searchValue, true);
    }

    case AllActions.page:
      return { ...state, page: action.value };
    case AllActions.size:
      return { ...state, size: action.value, page: 1 };

    case AllActions.defaultSort:
      return { ...state, defaultSort: action.value };
    case AllActions.sortKey:
      return { ...state, sortKey: action.value };
    case AllActions.sortType:
      return { ...state, sortType: action.value };
    case AllActions.sortTypeOpp:
      return { ...state, sortType: state?.sortType === "asc" ? "desc" : "asc" };

    case AllActions.AddKey:
      return { ...state, ...(action.value ?? {}) };

    case AllActions.Changes:
      return { ...state, ...(action.value ?? {}) };
  }
  throw Error("Unknown action: " + action.type);
}
