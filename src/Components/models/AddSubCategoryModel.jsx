import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Select, TextField, Grid } from '@mui/material';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import { getMenu } from '../../apis/apis';
import { menuAction } from '../../Redux/Actions/menu.action';
import { useDispatch } from 'react-redux';
import { LoadingContext } from '../Loading/useLoading';
import { SnackbarContext } from '../Snackbar/SnacbarComponent';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AddSubCategoryModel({ openSubCategoryModel, setOpenSubCategoryModel }) {
    const handleClose = () => setOpenSubCategoryModel(false);
    const [categories, setCategories] = React.useState([]);
    const [categoryValue, setCategoryValue] = React.useState("");
    const [subCategoryName, setSubCategoryName] = React.useState("");
    const dispatch = useDispatch();
    const { loadingBackdrop, setLoadingBackDrop } = React.useContext(LoadingContext);
    const { showSnackbar } = React.useContext(SnackbarContext)
    React.useEffect(() => {
        setLoadingBackDrop(true)
        try {
            axios.get("http://localhost:4000/api/categories").then(data => {
                if (data) {
                    setCategories(data.data);
                }
            });
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoadingBackDrop(false)
        }
    }, []);


    function addSubCategory() {
        setLoadingBackDrop(true)
        try {
            axios.post(`http://localhost:4000/api/subcategories`, {
                name: subCategoryName,
                categoryId: categoryValue
            }).then(async (data) => {
                if (data) {
                    const menu = await getMenu();
                    dispatch(menuAction(menu))
                    showSnackbar(true, "Success")
                    handleClose();

                }
            })
        } catch (error) {
            showSnackbar(false, "Error, Try Again!!!")
        } finally {
            setLoadingBackDrop(false)
        }

    }

    return (
        <Modal
            open={openSubCategoryModel}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ textAlign: "center" }} component="h2">
                            Add Sub Category
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Select
                            value={categoryValue}
                            displayEmpty
                            onChange={(e) => setCategoryValue(e.target.value)}
                            fullWidth
                            size='small'
                        >
                            <MenuItem value="" disabled>
                                Please select the Category
                            </MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            placeholder="Enter the Sub Category Name"
                            fullWidth
                            onChange={(e) => { setSubCategoryName(e.target.value) }}
                            value={subCategoryName}
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="success" fullWidth onClick={addSubCategory} >
                            ADD
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="error" fullWidth onClick={handleClose}>
                            CANCEL
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}