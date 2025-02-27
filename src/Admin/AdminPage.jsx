import React, { useState, useCallback, useEffect, useContext } from 'react';
import './AdminPage.css';
import axios from 'axios';
import AddCategoryModel from '../Components/models/AddCategoryModel';
import AddSubCategoryModel from '../Components/models/AddSubCategoryModel';
import AddItemModel from '../Components/models/AddItemComponent';
import AddComboModel from '../Components/models/AddComboModel';
import { getMenu } from '../apis/apis';
import { useDispatch, useSelector } from 'react-redux';
import { menuAction } from '../Redux/Actions/menu.action';
import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import { LoadingContext } from '../Components/Loading/useLoading';
import AddRecommendedModel from '../Components/models/AddRecommandedModel';
import AddSpecialOfferModel from '../Components/models/AddSpecailOfferModel';
import { ConnectingAirportsOutlined } from '@mui/icons-material';

// MenuItem Component
const MenuItem = React.memo(({ item, categoryIndex, subCategoryIndex, itemIndex, handleEdit, handleDelete, handleAvailability, dispatch, category }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(item.name);
    const [editedPrice, setEditedPrice] = useState(item.price);
    const [editedAvailability, setEditedAvailability] = useState(item.isAvailable);

    const handleEditNameChange = (event) => setEditedName(event.target.value);
    const handleEditPriceChange = (event) => setEditedPrice(event.target.value);

    const handleSave = () => {
        handleEdit(categoryIndex, subCategoryIndex, itemIndex, editedName, editedPrice, editedAvailability);

        axios.patch(`http://localhost:4000/api/items/${item._id}`, {
            name: editedName,
            price: parseInt(editedPrice),
            isAvailable: editedAvailability,
            categoryId: category._id
        }).then(async () => {
            const result = await getMenu();
            dispatch(menuAction(result));
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setIsEditing(false);
        });
    };

    return (
        <div className="menu-item">
            <div className="item-details">
                {isEditing ? (
                    <>
                        <input type="text" value={editedName} onChange={handleEditNameChange} className="item-name" placeholder="Item Name" />
                        <input type="text" value={editedPrice} onChange={handleEditPriceChange} className="item-price" placeholder="Price" />
                    </>
                ) : (
                    <>
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">{item.price}</span>
                    </>
                )}
            </div>
            <div className="item-actions">
                {isEditing ? (
                    <button className="save-button" onClick={handleSave}>Save</button>
                ) : (
                    <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                )}
                <button className="delete-button" onClick={() => window.confirm('Are you sure?') && handleDelete(categoryIndex, subCategoryIndex, itemIndex, item)}>Delete</button>
                <div className="availability-switch">
                    <label className="switch">
                        <input type="checkbox" checked={item.isAvailable || false} onChange={(event) => {
                            handleAvailability(categoryIndex, subCategoryIndex, itemIndex, event.target.checked, item);
                            setEditedAvailability(event.target.checked);
                        }} />
                        <span className="slider round"></span>
                    </label>
                    <span className="availability-status">{item.isAvailable ? "Available 🟢" : "Unavailable 🔴"}</span>
                </div>
            </div>
        </div>
    );
});

