const menuData = [
    {
        category: "Starters",
        subCategory: [
            {
                name: "Veg",  // Subcategory name
                items: [
                    { name: "Paneer Tikka", price: 200, available: true }, // Added available property
                    { name: "Gobi Manchurian", price: 150, available: true },
                    { name: "Veg Spring Roll", price: 100, available: true }
                ]
            },
            {
                name: "Non-Veg", // Subcategory name
                items: [
                    { name: "Chicken Tikka", price: 250, available: true },
                    { name: "Chicken Lollipop", price: 300, available: true },
                    { name: "Chicken Spring Roll", price: 200, available: true }
                ]
            }
        ]
    },
    {
        category: "Main Course",
        subCategory: [
            {
                name: "Curries",
                items: [
                    { name: "Paneer Butter Masala", price: 200, available: true },
                    { name: "Chicken Curry", price: 250, available: true },
                    { name: "Mutton Curry", price: 300, available: true }
                ]
            },
            {
                name: "Rotis",
                items: [
                    { name: "Butter Naan", price: 50, available: true },
                    { name: "Tandoori Roti", price: 40, available: true },
                    { name: "Laccha Paratha", price: 60, available: true }
                ]
            },
            {
                name: "Biryani",
                items: [
                    { name: "Veg Biryani", price: 150, available: true },
                    { name: "Chicken Biryani", price: 200, available: true },
                    { name: "Mutton Biryani", price: 250, available: true }
                ]
            }
        ]
    },
    {
        category: "Desserts",
        subCategory: [
            {
                name: "Ice Creams",
                items: [
                    { name: "Vanilla Ice Cream", price: 50, available: true },
                    { name: "Chocolate Ice Cream", price: 60, available: true }
                ]
            },
            {
                name: "Cakes",
                items: [
                    { name: "Black Forest Cake", price: 50, available: true },
                    { name: "Truffle Cake", price: 60, available: true }
                ]
            }
        ]
    }
];

export default menuData;