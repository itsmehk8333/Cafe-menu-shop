import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  useMediaQuery,
  Grid,
} from "@mui/material";
import axios from "axios";
import { menuAction } from "../../Redux/Actions/menu.action";
import { SnackbarContext } from "../Snackbar/SnacbarComponent";
import { getMenu } from "../../apis/apis";

const AddCategoryModel = ({ openCategoryModel, setOpenCategoryModel }) => {
  const handleClose = () => setOpenCategoryModel(false);
  const [categoryName, setCategoryName] = React.useState("");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 900px)");
  const { showSnackbar } = React.useContext(SnackbarContext)
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "95%" : isMediumScreen ? "60%" : "40%",
    maxWidth: 280,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: isSmallScreen ? 3 : 4,
    borderRadius: 3,
    textAlign: "center",
  };

  const addCategory = () => {
    axios
      .post("https://cafe-show-backend.onrender.com/api/categories", {
        name: categoryName,
      })
      .then(async (response) => {
        if (response) {
          setOpenCategoryModel(false);
          const menu = await getMenu();
          dispatch(menuAction(menu))
          showSnackbar(true, "Success")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      open={openCategoryModel}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{
            fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
            fontWeight: "bold",
          }}
        >
          Add Category
        </Typography>

        <Box sx={{ margin: "20px 0" }}>
          <TextField
            type="text"
            placeholder="Enter Category Name"
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ marginTop: "15px" }}
        >
          <Grid item xs={12} sm={6}>
            <Button
              onClick={addCategory}
              color="success"
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "8px",
                fontSize: isSmallScreen ? "0.9rem" : "1rem",
                padding: isSmallScreen ? "6px" : "8px",
              }}
            >
              Add
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={handleClose}
              color="error"
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "8px",
                fontSize: isSmallScreen ? "0.9rem" : "1rem",
                padding: isSmallScreen ? "6px" : "8px",
              }}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddCategoryModel;
