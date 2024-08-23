import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Grid } from "@mui/material";
import LoginForm from "./Components/Login/LoginForm";
import StationaryPage from "./Components/MainPage/StationaryPage";

function App() {
  return (
    <Grid>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/stationary" element={<StationaryPage />} />
      </Routes>
    </Grid>
  );
}

export default App;
