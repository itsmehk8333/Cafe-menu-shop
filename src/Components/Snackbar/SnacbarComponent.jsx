import { Snackbar, Alert, Slide } from "@mui/material";
import { createContext, useContext, useState } from "react";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // Can be "success" or "error"
  });

  // Function to trigger Snackbar
  const showSnackbar = (success, message) => {
    setSnackbar({
      open: true,
      message,
      severity: success ? "success" : "error",
    });
  };

  // Close Snackbar
  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
            sx={{margin:"30px"}}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={Slide} // ✅ Pass function, not JSX
        transitionDuration={500} // Adjust speed (optional)
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionProps={{ direction: "up" }} // ✅ Pass props separately
      >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom Hook to Use Snackbar
export const useSnackbar = () => useContext(SnackbarContext);
