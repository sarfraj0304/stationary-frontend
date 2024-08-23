import { Chip, Grid, Typography } from "@mui/material";
import React, { useRef } from "react";
import CommonTable from "../../../../common/CommonTable";
import { useSearchParams } from "react-router-dom";

const ViewOfficialData = ({ data, items }) => {
  const tableRef = useRef();
  const [param, setParam] = useSearchParams();

  const TableData = [
    {
      name: "Items",
      key: "name",
      align: "left",
      search: true,
      freezeFirst: true,
    },
    {
      name: "Quantity",
      key: "items",
      align: "center",
      search: true,
      customBody: (data) => (
        <Typography>
          <Chip
            sx={{ bgcolor: "primary.light", color: "white" }}
            size="small"
            label={data?.quantity}
          />
        </Typography>
      ),
    },
  ];

  return (
    <Grid sx={{ width: "100%" }}>
      <Grid
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid
          sx={{
            width: "35%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Grid sx={{ fontSize: "18px", fontWeight: "bold" }}>Name</Grid>
          <Grid>:</Grid>
          <Grid>{data?.name}</Grid>
        </Grid>
        <Grid
          sx={{
            width: "35%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Grid sx={{ fontSize: "18px", fontWeight: "bold" }}>Date</Grid>
          <Grid>:</Grid>
          <Grid>{data?.date}</Grid>
        </Grid>
      </Grid>
      <Typography sx={{ fontSize: "18px", fontWeight: "bold", mt: 3 }}>
        Allocated Items
      </Typography>
      <CommonTable
        width={{ max: "750px" }}
        loading={false}
        updating={false}
        data={{
          TableData,
          data:
            data?.items?.map((el) => ({
              ...el,
              name: items?.find((t) => t?.value == el?.itemUid)?.key,
            })) || [],
          total: data?.items?.length || 0,
          error: false,
          param,
          setParam,
          //   refetch,
        }}
        topBtn={{
          customBtn: false,
          skipDelete: false,
        }}
        ref={tableRef}
      />
    </Grid>
  );
};

export default ViewOfficialData;