// SpecialOfferItem Component
const SpecialOfferItem = React.memo(({ item }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPrice, setEditedPrice] = useState(item.SpecialOfferPrice || "");
    const [editedAvailability, setEditedAvailability] = useState(item.isActive || true);
    const dispatch = useDispatch();

    const handleEditPriceChange = (event) => setEditedPrice(event.target.value);

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/specailoffer/${item._id}`, {
                item: item.item._id,
                SpecialOfferPrice: parseInt(editedPrice),
                isActive: editedAvailability
            });
            if (response.status === 200) {
                const menu = await getMenu();
                dispatch(menuAction(menu));
            }
        } catch (error) {
            console.error('Error updating special offer:', error);
        } finally {
            setIsEditing(false);
        }
    };

    const deleteSpecialItem = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/specailoffer/${item._id}`);
            if (response.status === 200) {
                const menu = await getMenu();
                dispatch(menuAction(menu));
            }
        } catch (error) {
            console.error('Error deleting special offer:', error);
        }
    };

    const handleAvailabilityChange = async (event) => {
        const newAvailability = event.target.checked;
        setEditedAvailability(newAvailability);
        try {
            await axios.put(`http://localhost:4000/api/specailoffer/${item._id}`, {
                isActive: newAvailability
            });
            const menu = await getMenu();
            dispatch(menuAction(menu));
        } catch (error) {
            console.error('Error updating special offer availability:', error);
        }
    };

    const readOnlyInputProps = {
        readOnly: true,
        tabIndex: -1,
        style: { pointerEvents: 'none' },
    };

    return (
        <div className="menu-item" style={{ marginBottom: '16px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div className="item-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isEditing ? (
                    <>
                        <TextField
                            value={item?.item?.name}
                            variant="outlined"
                            InputProps={readOnlyInputProps}
                            label="Item Name"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            value={item?.item?.price}
                            variant="outlined"
                            InputProps={readOnlyInputProps}
                            label="Item Actual Price"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            value={editedPrice}
                            variant="outlined"
                            onChange={handleEditPriceChange}
                            label="Item Offer Price"
                            fullWidth
                            margin="normal"
                            type="number"
                            InputProps={{ min: 0 }}
                        />
                    </>
                ) : (
                    <>
                        <TextField
                            value={item?.item?.name}
                            variant="outlined"
                            InputProps={readOnlyInputProps}
                            label="Item Name"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            value={item?.item?.price}
                            variant="outlined"
                            InputProps={readOnlyInputProps}
                            label="Item Actual Price"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            value={item.SpecialOfferPrice}
                            variant="outlined"
                            InputProps={readOnlyInputProps}
                            label="Item Offer Price"
                            fullWidth
                            margin="normal"
                        />
                    </>
                )}
            </div>
            <div className="item-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {isEditing ? (
                    <button
                        className="save-button"
                        onClick={handleSave}
                        style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className="edit-button"
                        onClick={() => {
                            setEditedPrice(item.SpecialOfferPrice);
                            setIsEditing(true);
                        }}
                        style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Edit
                    </button>
                )}
                <button
                    className="delete-button"
                    onClick={() => window.confirm('Are you sure?') && deleteSpecialItem()}
                    style={{ padding: '8px 16px', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Delete
                </button>
                <div className="availability-switch">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={editedAvailability}
                            onChange={handleAvailabilityChange}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="availability-status">{editedAvailability ? "Active 🟢" : "Inactive 🔴"}</span>
                </div>
            </div>
        </div>
    );
});

// RecommendedItem Component
const RecommendedItem = React.memo(({ item, objId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPrice, setEditedPrice] = useState(item.price || "");
    const [editedAvailability, setEditedAvailability] = useState(item.isAvailable || false);
    const dispatch = useDispatch();

    const handleEditPriceChange = (event) => setEditedPrice(event.target.value);

    // const handleSave = async () => {
    //     try {
    //         const response = await axios.put(`http://localhost:4000/api/items/${item._id}`, {
    //             price: parseInt(editedPrice),
    //             isAvailable: editedAvailability
    //         });
    //         if (response.status === 200) {
    //             const menu = await getMenu();
    //             dispatch(menuAction(menu));
    //         }
    //     } catch (error) {
    //         console.error('Error updating recommended item:', error);
    //     } finally {
    //         setIsEditing(false);
    //     }
    // };

    const deleteRecommendedItem = async () => {

        try {
            const response = await axios.delete(`http://localhost:4000/api/recommended/${objId}/items/${item._id}`);
            if (response.status === 200) {
                const menu = await getMenu();
                dispatch(menuAction(menu));
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting recommended item:', error);
        }
    };

    // const handleAvailabilityChange = async (event) => {
    //     const newAvailability = event.target.checked;
    //     setEditedAvailability(newAvailability);
    //     try {
    //         await axios.put(`http://localhost:4000/api/items/items/${item._id}`, {
    //             isAvailable: newAvailability
    //         });
    //         const menu = await getMenu();
    //         dispatch(menuAction(menu));
    //     } catch (error) {
    //         console.error('Error updating availability:', error);
    //     }
    // };

    const readOnlyInputProps = {
        readOnly: true,
        tabIndex: -1,
        style: { pointerEvents: 'none' },
    };

    return (
        <div className="menu-item" style={{ marginBottom: '16px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div className="item-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isEditing ? (
                    <>
                        <TextField
                            value={item.name}
                            variant="outlined"
                            InputProps={readOnlyInputProps}
                            label="Item Name"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            value={editedPrice}
                            variant="outlined"
                            onChange={handleEditPriceChange}
                            label="Price"
                            fullWidth
                            margin="normal"
                            type="number"
                            InputProps={{ min: 0 }}
                        />
                    </>
                ) : (
                    <>
                        <TextField
                            value={item.name}
                            variant="outlined"
                            InputProps={readOnlyInputProps}
                            label="Item Name"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            value={item.price}
                            variant="outlined"
                            InputProps={readOnlyInputProps}
                            label="Price"
                            fullWidth
                            margin="normal"
                        />
                    </>
                )}
            </div>
            <div className="item-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {/* {isEditing ? (
                    <button
                        className="save-button"
                        onClick={handleSave}
                        style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className="edit-button"
                        onClick={() => {
                            setEditedPrice(item.price);
                            setIsEditing(true);
                        }}
                        style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Edit
                    </button>
                )} */}
                <button
                    className="delete-button"
                    onClick={() => window.confirm('Are you sure?') && deleteRecommendedItem()}
                    style={{ padding: '8px 16px', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Delete
                </button>
                {/* <div className="availability-switch">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={editedAvailability}
                            onChange={handleAvailabilityChange}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="availability-status">{editedAvailability ? "Active 🟢" : "Inactive 🔴"}</span>
                </div> */}
            </div>
        </div>
    );
});

