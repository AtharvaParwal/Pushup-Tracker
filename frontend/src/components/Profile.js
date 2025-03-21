import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const BASE_URL = process.env.REACT_APP_BACKEND_URL;  
        const res = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.message) {
          setUser(res.data.message);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (error) {
        setError("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-details">
        <h2 className="profile-title">Profile</h2> 
        {user.avatar && <img src={user.avatar} alt="Avatar" className="avatar" />}
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Total Pushups:</strong> {user.pushupCount}</p>
        <p><strong>Personal Best:</strong> {user.personalBest}</p>
        <p><strong>Level:</strong> {user.level}</p>
      </div>
    </div>
  );
};

export default Profile;
