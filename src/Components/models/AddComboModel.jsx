import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getMenu } from '../../apis/apis';
import { menuAction } from '../../Redux/Actions/menu.action';
// import { getMenu } from '../apis/apis'; // Ensure this path matches your project
// import { menuAction } from '../Redux/Actions/menu.action'; // Ensure this path matches your project

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400, md: 450 }, // Responsive width
    maxHeight: '80vh', // Limit height for small screens
    overflowY: 'auto', // Scroll if content overflows
    bgcolor: 'background.paper',
    border: '2px solid #4a3424', // Match your theme
    boxShadow: 24,
    p: { xs: 2, sm: 4 }, // Responsive padding
    borderRadius: '12px', // Rounded corners
    fontFamily: 'Merriweather, serif',
};

export default function AddComboModel({ openComboModel, setOpenComboModel }) {
    const [items, setItems] = useState([]); // All available items
    const [selectedItems, setSelectedItems] = useState([]); // Selected item IDs (multi-select)
    const [comboPrice, setComboPrice] = useState(''); // Combo offer price
    const dispatch = useDispatch();

    // Fetch items on mount
    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await axios.get("https://cafe-show-backend.onrender.com/api/items");
                if (response.data?.data) {
                    setItems(response.data.data.filter(item => item.isAvailable)); // Only available items
                }
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }
        fetchItems();
    }, []);

    const handleClose = () => {
        setOpenComboModel(false);
        setSelectedItems([]); // Reset selection on close
        setComboPrice(''); // Reset price on close
    };

    const handleSave = async () => {
        if (selectedItems.length < 2) {
            alert('Please select at least two items for a combo offer.');
            return;
        }

        if (!comboPrice) {
            alert('Please enter a combo price.');
            return;
        }

        const price = parseFloat(comboPrice);
        if (isNaN(price) || price < 0) {
            alert('Combo price must be a positive number.');
            return;
        }

        try {
            const response = await axios.post('https://cafe-show-backend.onrender.com/api/combo', {
                items: selectedItems,// Format as array of objects
                comboPrice: price
            });

            if (response.status === 201 || response.status === 200) { // Check for success
                const menu = await getMenu();
                dispatch(menuAction(menu));
                console.log(`Combo offer added with items ${selectedItems} and price ₹${price}`);
                handleClose(); // Close modal on success
            }
        } catch (error) {
            console.error('Error adding combo offer:', error);
            alert('Failed to add combo offer.');
        }
    };

    const handleItemChange = (event) => {
        console.log(event.target.value)
        setSelectedItems(event.target.value); // Multi-select returns an array
    };

    const handlePriceChange = (event) => {
        setComboPrice(event.target.value);
    };

    return (
        <Modal
            open={openComboModel}
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
                        fontFamily: 'Lora, serif',
                        color: '#4a3424',
                        fontWeight: 'bold',
                        mb: 2,
                        textAlign: 'center',
                    }}
                >
                    Add Combo Offer
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="select-items-label" sx={{ fontFamily: 'Lora, serif' }}>
                        Select Items
                    </InputLabel>
                    <Select
                        labelId="select-items-label"
                        multiple
                        value={selectedItems}
                        label="Select Items"
                        onChange={handleItemChange}
                        sx={{ fontFamily: 'Merriweather, serif' }}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => {
                                    const item = items.find(i => i._id === value);
                                    return item ? item.name : value;
                                }).join(', ')}
                            </Box>
                        )}
                    >
                        <MenuItem value="" disabled sx={{ fontFamily: 'Merriweather, serif' }}>
                            -- Choose Items (Select at least 2) --
                        </MenuItem>
                        {items.map((item) => (
                            <MenuItem
                                key={item._id}
                                value={item._id}
                                sx={{ fontFamily: 'Merriweather, serif' }}
                            >
                                {item.name} (₹{item.price})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Combo Price"
                    value={comboPrice}
                    onChange={handlePriceChange}
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }} // Allow decimals, enforce positive
                    sx={{
                        mb: 3,
                        fontFamily: 'Merriweather, serif',
                        '& .MuiInputLabel-root': { fontFamily: 'Lora, serif' },
                        '& .MuiInputBase-input': { fontFamily: 'Merriweather, serif' }
                    }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            flex: 1,
                            bgcolor: '#28a745',
                            color: 'white',
                            fontFamily: 'Lora, serif',
                            fontWeight: '600',
                            borderRadius: '8px',
                            '&:hover': { bgcolor: '#218838' },
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={{
                            flex: 1,
                            borderColor: '#d32f2f',
                            color: '#d32f2f',
                            fontFamily: 'Lora, serif',
                            fontWeight: '600',
                            borderRadius: '8px',
                            '&:hover': { borderColor: '#c62828', color: '#c62828' },
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}