// ComboItem Component
const ComboItem = React.memo(({ combo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPrice, setEditedPrice] = useState(combo.comboPrice || "");
    const [editedAvailability, setEditedAvailability] = useState(combo.isActive || true);
    const dispatch = useDispatch();

    const handleEditPriceChange = (event) => setEditedPrice(event.target.value);

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/combos/${combo._id}`, {
                comboPrice: parseInt(editedPrice),
                isActive: editedAvailability
            });
            if (response.status === 200) {
                const menu = await getMenu();
                dispatch(menuAction(menu));
            }
        } catch (error) {
            console.error('Error updating combo:', error);
        } finally {
            setIsEditing(false);
        }
    };

    const deleteComboItem = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/combos/${combo._id}`);
            if (response.status === 200) {
                const menu = await getMenu();
                dispatch(menuAction(menu));
            }
        } catch (error) {
            console.error('Error deleting combo:', error);
        }
    };

    const handleAvailabilityChange = async (event) => {
        const newAvailability = event.target.checked;
        setEditedAvailability(newAvailability);
        try {
            await axios.put(`http://localhost:4000/api/combos/${combo._id}`, {
                isActive: newAvailability
            });
            const menu = await getMenu();
            dispatch(menuAction(menu));
        } catch (error) {
            console.error('Error updating combo availability:', error);
        }
    };

    const readOnlyInputProps = {
        readOnly: true,
        tabIndex: -1,
        style: { pointerEvents: 'none' },
    };
    console.log(combo.items)

    return (
        <div className="menu-item" style={{ marginBottom: '16px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div className="item-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {combo.items.map((comboItem, index) => (
                    <TextField
                        key={comboItem?._id}
                        value={comboItem?.item?.name}
                        variant="outlined"
                        InputProps={readOnlyInputProps}
                        label={`Item ${index + 1} Name`}
                        fullWidth
                        margin="normal"
                    />
                ))}
                {isEditing ? (
                    <TextField
                        value={editedPrice}
                        variant="outlined"
                        onChange={handleEditPriceChange}
                        label="Combo Price"
                        fullWidth
                        margin="normal"
                        type="number"
                        InputProps={{ min: 0 }}
                    />
                ) : (
                    <TextField
                        // value={combo.comboPrice || combo.items.reduce((sum, i) => sum + i.item.price, 0)}
                        variant="outlined"
                        InputProps={readOnlyInputProps}
                        label="Combo Price"
                        fullWidth
                        margin="normal"
                    />
                )}
            </div>
            <div className="item-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {isEditing ? (
                    <button
                        className="save-button"
                        onClick={handleSave}
                        style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className="edit-button"
                        onClick={() => {
                            setEditedPrice(combo.comboPrice || combo.items.reduce((sum, i) => sum + i.item.price, 0));
                            setIsEditing(true);
                        }}
                        style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Edit
                    </button>
                )}
                <button
                    className="delete-button"
                    onClick={() => window.confirm('Are you sure?') && deleteComboItem()}
                    style={{ padding: '8px 16px', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Delete
                </button>
                <div className="availability-switch">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={editedAvailability}
                            onChange={handleAvailabilityChange}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="availability-status">{editedAvailability ? "Active 🟢" : "Inactive 🔴"}</span>
                </div>
            </div>
        </div>
    );
});

