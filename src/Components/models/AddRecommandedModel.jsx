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
import axios from 'axios';

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

export default function AddRecommendedModelComponenet({ openRecommendedModel, setRecommendedModel }) {
    // console.log(openRecommendedModel, "30")
    const [items, setItems] = useState([]); // All available items
    const [selectedItem, setSelectedItem] = useState(''); // Selected item ID

    // Fetch items on mount
    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await axios.get('http://localhost:4000/api/categories');
                // Flatten all items from categories and subcategories
                const allItems = response.data.reduce((acc, category) => {
                    acc.push(...category.items);
                    category.subCategories.forEach((sub) => acc.push(...sub.items));
                    return acc;
                }, []);
                setItems(allItems.filter((item) => item.isAvailable)); // Only available items
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }
        fetchItems();
    }, []);

    const handleClose = () => {
        setRecommendedModel(false);
        setSelectedItem(''); // Reset selection on close
    };

    const handleSave = async () => {
        if (!selectedItem) {
            alert('Please select an item to recommend.');
            return;
        }
        try {
            await axios.post('http://localhost:4000/api/recommended', { items: selectedItem, isActive: true });
            console.log(`Item ${selectedItem} added to recommended list`);
            handleClose(); // Close modal on success
        } catch (error) {
            console.error('Error adding item to recommended:', error);
            alert('Failed to add item to recommended list.');
        }
    };

    const handleItemChange = (event) => {
        setSelectedItem(event.target.value);
    };

    return (
        <Modal
            open={openRecommendedModel}
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
                    Add Recommended Item
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="select-item-label" sx={{ fontFamily: 'Lora, serif' }}>
                        Select Item
                    </InputLabel>
                    <Select
                        labelId="select-item-label"
                        value={selectedItem}
                        label="Select Item"
                        onChange={handleItemChange}
                        sx={{ fontFamily: 'Merriweather, serif' }}
                    >
                        <MenuItem value="" disabled sx={{ fontFamily: 'Merriweather, serif' }}>
                            -- Choose an Item --
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