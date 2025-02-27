import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Select, TextField, Grid } from '@mui/material';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import { getMenu } from '../../apis/apis';
import { useDispatch } from 'react-redux';
import { menuAction } from '../../Redux/Actions/menu.action';
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

function AddItemModel({ openItemModel, setOpenItemModel }) {
    const [categoryValues, setCategotyValues] = React.useState([])
    const [selectedCategoryValue, setSelectedCategoryValue] = React.useState("");
    const [subCategories, setSubCategories] = React.useState([]);
    const [selectedSubCategory, setSelectedCategory] = React.useState("");
    const [itemName, setNameItem] = React.useState("");
    const [itemPrice, setItemPrice] = React.useState(0);
    const dispatch = useDispatch();
    const [foodType, setFoodType] = React.useState("");
    const { showSnackbar } = React.useContext(SnackbarContext)
    const { loadingBackdrop, setLoadingBackDrop } = React.useContext(LoadingContext);
    // console.log(showSnackbar , "snackbar")
    //  console.log(loading , setLoading , "add model")
    React.useEffect(() => {
        axios.get("http://localhost:4000/api/categories").then(data => {
            if (data) {
                setCategotyValues(data.data);
                setOpenItemModel(false)
            }
        });
    }, []);

    const getSubCategories = (e) => {
        const value = e.target.value;
        setSelectedCategoryValue(value);
        axios.get(`http://localhost:4000/api/subcategories/${value}`).then(data => {
            // console.log(data.data.data, "dataaa")
            if (data.data) {
                setSubCategories(data.data.data)

            }
        })
    }

    const addItemFunction = () => {
        try {
            setLoadingBackDrop(true)
            axios.post('http://localhost:4000/api/items', {
                name: itemName,
                price: itemPrice,
                subCategoryId: selectedSubCategory,
                categoryId: selectedCategoryValue,
                Grub: foodType
            }).then(async (data) => {
                if (data) {
                    setOpenItemModel(false)
                    const menu = await getMenu();
                    dispatch(menuAction(menu))
                    // setLoadingBackDrop(false)
                    showSnackbar(true, "Success")
                    // setCategotyValues("");
                    setItemPrice("");
                    setNameItem("");
                    setSelectedCategory("");
                    setSelectedCategoryValue("");
                }
            })
        } catch (error) {
            showSnackbar(false, "Error, Try Again!!!");
            setLoadingBackDrop(false);
        } finally {
            setLoadingBackDrop(false)
        }
    }

    return (
        <Modal
            open={openItemModel}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" component="h2">
                            Add Item Category
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Select
                            value={selectedCategoryValue}
                            displayEmpty
                            onChange={getSubCategories}
                            fullWidth
                            size='small'
                        >
                            <MenuItem value="" disabled>
                                Please select the Category
                            </MenuItem>
                            {categoryValues?.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>

                    </Grid>
                    <Grid item xs={12}>
                        <Select
                            value={selectedSubCategory}
                            displayEmpty
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            fullWidth
                            size='small'
                        >
                            <MenuItem value="" disabled>
                                Please select the Sub Category
                            </MenuItem>
                            {subCategories?.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            placeholder="Enter the Item Name"
                            fullWidth
                            onChange={(e) => { setNameItem(e.target.value) }}
                            value={itemName}
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="number"
                            placeholder="Enter the Price"
                            fullWidth
                            inputProps={{ min: 0 }}
                            onChange={(e) => { setItemPrice(e.target.value) }}
                            value={itemPrice}
                            size='small'
                        />

                    </Grid>
                    <Grid item xs={12}>
                        {/* <TextField
                            type="text"
                            placeholder="Enter the Food Type"
                            fullWidth
                            // inputProps={{ min: 0 }}
                            onChange={(e) => { setFoodType(e.target.value) }}
                            value={foodType}
                            size='small'
                        /> */}
                        <Select
                            value={foodType}
                            displayEmpty
                            onChange={(e) =>
                                setFoodType(e.target.value)
                            }
                            fullWidth
                            
                            size='small'
                            placeholder="Please select the food Type"
                        >
                            <MenuItem value="" disabled>
                                Please select the food Type
                            </MenuItem>
                            {/* {subCategories?.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))} */}
                            <MenuItem value={"Veg"}>Veg</MenuItem>
                            <MenuItem value={"Non Veg"}>Non Veg</MenuItem>
                            <MenuItem value={"Veegan"}>Veegan</MenuItem>
                            <MenuItem value={"Others"}>Others</MenuItem>
                        </Select>

                    </Grid>

                    <Grid item xs={6}>
                        <Button variant="contained" color="success" fullWidth
                            onClick={addItemFunction}
                        >
                            ADD
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="error" fullWidth
                            onClick={() => {
                                setOpenItemModel(false);
                                setSelectedCategory("");
                                setSelectedCategoryValue("")

                            }}
                        >
                            CANCEL
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default React.memo(AddItemModel)