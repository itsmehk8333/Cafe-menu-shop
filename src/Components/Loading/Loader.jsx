import React, { useContext } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { LoadingContext } from "./useLoading";
// import { useLoading } from "./useLoading";
// import { useLoading } from "../context/LoadingContext";

const Loader = () => {

  const { loadingBackdrop } = useContext(LoadingContext);
  console.log("🌀 Loader State:", { loadingBackdrop }); // Debugging loading state
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: 2000, // 🔥 Fix: Ensure it's higher than MUI modal (default 1300)
        position: "fixed", // Make sure it covers the full screen
      }}
      open={loadingBackdrop}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
