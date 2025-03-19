import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper"> {/* Outer wrapper for full-screen background */}
      <div className="dashboard-container"> {/* White container */}
        <h1>Dashboard</h1>
        <div className="buttons">
          <button onClick={() => navigate("/track")}>Track My Pushups</button>
          <button onClick={() => navigate("/profile")}>My Profile</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button> {/* NEW BUTTON */}
          <button onClick={() => navigate("/logout")}>Logout</button>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
