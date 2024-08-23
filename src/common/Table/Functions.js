//------------------ common function -----------------------

import moment from "moment";

export function CommonSearch(search, data) {
  if (
    !search?.search ||
    search?.search?.trim() === "" ||
    !data ||
    !data?.length
  ) {
    return data;
  }
  if (typeof search.keys === "string") {
    search = { ...search, keys: search.keys ? [search.keys] : [] };
  }
  const newData = [];
  for (let obj of data) {
    const keys =
      search?.keys && search.keys.length > 0 ? search.keys : Object.keys(obj);
    for (let k of keys) {
      if (
        obj[k] &&
        obj[k]
          ?.toString()
          ?.toLocaleLowerCase()
          ?.trim()
          ?.includes(String(search?.search?.trim()?.toLowerCase()))
      ) {
        newData.push(obj);
        break;
      }
    }
  }
  return newData;
}

export function CommonSort(key, value, data, dataType) {
  let sortedData = [...(data ?? [])];
  if (value === "asc") {
    return sortedData?.sort((x, y) => {
      let a = x[key];
      let b = y[key];

      // Check for empty values
      if (a === undefined || a === null || a === "") return 1;
      if (b === undefined || b === null || b === "") return -1;

      //convert data on the data type
      if (dataType) {
        if (typeof dataType === "object") {
          if (dataType.type === "date" && dataType.format) {
            a = new Date(moment(a, dataType.format).toISOString());
            b = new Date(moment(b, dataType.format).toISOString());
          }
        } else if (dataType === "date") {
          a = new Date(a) || a;
          b = new Date(b) || b;
        } else if (dataType === "number") {
          a = parseFloat(a) || a;
          b = parseFloat(b) || b;
        }
      }

      // Rest of the comparison logic remains the same
      if (typeof a === typeof b) {
        if (typeof a === "string") {
          if (a?.toLowerCase()?.trim() < b?.toLowerCase()?.trim()) return -1;
          if (a?.toLowerCase()?.trim() > b?.toLowerCase()?.trim()) return 1;
          return 0;
        } else if (typeof a === "number") {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        } else if (typeof a === "boolean") {
          return a - b;
        } else if (a instanceof Date) {
          return a.getTime() - b.getTime();
        } else if (Array.isArray(a)) {
          return a.length - b.length;
        } else if (typeof a === "object") {
          return JSON.stringify(a).localeCompare(JSON.stringify(b));
        }
      }
      return typeof a < typeof b ? -1 : 1;
    });
  } else if (value === "desc") {
    return sortedData?.sort((x, y) => {
      let a = x[key];
      let b = y[key];

      // Check for empty values
      if (a === undefined || a === null || a === "") return -1;
      if (b === undefined || b === null || b === "") return 1;

      //convert data on the data type
      if (dataType) {
        if (typeof dataType === "object") {
          if (dataType.type === "date" && dataType.format) {
            a = new Date(moment(a, dataType.format).toISOString());
            b = new Date(moment(b, dataType.format).toISOString());
          }
        } else if (dataType === "date") {
          a = new Date(a) || a;
          b = new Date(b) || b;
        } else if (dataType === "number") {
          a = parseFloat(a) || a;
          b = parseFloat(b) || b;
        }
      }

      // Rest of the comparison logic remains the same
      if (typeof a === typeof b) {
        if (typeof a === "string") {
          if (a?.toLowerCase()?.trim() > b?.toLowerCase()?.trim()) return -1;
          if (a?.toLowerCase()?.trim() < b?.toLowerCase()?.trim()) return 1;
          return 0;
        } else if (typeof a === "number") {
          if (a > b) return -1;
          if (a < b) return 1;
          return 0;
        } else if (typeof a === "boolean") {
          return b - a;
        } else if (a instanceof Date) {
          return b.getTime() - a.getTime();
        } else if (Array.isArray(a)) {
          return b.length - a.length;
        } else if (typeof a === "object") {
          return JSON.stringify(b).localeCompare(JSON.stringify(a));
        }
      }
      return typeof a > typeof b ? -1 : 1;
    });
  } else {
    console.log('Invalid order parameter. Please use "asc" or "desc".');
    return data;
  }
}

export function GetParamAllData(param) {
  if (param) {
    let temp = {};

    param.forEach((value, key) => {
      temp[key] = value;
    });

    return temp;
  } else {
    return {};
  }
}

export function CompareObjects(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is equal
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if all keys and their corresponding values are equal
  for (let key of keys1) {
    if (!compareValues(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function compareValues(value1, value2) {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    return compareArrays(value1, value2);
  }
  return value1 === value2;
}

function compareArrays(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}
