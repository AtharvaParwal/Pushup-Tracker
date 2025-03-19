import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Logout.css";

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = process.env.REACT_APP_BACKEND_URL;  
      await axios.post(`${BASE_URL}/api/auth/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="logout-wrapper"> {/* Outer wrapper to center the content */}
      <div className="logout-container"> {/* White container */}
        <h2>Are you sure you want to logout?</h2>
        <div className="buttons">
          <button onClick={handleLogout}>Yes</button>
          <button onClick={() => navigate("/dashboard")}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
