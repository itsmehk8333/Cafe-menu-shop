import React from "react";
import "./Homepage.css"; // Import the external CSS file
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate(); // Fixed typo: `naviagate` → `navigate`

  return (
    <div className="container">
      <header className="header">
        <h1>Family Restaurant</h1>
        <p className="tagline">Delicious Meals, Warm Memories</p>
      </header>
      <button 
        className="menu-button"
        onClick={() => navigate("/menu")}
      >
        Explore Menu
      </button>
      <div className="restaurant-image">
         <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Restaurant dining area" />
      </div>
    </div>
  );
};

export default Homepage;