import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure token is included for authentication if required
        const BASE_URL = process.env.REACT_APP_BACKEND_URL;  // Load from .env
        const response = await axios.get(`${BASE_URL}/api/user/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` }, // Send token if needed
        });

        console.log("Leaderboard Data:", response.data); // Debugging

        if (response.data.success) {
          setUsers(response.data.data); // Ensure we access the correct key from response
        } else {
          setError("Failed to fetch leaderboard data");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Error fetching leaderboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : users.length === 0 ? (
        <p>No users available</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Profile Pic</th>
              <th>Username</th>
              <th>Total Pushups</th>
              <th>Personal Best</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  <img src={user.avatar} alt="avatar" className="avatar" />
                </td>
                <td>{user.username}</td>
                <td>{user.total_pushups}</td>
                <td>{user.personal_best}</td>
                <td>{user.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;

