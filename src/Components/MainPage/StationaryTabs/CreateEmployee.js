import React, { useRef, useState } from "react";
import MyCard from "../../../common/MyCard";
import { Grid, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CommonTable from "../../../common/CommonTable";
import { useSearchParams } from "react-router-dom";
import { useCreateEmployeeMutation } from "../StationaryQuery";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MyButton from "../../../common/MyButton";
import ToastHandler from "../../../common/ToastHandler";
import { DeletePopup } from "../../../common/MyModal";

const CreateEmployee = ({ data, isLoading, isFetching, isError }) => {
  const [openDel, setOpenDel] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const tableRef = useRef();
  const [param, setParam] = useSearchParams();

  const [createEmployees] = useCreateEmployeeMutation();
  const tableAddon = {
    btn: (
      <>
        <MyButton
          color="primary"
          onClick={() => {
            setAddNew(true);
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
            setAddNew(data?.uid);
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
      </Grid>
    );
  };

  const TableData = [
    { checkbox: true, skipAll: false },
    {
      name: "Employee Name",
      key: "name",
      align: "left",
      search: true,
      freezeFirst: false,
      sorting: true,
      edit: true,
      editValidation: { type: "true", max: 100, required: true },
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

  const handelDelete = () => {
    setOpenDel(false);
    const deleteEmployees = async (uid) => {
      await createEmployees({
        url: `delete-user/${uid}`,
        method: "DELETE",
      });
    };
    tableRef?.current?.getSelected()?.forEach((v) => {
      deleteEmployees(v.uid);
    });
    tableRef.current.setSelected([]);
    ToastHandler("succ", "User Deleted Successfully.");
  };

  const onSubmit = async (data) => {
    const res = await createEmployees({
      url: data?.uid ? `update-user/${data?.uid}` : `create-user`,
      method: data?.uid ? "PUT" : "POST",
      body: {
        name: data?.name,
      },
    });
    if (res?.data?.statusCode == 200 || res?.data?.statusCode == 201) {
      setAddNew(false);
      ToastHandler("succ", res?.data?.msg);
    }
  };
  return (
    <MyCard>
      <CommonTable
        width={{ max: "750px" }}
        loading={isLoading}
        updating={isLoading || isFetching}
        tableName={"Employee Table"}
        editing={{
          new: addNew,
          onSubmit,
          onClose: () => setAddNew(false),
        }}
        data={{
          TableData,
          data: data?.data,
          total: data?.data?.length,
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
        type="You want to delete the selected Employee?"
        btnText="Delete"
      />
    </MyCard>
  );
};

export default CreateEmployee;
