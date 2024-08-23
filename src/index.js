import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { ToastContainer } from "react-toastify";
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { getDesignTheme } from "./Theme/DesignTheme";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const root = ReactDOM.createRoot(document.getElementById("root"));
const theme = responsiveFontSizes(createTheme(getDesignTheme("light")));
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <BrowserRouter>
          <CssBaseline />
          <ToastContainer />
          <App />
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  </Provider>
);

reportWebVitals();