// AdminPage Component
function AdminPage() {
    const menu = useSelector((state) => state.menuData);
    const [openCategoryModel, setOpenCategoryModel] = useState(false);
    const [openSubCategoryModel, setOpenSubCategoryModel] = useState(false);
    const [openItemModel, setOpenItemModel] = useState(false);
    const [openComboModel, setOpenComboModel] = useState(false);
    const [loading, setLoading] = useState(true);
    const { setLoadingBackDrop } = useContext(LoadingContext);
    const [openRecommendedModel, setRecommendedModel] = useState(false);
    const [openSpecialOfferModel, setSpecialOfferModel] = useState(false);
    const [specialOffers, setSpecialOffers] = useState([]);
    const [combos, setCombos] = useState([]);
    const [recommendedItems, setRecommendedItems] = useState([]);
    const [recommandedItemsId, setRecommandedItemsId] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriesResponse, specialOffersResponse, combosResponse, recommendedResponse] = await Promise.allSettled([
                    axios.get("http://localhost:4000/api/categories"),
                    // axios.get("http://localhost:4000/api/specailoffer/get-item"),
                    axios.get("http://localhost:4000/api/combo"),
                    axios.get("http://localhost:4000/api/recommended")
                ]);
                // console.log(categoriesResponse.value.data, "categories Response")
                dispatch(menuAction(categoriesResponse.value?.data));
                // setSpecialOffers(specialOffersResponse.data?.specialOffmenu?.lengthers || []);
                console.log(combosResponse, "557")
                setCombos(combosResponse?.data || []);
                setRecommendedItems(recommendedResponse?.data?.data?.[0]?.items || []);
                setRecommandedItemsId(recommendedResponse?.data?.data?.[0]._id)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [dispatch]);

    const handleEdit = useCallback((categoryIndex, subCategoryIndex, itemIndex, newName, newPrice, newAvailability) => {
        const updatedMenu = [...menu];
        if (subCategoryIndex !== null && subCategoryIndex !== undefined) {
            updatedMenu[categoryIndex].subCategories[subCategoryIndex].items[itemIndex] = {
                ...updatedMenu[categoryIndex].subCategories[subCategoryIndex].items[itemIndex],
                name: newName,
                price: newPrice,
                isAvailable: newAvailability
            };
        } else {
            updatedMenu[categoryIndex].items[itemIndex] = {
                ...updatedMenu[categoryIndex].items[itemIndex],
                name: newName,
                price: newPrice,
                isAvailable: newAvailability
            };
        }
    }, [menu]);

    const handleDelete = useCallback(async (categoryIndex, subCategoryIndex, itemIndex, item) => {
        try {
            await axios.delete(`http://localhost:4000/api/items/${item._id}`);
            const menu = await getMenu();
            dispatch(menuAction(menu));
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    const handleAvailability = useCallback(async (categoryIndex, subCategoryIndex, itemIndex, isAvailable, item) => {
        try {
            await axios.patch(`http://localhost:4000/api/items/${item._id}`, {
                isAvailable: isAvailable
            });
            const menu = await getMenu();
            dispatch(menuAction(menu));
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    return (
        <div className="admin-page-container">
            <header>
                <h1>Menu Management 🍽️</h1>
                <p className="subtitle">Customize your menu with ease.</p>
            </header>
            <div className="button-container">
                <button className="btn" onClick={() => setOpenCategoryModel(true)}>🗂 Add Category</button>
                <button className="btn" onClick={() => setOpenSubCategoryModel(true)}>📂 Add Subcategory</button>
                <button className="btn" onClick={() => setOpenItemModel(true)}>🍽 Add Item</button>
                <button className="btn" onClick={() => setRecommendedModel(true)}>⭐ Add Recommended Items</button>
                <button className="btn" onClick={() => setSpecialOfferModel(true)}>⭐ Add Special Offer Items</button>
                <button className="btn" onClick={() => setOpenComboModel(true)}>🎁 Add Combo Items</button>
            </div>

            <main>
                <div className="menu-categories">
                    {loading ? (
                        <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <CircularProgress sx={{ color: 'var(--secondary-color)' }} />
                        </Box>
                    ) : (
                        <>
                            {recommendedItems.length > 0 && (
                                <section className="category-container">
                                    <h2 className="category-title">Recommended Items ⭐</h2>
                                    <div className="menu-items-container">
                                        {recommendedItems.map((item) => (
                                            <RecommendedItem key={item._id} item={item} objId={recommandedItemsId} />
                                        ))}
                                    </div>
                                </section>
                            )}
                            {combos.length > 0 && (
                                <section className="category-container">
                                    <h2 className="category-title">Combo Offers 🎁</h2>
                                    <div className="menu-items-container">
                                        {combos?.map((combo) => (
                                            <ComboItem key={combo._id} combo={combo} />
                                        ))}
                                    </div>
                                </section>
                            )}
                            {specialOffers.length > 0 && (
                                <section className="category-container">
                                    <h2 className="category-title">Special Offers ⭐</h2>
                                    <div className="menu-items-container">
                                        {specialOffers.map((item) => (
                                            <SpecialOfferItem key={item._id} item={item} />
                                        ))}
                                    </div>
                                </section>
                            )}
                            {menu?.length > 0 ? (
                                menu.map((category, categoryIndex) => (
                                    <section key={category._id} className="category-container">
                                        <h2 className="category-title">{category.name}</h2>
                                        {category.items && category.items.length > 0 && (
                                            <div className="menu-items-container">
                                                <h3 className="subcategory-title">Items</h3>
                                                {category.items.map((item, itemIndex) => (
                                                    <MenuItem
                                                        key={item._id}
                                                        item={item}
                                                        categoryIndex={categoryIndex}
                                                        subCategoryIndex={null}
                                                        itemIndex={itemIndex}
                                                        handleEdit={handleEdit}
                                                        handleDelete={handleDelete}
                                                        handleAvailability={handleAvailability}
                                                        dispatch={dispatch}
                                                        category={category}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {category.subCategories && category.subCategories.length > 0 && (
                                            <div className="subcategories-container">
                                                {category.subCategories.map((subCategory, subCategoryIndex) => (
                                                    <div key={subCategory._id} className="subcategory-container">
                                                        <h3 className="subcategory-title">{subCategory.name}</h3>
                                                        <div className="menu-items-container">
                                                            {subCategory.items.map((item, itemIndex) => (
                                                                <MenuItem
                                                                    key={item._id}
                                                                    item={item}
                                                                    categoryIndex={categoryIndex}
                                                                    subCategoryIndex={subCategoryIndex}
                                                                    itemIndex={itemIndex}
                                                                    handleEdit={handleEdit}
                                                                    handleDelete={handleDelete}
                                                                    handleAvailability={handleAvailability}
                                                                    dispatch={dispatch}
                                                                    category={category}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                ))
                            ) : (
                                <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <Typography variant="h4" sx={{
                                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                                        fontWeight: 500,
                                        color: 'var(--text-color)',
                                        textAlign: 'center',
                                        padding: '0 1rem'
                                    }}>
                                            
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </div>
            </main>
            <AddCategoryModel {...{ openCategoryModel, setOpenCategoryModel }} />
            <AddSubCategoryModel {...{ openSubCategoryModel, setOpenSubCategoryModel }} />
            <AddItemModel {...{ setOpenItemModel, openItemModel }} />
            <AddRecommendedModel openRecommendedModel={openRecommendedModel} setRecommendedModel={setRecommendedModel} />
            <AddSpecialOfferModel openSpecialOfferModel={openSpecialOfferModel} setSpecialOfferModel={setSpecialOfferModel} />
            <AddComboModel openComboModel={openComboModel} setOpenComboModel={setOpenComboModel} />
        </div>
    );
}

export default AdminPage;