import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Collapse,
  CircularProgress,
  Chip,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore, Coffee, Star, LocalCafe, LocalOffer, CardGiftcard } from "@mui/icons-material"; // Updated icons
import axios from "axios";
import { LoadingContext } from "../Loading/useLoading";
import "./Menu.css";

const styles = {
  container: {
    backgroundColor: "#f5e8da", // Light coffee cream
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
    fontFamily: "Merriweather, serif",
    position: "relative",
  },
  categoryTitle: {
    fontWeight: "bold",
    color: "#3c2f2f", // Dark coffee brown
    marginBottom: "20px",
    borderBottom: "2px solid #a67c00", // Warm gold
    paddingBottom: "10px",
    fontSize: "24px",
    fontFamily: "Lora, serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryTitleText: {
    fontFamily: "Lora, serif",
    fontWeight: "bold",
    color: "#3c2f2f", // Dark coffee brown
    fontSize: "24px",
  },
  menuButton: {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    backgroundColor: "#3c2f2f", // Dark coffee brown
    color: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "Lora, serif",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#a67c00", // Warm gold
    },
  },
  popupBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    zIndex: 10,
  },
  popup: {
    position: "fixed",
    bottom: "15%",
    left: "10%",
    right: "10%",
    backgroundColor: "rgba(245, 232, 218, 0.95)", // Light coffee cream
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
    overflowY: "auto",
    zIndex: 11,
    maxWidth: "400px",
    maxHeight: "60vh",
    fontFamily: "Merriweather, serif",
    transform: "rotate(-5deg)",
    transformOrigin: "bottom right",
  },
  popupHeader: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
    fontFamily: "Lora, serif",
    color: "#3c2f2f", // Dark coffee brown
  },
  closeButton: {
    marginTop: "20px",
    fontSize: "16px",
    backgroundColor: "#ff6f61", // Coral (mojito-inspired)
    color: "white",
    width: "100%",
    padding: "8px 0",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontFamily: "Lora, serif",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#e65b50", // Darker coral
    },
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 12px",
    borderBottom: "1px solid #e0d0bd", // Soft beige
    color: "#333",
    transition: "background-color 0.2s",
    position: "relative",
    "&:hover": {
      backgroundColor: "#fef9f1", // Light cream hover
    },
  },
  itemName: {
    fontFamily: "Merriweather, serif",
    fontSize: "16px",
  },
  itemPrice: {
    fontFamily: "Lora, serif",
    fontSize: "14px",
    fontWeight: "bold",
    paddingLeft: "10px",
    color: "#3c2f2f", // Dark coffee brown
  },
  bestSeller: {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "#a67c00", // Warm gold
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: "bold",
    borderRadius: "4px",
    padding: "2px 6px",
    zIndex: 1,
  },
  listItem: {
    padding: "6px 8px",
    "&:hover": {
      backgroundColor: "#fef9f1", // Light cream hover
    },
  },
  listItemText: {
    fontFamily: "Merriweather, serif",
  },
  categoryChip: {
    backgroundColor: "#a67c00", // Warm gold
    color: "#fff",
    marginRight: "8px",
    marginBottom: "8px",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "0.85rem",
    fontFamily: "Lora, serif",
  },
  subcategoryTitle: {
    fontFamily: "Lora, serif",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#3c2f2f", // Dark coffee brown
    marginTop: "16px",
    marginBottom: "12px",
    borderBottom: "1px solid #a67c00", // Warm gold
    paddingBottom: "8px",
  },
  filterContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "6px",
    marginTop: "clamp(16px, 4vw, 32px)",
    marginBottom: "clamp(16px, 4vw, 32px)",
    width: "100%",
    padding: "clamp(8px, 2vw, 16px) clamp(8px, 2vw, 24px)",
    flexWrap: "wrap",
    backgroundColor: "#f5e8da", // Light coffee cream
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  },
  filterButton: {
    width: "auto",
    minWidth: "80px",
    padding: "clamp(4px, 1.5vw, 8px) clamp(8px, 2vw, 12px)",
    borderRadius: "6px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontFamily: "Lora, serif",
    fontSize: "clamp(10px, 3vw, 12px)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#a67c00", // Warm gold
      color: "#fff",
    },
    "&.active": {
      backgroundColor: "#3c2f2f", // Dark coffee brown
      color: "#fff",
      borderColor: "#3c2f2f",
    },
  },
  recommendedContainer: {
    backgroundColor: "#fff5e6", // Light peach (coffee-inspired)
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0px 4px 12px rgba(166, 124, 0, 0.15)", // Gold-tinted shadow
    marginBottom: "24px",
    border: "1px solid #a67c00", // Warm gold
    animation: "fadeIn 0.5s ease-in-out",
  },
  recommendedTitle: {
    fontFamily: "Lora, serif",
    fontSize: "clamp(16px, 4vw, 22px)",
    fontWeight: "600",
    color: "#3c2f2f", // Dark coffee brown
    marginBottom: "12px",
    lineHeight: "1.4",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  recommendedItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #e0d0bd", // Soft beige
    backgroundColor: "#fff",
    borderRadius: "6px",
    marginBottom: "6px",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      backgroundColor: "#fef9f1", // Light cream hover
      boxShadow: "0px 4px 12px rgba(166, 124, 0, 0.2)", // Gold-tinted shadow
    },
  },
  recommendedItemName: {
    fontFamily: "Merriweather, serif",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    color: "#333",
    fontWeight: "400",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  recommendedItemPrice: {
    fontFamily: "Lora, serif",
    fontSize: "clamp(12px, 3vw, 14px)",
    fontWeight: "600",
    color: "#3c2f2f", // Dark coffee brown
    paddingLeft: "10px",
    lineHeight: "1.4",
  },
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "translateY(10px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  "@media (min-width: 600px)": {
    recommendedTitle: { fontSize: "22px", marginBottom: "16px" },
    recommendedItemName: { fontSize: "16px" },
    recommendedItemPrice: { fontSize: "14px" },
  },
  specialOfferContainer: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
    marginBottom: "24px",
    border: "1px solid #ff6f61", // Coral (mojito-inspired)
    animation: "fadeIn 0.5s ease-in-out",
    position: "relative",
  },
  specialOfferTitle: {
    fontFamily: "Lora, serif",
    fontSize: "clamp(16px, 4vw, 22px)",
    fontWeight: "600",
    color: "#3c2f2f", // Dark coffee brown
    marginBottom: "12px",
    lineHeight: "1.4",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    animation: "slideHorizontal 3s ease-in-out infinite",
  },
  specialOfferItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#fff",
    borderRadius: "6px",
    marginBottom: "6px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#fef9f1", // Light cream hover
    },
  },
  specialOfferItemName: {
    fontFamily: "Merriweather, serif",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    color: "#333",
    fontWeight: "400",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  specialOfferPriceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    paddingLeft: "8px",
  },
  originalPrice: {
    fontFamily: "Lora, serif",
    fontSize: "clamp(10px, 2.5vw, 12px)",
    color: "#888",
    textDecoration: "line-through",
    lineHeight: "1.4",
  },
  specialOfferPrice: {
    fontFamily: "Lora, serif",
    fontSize: "clamp(10px, 2.5vw, 12px)",
    fontWeight: "600",
    color: "#ff6f61", // Coral (mojito-inspired)
    lineHeight: "1.4",
  },
  "@keyframes slideHorizontal": {
    "0%": { transform: "translateX(0)" },
    "50%": { transform: "translateX(10px)" },
    "100%": { transform: "translateX(0)" },
  },
  "@media (min-width: 600px)": {
    specialOfferTitle: { fontSize: "22px", marginBottom: "16px" },
    specialOfferItemName: { fontSize: "16px" },
    originalPrice: { fontSize: "12px" },
    specialOfferPrice: { fontSize: "12px" },
  },
  comboContainer: {
    backgroundColor: "#e6f0ff", // Light blue (milkshake-inspired)
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "32px",
    border: "2px solid #6b9cff", // Blue accent
  },
  comboTitle: {
    fontFamily: "Lora, serif",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#3c2f2f", // Dark coffee brown
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  comboItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #e0d0bd", // Soft beige
    backgroundColor: "#fff",
    borderRadius: "8px",
    marginBottom: "8px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    },
  },
  comboItemName: {
    fontFamily: "Merriweather, serif",
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  comboPrice: {
    fontFamily: "Lora, serif",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#6b9cff", // Blue accent
  },
  comboItemsList: {
    fontFamily: "Merriweather, serif",
    fontSize: "14px",
    color: "#666",
    marginLeft: "24px",
  },
};

const MenuPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});
  const [priceFilter, setPriceFilter] = useState("default");
  const [recommendedList, setRecommendedList] = useState([]);
  const [specialOfferList, setSpecialOfferList] = useState([]);
  const [comboList, setComboList] = useState([]);
  const [filters, setFilters] = useState({
    veg: false,
    nonVeg: false,
    veegan: false,
    rated4Plus: false,
    spicy: false,
  });
  const specialOfferRef = useRef(null);
  const recommendedRef = useRef(null);
  const comboRef = useRef(null);
  const categoryRefs = useRef({});
  const { loadingBackdrop, setLoadingBackDrop } = React.useContext(LoadingContext);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const response = await axios.get("https://cafe-show-backend.onrender.com/api/recommended");
        const filteredRecommended = applyFilters(response?.data?.data[0]?.items || []);
        setRecommendedList(filteredRecommended);
      } catch (error) {
        console.log("Error fetching recommended items:", error.message);
      }
    }
    fetchRecommended();
  }, [filters]);

  useEffect(() => {
    async function fetchSpecialOffers() {
      try {
        const response = await axios.get("https://cafe-show-backend.onrender.com/api/specailoffer/get-item");
        setSpecialOfferList(response?.data.specialOffers);
      } catch (error) {
        console.log("Error fetching special offers:", error.message);
      }
    }
    fetchSpecialOffers();
  }, [filters]);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const response = await axios.get("https://cafe-show-backend.onrender.com/api/combo");
        setComboList(response.data);
      } catch (error) {
        console.log("Error fetching combos:", error.message);
      }
    }
    fetchCombos();
  }, [filters]);

  useEffect(() => {
    async function fetchMenuData() {
      setLoadingBackDrop(true);
      try {
        let grub = "";
        if (filters.veg) grub = "Veg";
        else if (filters.nonVeg) grub = "Non Veg";
        else if (filters.veegan) grub = "Veegan";
        else grub = "";

        const response = await axios.get("https://cafe-show-backend.onrender.com/api/categories/get-by-grub", {
          params: { grub },
        });
        setMenuData(response.data);
        categoryRefs.current = response.data.reduce((acc, category) => {
          acc[category._id] = { items: React.createRef() };
          category.subCategories.forEach((sub) => {
            acc[category._id][sub._id] = React.createRef();
          });
          return acc;
        }, {});
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoadingBackDrop(false);
      }
    }
    fetchMenuData();
  }, [filters]);

  const applyFilters = (items) => {
    return items.filter((item) => {
      const matchesGrub =
        (!filters.veg && !filters.nonVeg && !filters.veegan) ||
        (filters.veg && item.Grub === "Veg") ||
        (filters.nonVeg && item.Grub === "Non Veg") ||
        (filters.veegan && item.Grub === "Veegan");
      const matchesRating = !filters.rated4Plus || (item.rating && item.rating >= 4);
      const matchesSpicy = !filters.spicy || item.isSpicy === true;
      return matchesGrub && matchesRating && matchesSpicy;
    });
  };

  const toggleSubcategories = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleNavigationClick = (type, categoryId, subcategoryId = null) => {
    setOpen(false);
    if (type === "recommended") {
      recommendedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (type === "specialOffer") {
      specialOfferRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (type === "combo") {
      comboRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const refs = categoryRefs.current[categoryId];
      if (subcategoryId && refs[subcategoryId]) {
        refs[subcategoryId].current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (refs.items) {
        refs.items.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const increaseQuantity = (itemId) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const decreaseQuantity = (itemId) => {
    setItemQuantities((prev) => {
      const currentQuantity = prev[itemId] || 0;
      if (currentQuantity > 0) {
        return { ...prev, [itemId]: currentQuantity - 1 };
      }
      return prev;
    });
  };

  async function GetItemsSortedOrder(sortOrder) {
    console.log(602);
    const data = await axios.get(`https://cafe-show-backend.onrender.com/api/categories/sorted?sort=${sortOrder}`);
    console.log(data.data);
    if (data.data) {
      setMenuData(data.data);
    }
  }

  useEffect(() => {
    if (priceFilter === "lowToHigh") {
      GetItemsSortedOrder("lowToHigh");
    } else if (priceFilter === "highToLow") {
      GetItemsSortedOrder("highToLow");
    }
  }, [priceFilter]);

  const handleFilterChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
      ...(filterName === "veg" && { nonVeg: false, veegan: false }),
      ...(filterName === "nonVeg" && { veg: false, veegan: false }),
      ...(filterName === "veegan" && { veg: false, nonVeg: false }),
    }));
  };

  return (
    <Container maxWidth="md" style={{ ...styles.container, paddingBottom: "100px" }}>

      <Typography variant="h4" sx={{ textAlign: "center", fontFamily: "Lora, serif", color: "#3c2f2f" }}>
        ☕ Coffee Shop Menu
      </Typography>

      <Box style={styles.filterContainer}>
        <IconButton style={{ ...styles.filterButton, display: "none" }}>
          Filters ▼
        </IconButton>
        <IconButton
          style={{
            ...styles.filterButton,
            backgroundColor: filters.veg ? "#4caf50" : "#e0e0e0",
            color: filters.veg ? "#fff" : "#333",
          }}
          onClick={() => toggleFilter("veg")}
        >
          <span role="img" aria-label="Veg">🌱</span> Veg
        </IconButton>
        <IconButton
          style={{
            ...styles.filterButton,
            backgroundColor: filters.nonVeg ? "#8b4513" : "#e0e0e0",
            color: filters.nonVeg ? "#fff" : "#333",
          }}
          onClick={() => toggleFilter("nonVeg")}
        >
          <span role="img" aria-label="Non-Veg">🍗</span> Non-Veg
        </IconButton>
        <FormControl sx={{ width: "100%", maxWidth: "120px" }}>
          <InputLabel id="price-filter-label">Sort</InputLabel>
          <Select
            labelId="price-filter-label"
            value={priceFilter}
            label="Sort by Price"
            onChange={handleFilterChange}
            sx={{
              fontFamily: "Lora, serif",
              fontSize: "clamp(10px, 3vw, 12px)",
              "& .MuiSelect-select": { padding: "4px 8px" },
            }}
            size="small"
            fullWidth
          >
            <MenuItem value="default" sx={{ fontFamily: "Merriweather, serif", fontSize: "clamp(10px, 3vw, 12px)" }}>
              Default
            </MenuItem>
            <MenuItem value="lowToHigh" sx={{ fontFamily: "Merriweather, serif", fontSize: "clamp(10px, 3vw, 12px)" }}>
              Low to High
            </MenuItem>
            <MenuItem value="highToLow" sx={{ fontFamily: "Merriweather, serif", fontSize: "clamp(10px, 3vw, 12px)" }}>
              High to Low
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {priceFilter === "default" && recommendedList.length > 0 && (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={500}>
          <Box ref={recommendedRef} style={styles.recommendedContainer}>
            <Typography variant="h5" style={styles.recommendedTitle}>
              <Coffee sx={{ color: "#a67c00", fontSize: "24px" }} /> {/* Warm gold */}
              Barista’s Picks
              <Star sx={{ color: "#a67c00", fontSize: "24px" }} />
            </Typography>
            {recommendedList.map((item) => (
              <Box key={item._id} style={styles.recommendedItem}>
                <Typography variant="body2" style={styles.recommendedItemName}>
                  <Star sx={{ color: "#a67c00", fontSize: "16px" }} />
                  {item.name}
                </Typography>
                <Typography variant="body2" style={styles.recommendedItemPrice}>
                  ₹{item.price}
                </Typography>
                {item.isBestSeller && <Chip label="Top Brew" style={styles.bestSeller} />}
              </Box>
            ))}
          </Box>
        </Slide>
      )}

      {priceFilter === "default" && specialOfferList?.length > 0 && (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={500}>
          <Box ref={specialOfferRef} style={styles.specialOfferContainer}>
            <Typography variant="h5" style={styles.specialOfferTitle}>
              <LocalOffer sx={{ color: "#ff6f61", fontSize: "24px" }} />
              Daily Brew & Bites Deals
            </Typography>
            {specialOfferList.map((offer) =>
              offer ? (
                <Box key={offer._id} style={styles.specialOfferItem}>
                  <Typography variant="body2" style={styles.specialOfferItemName}>
                    <LocalOffer sx={{ color: "#ff6f61", fontSize: "16px" }} />
                    {offer?.item?.name}
                  </Typography>
                  <Box style={styles.specialOfferPriceContainer}>
                    <Typography variant="body2" style={styles.originalPrice}>
                      ₹{offer?.item?.price}
                    </Typography>
                    <Typography variant="body2" style={styles.specialOfferPrice}>
                      ₹{offer?.SpecialOfferPrice}
                    </Typography>
                  </Box>
                  {offer?.item?.isBestSeller && <Chip label="Top Brew" style={styles.bestSeller} />}
                </Box>
              ) : (
                <></>
              )
            )}
          </Box>
        </Slide>
      )}

      {comboList.length > 0 && (
        <Box ref={comboRef} style={styles.comboContainer}>
          <Typography variant="h5" style={styles.comboTitle}>
            <CardGiftcard sx={{ color: "#6b9cff", fontSize: "28px" }} />
            Shake & Sip Combos
            <CardGiftcard sx={{ color: "#6b9cff", fontSize: "28px" }} />
          </Typography>
          {comboList.map((combo, i) => (
            <Box key={combo._id} style={styles.comboItem}>
              <Box>
                <Typography variant="body2" style={styles.comboItemName}>
                  <CardGiftcard sx={{ color: "#6b9cff", fontSize: "18px" }} />
                  Combo #{i + 1}
                </Typography>
                <ul style={styles.comboItemsList}>
                  {combo.items.map((item) => (
                    <li key={item._id}>{item?.item?.name || "Unnamed Item"}</li>
                  ))}
                </ul>
              </Box>
              <Typography variant="body2" style={styles.comboPrice}>
                ₹{combo?.comboPrice || combo?.items.reduce((sum, i) => sum + i?.item?.price, 0) || "Unknown Price"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

{menuData?.length > 0 ? (
  menuData
    ?.map((category) => {
      // Check if there are any available items in the category or its subcategories
      const hasCategoryItems = category.items.some((item) => item.isAvailable);
      const hasSubCategoryItems = category.subCategories.some((sub) =>
        sub.items.some((item) => item.isAvailable)
      );
      const shouldShowCategory = hasCategoryItems || hasSubCategoryItems;

      // Only render the category if it has visible items
      return shouldShowCategory ? (
        <Box key={category._id} marginBottom="32px">
          <Typography variant="h5" style={styles.categoryTitle}>
            <span style={styles.categoryTitleText}>{category.name}</span>
            {category.isPopular && <Chip label="Popular" style={styles.categoryChip} />}
          </Typography>
          <Grid container spacing={3}>
            {hasCategoryItems && (
              <Grid item xs={12} sm={6} md={4} ref={categoryRefs.current[category._id].items}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" style={styles.subcategoryTitle}>
                      {category.name} {/* Assuming "Classic Drinks" or similar */}
                    </Typography>
                    {category.items.map((item) => (
                      <Box
                        key={item._id}
                        style={{ ...styles.item, display: item.isAvailable ? "flex" : "none" }}
                      >
                        <Typography variant="body2" style={styles.itemName}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" style={styles.itemPrice}>
                          ₹{item.price}
                        </Typography>
                        {item.isBestSeller && <Chip label="Top Brew" style={styles.bestSeller} />}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}
            {category.subCategories.map((sub) => {
              // Check if the subcategory has any available items
              const hasItems = sub.items.some((item) => item.isAvailable);
              return hasItems ? (
                <Grid item xs={12} sm={6} md={4} key={sub._id} ref={categoryRefs.current[category._id][sub._id]}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" style={styles.subcategoryTitle}>
                        {sub.name}
                      </Typography>
                      {sub.items.map((item) => (
                        <Box
                          key={item._id}
                          style={{ ...styles.item, display: item.isAvailable ? "flex" : "none" }}
                        >
                          <Typography variant="body2" style={styles.itemName}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" style={styles.itemPrice}>
                            ₹{item.price}
                          </Typography>
                          {item.isBestSeller && <Chip label="Top Brew" style={styles.bestSeller} />}
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ) : null;
            })}
          </Grid>
        </Box>
      ) : null;
    })
    .filter(Boolean) // Remove any null entries from the map
) : (
  <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {loadingBackdrop === false ? <Typography>Items Are Not Found!!!</Typography> : <></>}
  </Box>
)}

      <Button style={styles.menuButton} onClick={() => setOpen(true)}>
        Coffee Shop Menu
      </Button>

      {open && (
        <>
          <Box style={styles.popupBackdrop} onClick={() => setOpen(false)} />
          <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Box style={styles.popup}>
              <Typography variant="h6" style={styles.popupHeader}>
                Coffee Shop Highlights
              </Typography>
              <List>
                {recommendedList.length > 0 && (
                  <ListItem
                    button
                    onClick={() => handleNavigationClick("recommended")}
                    style={styles.listItem}
                  >
                    <Coffee style={{ marginRight: "10px", color: "#a67c00" }} />
                    <ListItemText
                      primary="Barista’s Picks"
                      primaryTypographyProps={{ style: styles.listItemText }}
                    />
                  </ListItem>
                )}
                {specialOfferList?.length > 0 && (
                  <ListItem
                    button
                    onClick={() => handleNavigationClick("specialOffer")}
                    style={styles.listItem}
                  >
                    <LocalOffer style={{ marginRight: "10px", color: "#ff6f61" }} />
                    <ListItemText
                      primary="Daily Brew & Bites Deals"
                      primaryTypographyProps={{ style: styles.listItemText }}
                    />
                  </ListItem>
                )}
                {comboList.length > 0 && (
                  <ListItem
                    button
                    onClick={() => handleNavigationClick("combo")}
                    style={styles.listItem}
                  >
                    <CardGiftcard style={{ marginRight: "10px", color: "#6b9cff" }} />
                    <ListItemText
                      primary="Shake & Sip Combos"
                      primaryTypographyProps={{ style: styles.listItemText }}
                    />
                  </ListItem>
                )}
                {menuData?.map((category) => (
                  <React.Fragment key={category._id}>
                    <ListItem
                      button
                      onClick={() => toggleSubcategories(category._id)}
                      style={styles.listItem}
                    >
                      <LocalCafe style={{ marginRight: "10px", color: "#3c2f2f" }} />
                      <ListItemText
                        primary={category.name}
                        primaryTypographyProps={{ style: styles.listItemText }}
                      />
                      {expandedCategory === category._id ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={expandedCategory === category._id} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {category.items.length > 0 && (
                          <ListItem
                            button
                            sx={{ pl: 4 }}
                            onClick={() => handleNavigationClick("category", category._id)}
                            style={styles.listItem}
                          >
                            <ListItemText
                              primary="Classic Drinks"
                              primaryTypographyProps={{ style: styles.listItemText }}
                            />
                          </ListItem>
                        )}
                        {category.subCategories.map((sub) => (
                          <ListItem
                            button
                            key={sub._id}
                            sx={{ pl: 4 }}
                            onClick={() => handleNavigationClick("category", category._id, sub._id)}
                            style={styles.listItem}
                          >
                            <ListItemText
                              primary={sub.name}
                              primaryTypographyProps={{ style: styles.listItemText }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
              <Button style={styles.closeButton} onClick={() => setOpen(false)}>
                Close
              </Button>
            </Box>
          </Slide>
        </>
      )}
    </Container>
  );
};

export default MenuPage;