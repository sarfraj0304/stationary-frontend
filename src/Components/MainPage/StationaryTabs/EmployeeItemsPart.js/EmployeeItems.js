import React, { useRef, useState } from "react";
import MyCard from "../../../../common/MyCard";
import { Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CommonTable from "../../../../common/CommonTable";
import {
  useCreateUserItemsMutation,
  useUserItemsGetQuery,
} from "../../StationaryQuery";
import CreateEmployeeItems from "./CreateEmployeeItems";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MyButton from "../../../../common/MyButton";
import MyModal, { DeletePopup } from "../../../../common/MyModal";
import ToastHandler from "../../../../common/ToastHandler";
import MyModalUI from "../../../../common/MyModalUI";
import ViewOfficialData from "./ViewOfficialData";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonFilter from "../../../../common/CommonFilter";
import moment from "moment";
import MyExportPopup from "../../../../common/MyExportPopup";

const EmployeeItems = ({ employees, items }) => {
  const [tableView, setTableView] = useState({ view: "table", data: null });
  const tableRef = useRef();
  const [param, setParam] = useSearchParams();
  const [openDel, setOpenDel] = useState(false);
  const [view, setView] = useState({ view: false, data: null });
  const [UserItemMutate] = useCreateUserItemsMutation();
  const [filter, setFilter] = useState({
    userUid: "",
    date: "",
    itemUid: "",
  });

  const handleGetQuery = (data) => {
    const queryParams = [];
    for (let key in data) {
      if (data[key]) {
        if (key === "date") {
          queryParams.push(`${key}=${moment(data[key])?.format("DD-MM-YYYY")}`);
        } else {
          queryParams.push(`${key}=${data[key]}`);
        }
      }
    }
    return queryParams.length ? `?${queryParams.join("&")}` : "";
  };

  const { data, isLoading, isFetching, isError } = useUserItemsGetQuery({
    url: `user-item-get${handleGetQuery(filter)}`,
  });

  const tableAddon = {
    btn: (
      <>
        <MyExportPopup
          data={
            data?.map((entry) => {
              const newEntry = { ...entry, name: entry?.user?.name };
              entry.items.forEach((item) => {
                newEntry[item.name] = item.quantity;
              });
              return newEntry;
            }) || []
          }
          title={"Employee-Item"}
          rows={[
            "name",
            "date",
            ...items.map((el) => {
              return {
                key: el?.key,
                mutate: ({ d, k }) => d[k] ?? "-",
              };
            }),
          ]}
          header={["Employee Name", "Date", ...items.map((el) => el?.key)]}
        />

        <MyButton
          color="primary"
          onClick={() => {
            setTableView({ view: "create", data: null });
          }}
        >
          <AddCircleOutlineIcon fontSize="small" sx={{ pr: "3px" }} />
          Create
        </MyButton>
      </>
    ),
  };

  const TableActions = ({ data }) => {
    return (
      <Grid
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          size="small"
          onClick={() => {
            setTableView({ view: "create", data: data });
          }}
        >
          <Tooltip title={"Edit"}>
            <EditIcon
              fontSize="small"
              sx={{
                color: "primary.light",
              }}
            />
          </Tooltip>
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            setView({ view: true, data: data });
          }}
          sx={{ ml: 1 }}
        >
          <Tooltip title={"View Details"}>
            <VisibilityIcon fontSize="small" sx={{ color: "primary.light" }} />
          </Tooltip>
        </IconButton>
      </Grid>
    );
  };

  const handelDelete = () => {
    setOpenDel(false);
    const deleteAssign = async (uid) => {
      await UserItemMutate({
        url: `user-item-delete/${uid}`,
        method: "DELETE",
      });
    };
    tableRef?.current?.getSelected()?.forEach((v) => {
      deleteAssign(v.uid);
    });
    tableRef.current.setSelected([]);
    ToastHandler("succ", "Item Deleted Successfully.");
  };

  const TableData = [
    { checkbox: true, skipAll: false },
    {
      name: "Employee Name",
      key: "name",
      align: "left",
      search: true,
      freezeFirst: true,
      sorting: true,
    },
    {
      name: "Date of Creation",
      key: "date",
      align: "left",
      search: true,
    },
    {
      name: "Assigned Items",
      key: "items",
      align: "center",
      search: true,
      customBody: (data) => (
        <Typography>
          <Chip
            sx={{ bgcolor: "primary.light", color: "white" }}
            size="small"
            label={data?.items?.length}
          />
        </Typography>
      ),
    },
    {
      action: true,
      name: "Action",
      freezeLast: false,
      customBody: (data, disabled) => (
        <TableActions data={data} disabled={disabled} />
      ),
    },
  ];

  const formPropsArr = [
    {
      field: {
        name: "userUid",
        options: [{ key: "Select Employee", value: "" }, ...employees] || [],
        label: "Select Employee",
        control: "select",
      },
      row: 1,
    },
    {
      field: {
        name: "itemUid",
        options: [{ key: "Select Items", value: "" }, ...items] || [],
        label: "Select Items",
        control: "select",
      },
      row: 1,
    },
    {
      field: {
        name: "date",
        label: "Select Date",
        control: "date",
      },
      row: 1,
    },
  ];

  return (
    <MyCard>
      {tableView?.view !== "table" ? (
        <CreateEmployeeItems
          data={tableView?.data}
          employees={employees}
          items={items}
          setTableView={setTableView}
        />
      ) : (
        <>
          <CommonFilter
            propsArray={formPropsArr}
            loading={isLoading || isFetching}
            handelSubmit={(e) => {
              setFilter(e);
            }}
            initialValues={filter}
            initialValues2={{
              userUid: "",
              date: "",
              itemUid: "",
            }}
            manualReset={(setFieldValue, val, init) => {
              for (const key in init) {
                setFieldValue(key, init[key]);
              }
              return init;
            }}
          />

          <CommonTable
            width={{ max: "750px" }}
            loading={isLoading}
            updating={isLoading || isFetching}
            tableName={"Employee Items Table"}
            data={{
              TableData,
              data: data || [],
              total: data?.length || 0,
              error: isError,
              param,
              setParam,
              //   refetch,
            }}
            topBtn={{
              customBtn: false,
              skipDelete: false,
              addBtn: tableAddon.btn,
              onDelete: () => {
                setOpenDel(true);
              },
            }}
            ref={tableRef}
          />

          <DeletePopup
            open={openDel}
            setOpen={setOpenDel}
            confirm={handelDelete}
            type="You want to delete the selected Assignment?"
            btnText="Delete"
          />

          <MyModal open={view?.view} setOpen={setView}>
            <MyModalUI
              open={view?.view}
              setOpen={setView}
              title={`Employee Items Information`}
              hideFooter={true}
              sx={{
                width: { sm: "90vw", md: "75vw", lg: "65vw" },
                overflow: "hidden",
              }}
            >
              <ViewOfficialData
                data={view?.data}
                setOpen={setView}
                items={items}
              />
            </MyModalUI>
          </MyModal>
        </>
      )}
    </MyCard>
  );
};

export default EmployeeItems;
