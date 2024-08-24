import React, { useEffect, useLayoutEffect, useState } from "react";
import MyTabs, { TabPanel } from "../../common/MyTabs";
import { Grid, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateEmployee from "./StationaryTabs/CreateEmployee";
import CreateItems from "./StationaryTabs/CreateItems";
import EmployeeItems from "./StationaryTabs/EmployeeItemsPart.js/EmployeeItems";
import { useEmployeeGetQuery, useItemsGetQuery } from "./StationaryQuery";
import MyButton from "../../common/MyButton";

const StationaryPage = () => {
  const [params, setParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [value, setValue] = useState(
    params.get("tab") ? Number(params.get("tab")) - 1 : 0
  );
  const labelArray = [
    {
      title: "Create Employees",
    },
    {
      title: "Create Items",
    },
    {
      title: "Item Distribution",
    },
  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setParams({ tab: newValue + 1 });
  };

  const { data, isLoading, isFetching, isError } = useEmployeeGetQuery();
  const {
    data: itemData,
    isLoading: itemLoading,
    isFetching: itemFetching,
    isError: itemError,
  } = useItemsGetQuery();

  useLayoutEffect(() => {
    let token = sessionStorage.getItem("token");
    if (token != "stationary") {
      return navigate("/");
    }
  }, [value, isLoading, isFetching, data]);

  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      const temp = data?.data?.map((el) => ({
        key: el?.name,
        value: el?.uid,
      }));
      setEmployees(temp);
    }
  }, [data, isLoading, isFetching]);

  useEffect(() => {
    if (itemData && !itemLoading && !itemFetching) {
      const temp = itemData?.data?.map((el) => ({
        key: el?.name,
        value: el?.uid,
        quantity: el?.quantity,
      }));
      setItems(temp);
    }
  }, [itemData, itemLoading, itemFetching]);

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          p: 5,
        }}
      >
        <Typography
          sx={{
            fontSize: "30px",
            textAlign: "center",
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          WAPCOS STATIONARY (INFS-II)
        </Typography>

        <MyButton
          onClick={() => {
            sessionStorage.removeItem("token");
            navigate("/");
          }}
          sx={{
            bgcolor: "rgba(241, 80, 80, 0.70)",
            "&:hover": {
              bgcolor: "rgba(241, 80, 80, 1)",
            },
          }}
        >
          Logout
        </MyButton>
      </Grid>
      <Grid sx={{ padding: "0px 20px" }}>
        <MyTabs value={value} onChange={handleChange} array={labelArray}>
          <TabPanel value={value} index={0}>
            <CreateEmployee
              data={data}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid>
              <CreateItems
                data={itemData}
                isLoading={itemLoading}
                isFetching={itemFetching}
                isError={itemError}
              />
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Grid>
              <EmployeeItems employees={employees} items={items} />
            </Grid>
          </TabPanel>
        </MyTabs>
      </Grid>
    </>
  );
};

export default StationaryPage;
