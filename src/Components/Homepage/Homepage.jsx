import React from "react";
import "./Homepage.css"; // Import the external CSS file
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <header className="header">
        <h1>Coffee Haven</h1>
        <p className="tagline">Sip, Savor, Smile</p>
      </header>
      <button 
        className="menu-button"
        onClick={() => navigate("/menu")}
      >
        Discover Our Menu
      </button>
      <div className="cafe-image">
        <img 
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Cozy coffee café interior" 
        />
      </div>
    </div>
  );
};

export default Homepage;