import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";


const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const BASE_URL = process.env.REACT_APP_BACKEND_URL; 
      const res = await axios.put(`${BASE_URL}/api/user/change-password`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensures cookies (if used) are sent
      });

      setSuccess(res.data.message);
      setFormData({ oldPassword: "", newPassword: "" });

      // Redirect user after successful password change (optional)
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Change Password</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Old Password</label>
            <input
              type="password"
              placeholder="Enter old password"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="auth-button">Change Password</button>
        </form>
        <p>
          <a href="/dashboard">Back to Dashboard</a>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
