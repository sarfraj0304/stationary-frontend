import {
  CircularProgress,
  // CircularProgress,
  Grid,
  Slide,
  Tooltip,
} from "@mui/material";
import React, { useRef, useState } from "react";
import DynamicForm from "../../../../common/DynamicForm";
import moment from "moment";
import MyIconButton from "../../../../common/MyIconButton";
import MyButton from "../../../../common/MyButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import * as Yup from "yup";
import { useCreateUserItemsMutation } from "../../StationaryQuery";
import ToastHandler from "../../../../common/ToastHandler";

const CreateEmployeeItems = ({ data, employees, items, setTableView }) => {
  const dynamicForm1 = useRef();
  const dynamicForm2 = useRef();
  const [basicDetail, setBasicDetail] = useState({ user: "", date: "" });
  const [stationaryItem, setStationaryItem] = useState([]);
  const [reset, setReset] = useState(false);
  const [UserItemMutate, { isLoading }] = useCreateUserItemsMutation();

  const handleResetForm = async () => {
    dynamicForm1?.current?.handleReset();
    dynamicForm2?.current?.handleReset();
    setReset(false);
  };

  const inputData1 = [
    {
      name: "user",
      label: "Select Employee",
      type: "select",
      options: (e) => {
        return employees || [];
      },
      validation: Yup.string()
        .required("Field can't be empty")
        .typeError("Field can't be empty"),
      width: 6,
      required: true,
      disabled: data?.uid ? true : false,
    },
    {
      name: "date",
      label: "Select Date",
      type: "date",
      width: 6,
      sx: { mt: "3px" },
      validation: Yup.string()
        .typeError("Please enter a valid date.")
        .required("Field can't be empty.")
        .test("isValidDate", "Please enter a valid date.", (value) => {
          return moment(value, "DD-MM-YYYY")?.isValid();
        }),
      required: true,
      disabled: data?.uid ? true : false,
    },
  ];
  const inputData2 = [
    {
      name: "itemUid",
      label: "Select Items",
      type: "select",
      options: (e, state) => {
        return items || [];
      },
      validation: Yup.string()
        .required("Field can't be empty")
        .typeError("Field can't be empty"),
      width: 6,
      required: true,
    },
    {
      name: "quantity",
      label: "Select Quantity",
      type: "select",
      options: (e) => {
        // let temp = items?.find((el) => el?.value == e?.itemUid)?.quantity;
        return (
          new Array(100)
            .fill(0)
            .map((el, i) => ({ key: i + 1, value: i + 1 })) || []
        );
      },
      validation: Yup.string()
        .required("Field can't be empty")
        .typeError("Field can't be empty"),
      width: 6,
      required: true,
    },
  ];

  const handleSubmit = async () => {
    const form1 = await dynamicForm1?.current?.onSubmit();
    const form2 = await dynamicForm2?.current?.onSubmit();

    if (form1 || form2) return;

    let dataToSend = {
      date: basicDetail?.date,
      items: stationaryItem,
      user: basicDetail.user,
    };

    const res = await UserItemMutate({
      url: data?.uid ? `user-item-update/${data?.uid}` : `user-item-create`,
      method: data?.uid ? "PUT" : "POST",
      body: dataToSend,
    });
    console.log(res);
    if (res?.data?.statusCode == 200 || res?.data?.statusCode == 201) {
      ToastHandler("succ", res?.data?.msg);
      setTableView({ view: "table", data: null });
    } else {
      ToastHandler("warn", res?.error?.data?.msg);
    }
  };

  return (
    <Grid>
      <DynamicForm
        initialValues={[
          {
            user: data?.user ? data?.user?.["_id"] : "",
            date: data?.date
              ? moment(data?.date, "DD-MM-YYYY").format("DD-MM-YYYY")
              : "",
          },
        ]}
        initialData={{
          user: "",
          date: "",
        }}
        hideAddBtn={true}
        handleChange={(e) => {
          setBasicDetail(e[0]);
        }}
        inputData={inputData1}
        hideAllSideButton={true}
        hideSubmitBtn={true}
        handleSubmit={(state, error) => {
          return error;
        }}
        ref={dynamicForm1}
      />
      <Grid
        sx={{
          mt: "-20px",
          width: "100%",
          maxHeight: { xl: "55vh", lg: "39vh", md: "45vh", sm: "45vh" },
          overflowY: "scroll",
          overflowX: "hidden",
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
        }}
      >
        <DynamicForm
          initialValues={
            data?.items?.length
              ? data?.items.map((elem) => ({
                  itemUid: elem.itemUid,
                  quantity: elem.quantity,
                }))
              : [
                  {
                    itemUid: "",
                    quantity: "",
                  },
                ]
          }
          rowGap={"5px"}
          initialData={{
            itemUid: "",
            quantity: "",
          }}
          hideAddBtn={true}
          hideSubmitBtn={true}
          inputData={inputData2}
          handleChange={(e) => {
            setStationaryItem(e);
          }}
          ref={dynamicForm2}
          handleSubmit={(state, error) => {
            return error;
          }}
        />
      </Grid>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          p: 2,
        }}
      >
        <Grid
          sx={{
            width: "60px",
            mr: "-20px",
            overflow: "hidden",
          }}
        >
          <Grid
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Slide in={reset} direction="left" mountOnEnter unmountOnExit>
              <Grid>
                <MyIconButton onClick={handleResetForm}>
                  <Tooltip title="Reset">
                    <RestartAltIcon color="warning" />
                  </Tooltip>
                </MyIconButton>
              </Grid>
            </Slide>
          </Grid>
        </Grid>
        <MyButton
          color="disable"
          onClick={() => {
            setTableView({ view: "table", data: null });
          }}
          disabled={false}
        >
          Back
        </MyButton>
        <MyButton onClick={handleSubmit} disabled={false}>
          {isLoading ? (
            <CircularProgress size={30} sx={{ color: "primary.main" }} />
          ) : (
            "Submit"
          )}
        </MyButton>
      </Grid>
    </Grid>
  );
};

export default CreateEmployeeItems;
