import React, { useState } from "react";
import GridOnIcon from "@mui/icons-material/GridOn";
import { Grid, CircularProgress, Tooltip } from "@mui/material";
import MyButton from "./MyButton";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import moment from "moment";

export const getAlphabetForExcel = (number) => {
  let result = "";
  while (number > 0) {
    let modulo = (number - 1) % 26;
    result = String.fromCharCode(65 + modulo) + result;
    number = Math.floor((number - 1) / 26);
  }
  return result;
};

export const wbToBlob = async (wb) => {
  const res = await XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([res], { type: `application/octet-stream` });
  return blob;
};

export const downloadExcel = (file, title, setLoading) => {
  let anchor = document.createElement(`a`);
  anchor.href = URL.createObjectURL(file);
  anchor.download = title;
  anchor.click();
  anchor.remove();

  setLoading && setLoading(false);
};

function MyExportPopup({
  title,
  pdfProps,
  excelProps,
  autoTableStyles,
  autoTableHeadStyles,
  marginRight,
  marginLeft,
  withoutExportSx,
  disabled,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  const [excelOrPdf, setExcelOrPdf] = useState(null);

  const addStyleTOExcel = async (wbBlob, data) => {
    XlsxPopulate.fromDataAsync(wbBlob).then(async (wb) => {
      let range = getAlphabetForExcel(props?.rows?.length + 1);

      let dataInfo = {};
      if (props.subTitle) {
        dataInfo = {
          firstRow: `A1:${range + 1}`,
          titleRange: `A2:${range + 2}`,
          dateRange: `A3:${range + 3}`,
          subTitleRange: `A5:${range + 5}`,
          headRange: `A6:${range + 6}`,
          headRow: 6,
          bodyStartRow: 7,
        };
      } else {
        dataInfo = {
          firstRow: `A1:${range + 1}`,
          titleRange: `A2:${range + 2}`,
          dateRange: `A3:${range + 3}`,
          headRange: `A5:${range + 5}`,
          headRow: 5,
          bodyStartRow: 6,
        };
      }

      await wb.sheets().forEach(async (sheet) => {
        // sheet.usedRange().style({
        //   fontFamily: "Cambria",
        // });

        if (props.subTitle) {
          sheet.row(1).height(26);
          sheet.row(2).height(18);
          sheet.row(3).height(16);
          sheet.row(5).height(18);
          sheet.row(6).height(24);
        } else {
          sheet.row(1).height(26);
          sheet.row(2).height(18);
          sheet.row(3).height(16);
          sheet.row(5).height(24);
        }

        sheet.range(dataInfo.headRange).style({
          bold: true,
          fill: "8fd6f8",
          fontSize: "12",
          border: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });

        if (props?.rows) {
          props?.rows.length &&
            [...(props?.rows || {})].forEach((d, i) => {
              if (d?.excelStyles) {
                const temp = { ...d?.excelStyles };
                temp?.width && delete temp.width;
                const range = getAlphabetForExcel(i + 2);
                sheet
                  .range(
                    `${range}${dataInfo.bodyStartRow}:${range}${data.length}`
                  )
                  .style(temp);
                d?.excelStyleObj && d?.styleObj(sheet);
              }
            });
        }

        if (props?.header) {
          props?.header.length &&
            ["S.No.", ...(props?.header || [])].forEach((d, i) => {
              if (d?.excelStyles) {
                const { height, ...rest } = d.excelStyles;
                rest?.width && delete rest.width;
                const range = getAlphabetForExcel(i + 1);
                sheet.cell(`${range}${dataInfo.headRow}`).style(rest);
                d?.excelStyles?.height &&
                  sheet.row(dataInfo.headRow).height(height);
                d?.excelStyleObj && d?.styleObj(sheet);
              }
            });
        }

        sheet.column("A").style({
          bold: true,
        });
        sheet.column(range).style({
          bold: true,
        });

        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          horizontalAlignment: "left",
          verticalAlignment: "center",
          fontSize: "16",
          // fill: "8fd6f8",
        });

        dataInfo.firstRow &&
          sheet.range(dataInfo.firstRow).merged(true).style({
            bold: true,
            horizontalAlignment: "left",
            verticalAlignment: "center",
            fontSize: "20",
            // fill: "8fd6f8",
          });

        sheet.range(dataInfo.dateRange).merged(true).style({
          bold: true,
          // fill: "8fd6f8",
          fontSize: "13",
          horizontalAlignment: "left",
          verticalAlignment: "center",
        });

        dataInfo.schoolAddressRange &&
          sheet.range(dataInfo.schoolAddressRange).merged(true).style({
            bold: true,
            // fill: "8fd6f8",
            fontSize: "13",
            horizontalAlignment: "left",
            verticalAlignment: "center",
          });
      });

      wb.outputAsync().then((file) => {
        downloadExcel(file, title, setLoading);
      });
    });
  };

  // excel data extraction
  const mutateExcelData = async (data, resolve, reject) => {
    if (data.length && props?.rows) {
      let excel = [];
      if (props.subTitle) {
        excel = [
          { A: "W A P C O S" },
          { A: title },
          { A: `(Date:${moment().format("DD-MM-YYYY")})` },
          { A: `${props?.subTitle}` },
          {},
        ];
      } else {
        excel = [
          { A: "W A P C O S" },
          { A: title },
          { A: `(Date:${moment().format("DD-MM-YYYY")})` },
          {},
        ];
      }

      const header = {};
      let counter = 0;
      props?.header.length &&
        ["S.No.", ...(props?.header || [])].map((r, i) => {
          let rowRange = getAlphabetForExcel(i + 1);
          header[rowRange] = r?.name || r;
        });
      excel.push(header);
      data.length &&
        data.forEach((d, i) => {
          const rowsGenerate = (d) => {
            const temp = {};
            let rowRange = getAlphabetForExcel(1);
            temp[rowRange] = counter + 1;
            props.rows.length &&
              props.rows.map((r, i) => {
                let rowRange = getAlphabetForExcel(i + 2);
                if (typeof r === "string" || r instanceof String) {
                  temp[rowRange] = d[r]
                    ? `${d[r]} `
                    : props?.hideHiphen
                    ? ""
                    : "-";
                } else {
                  temp[rowRange] = r?.mutate
                    ? r.mutate({ d, k: r.key, i })
                    : d[r.key]
                    ? `${d[r.key]} `
                    : props?.hideHiphen
                    ? ""
                    : "-";
                }
              });
            counter++;
            return temp;
          };

          if (props?.mutateRes) {
            const res = props?.mutateRes(d, rowsGenerate);
            excel.push(...res);
          } else {
            excel.push(rowsGenerate(d));
          }
        });
      excel?.length ? resolve(excel) : reject();
      return excel;
    } else {
      reject();
      return [];
    }
  };
  // excel and pdf data extraction

  const ExportToExcel = async (resData) => {
    setExcelOrPdf("excel");

    const data = props?.endPoint
      ? resData
      : props?.dataFun
      ? await props?.dataFun()
      : props?.data;

    const excelPromise = new Promise((resolve, reject) => {
      mutateExcelData(data, resolve, reject);
    });

    excelPromise.then(async (res) => {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(res, { skipHeader: true });
      XLSX.utils.book_append_sheet(wb, ws);

      ws["!cols"] = [
        {},
        ...(props?.rows.map((d) => {
          return { wch: d?.excelStyles?.width || 26 };
        }) || []),
      ];

      const wbBlob = await wbToBlob(wb);
      await addStyleTOExcel(wbBlob, res);
    });
  };

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "right",
          rowGap: "10px",
          ...withoutExportSx,
        }}
      >
        <Tooltip arrow title={"Export in excel"}>
          <Grid>
            <MyButton
              variant="outlined"
              disabled={
                props?.disabledExcel || disabled
                  ? true
                  : props?.totalRecords || props?.url
                  ? false
                  : loading || props?.data?.length || props?.dataFun
                  ? false
                  : true
              }
              color="success"
              onClick={() => {
                !loading && setLoading(true);
                !loading && ExportToExcel();
              }}
              sx={{
                minWidth: "40px",
                p: 0,
                mr: "10px",
                display: "flex",
                alignItem: "center",
                justifyContent: "center",
              }}
            >
              {loading && excelOrPdf == "excel" ? (
                <CircularProgress size="22px" sx={{ color: "primary.main" }} />
              ) : (
                <GridOnIcon fontSize="small" />
              )}
            </MyButton>
          </Grid>
        </Tooltip>
      </Grid>
    </>
  );
}

export default React.memo(MyExportPopup);
