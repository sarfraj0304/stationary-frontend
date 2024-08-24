import React from "react";
import { Avatar, TextField, Box, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MyButton from "../../common/MyButton";
import MyCard from "../../common/MyCard";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("email") === "abdulmanan" &&
      data.get("password") === "abdul@123"
    ) {
      sessionStorage.setItem("token", "stationary");
      return navigate("/stationary");
    }
  };

  return (
    <>
      <MyCard
        sx={{
          p: 3,
          width: { xs: "90%", sm: "80%", md: "60%", lg: "40%" },
          margin: "auto",
          mt: 10,
          boxShadow:
            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "color.pink.secondary" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <MyButton type="submit" fullWidth variant="contained">
              Sign In
            </MyButton>
          </Box>
        </Box>
      </MyCard>
    </>
  );
}
