import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "../styles/PushupCounter.css";


const PYTHON_SERVER_URL = process.env.REACT_APP_PYTHON_SERVER_URL;

const socket = io(PYTHON_SERVER_URL, {
  transports: ["websocket"], // Force WebSocket transport
});


const BASE_URL = process.env.REACT_APP_BACKEND_URL;  

const calculateLevel = (totalPushups) => {
  const levels = [
    [115000, 50], [113000, 49], [112000, 48], [111000, 47], [105000, 46],
    [100000, 45], [95000, 44], [90000, 43], [85000, 42], [80000, 41],
    [75000, 40], [70000, 39], [65000, 38], [60000, 37], [55000, 36],
    [50000, 35], [46000, 34], [42000, 33], [38000, 32], [34000, 31],
    [30000, 30], [26000, 29], [23000, 28], [20000, 27], [18000, 26],
    [16000, 25], [14000, 24], [12000, 23], [10000, 22], [8000, 21],
    [7000, 20], [6000, 19], [5000, 18], [4000, 17], [3000, 16],
    [2500, 15], [2000, 14], [1500, 13], [1000, 12], [500, 11],
    [400, 10], [300, 9], [200, 8], [150, 7], [100, 6],
    [50, 5], [30, 4], [10, 3], [5, 2], [1, 1]
  ];
  for (const [threshold, level] of levels) {
    if (totalPushups >= threshold) return level;
  }
  return 0;
};

const PushupCounter = () => {
  const [videoFrame, setVideoFrame] = useState(null);
  const [currentPushups, setCurrentPushups] = useState(0);
  const [totalPushups, setTotalPushups] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [level, setLevel] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState("");
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
  const [isNewLevel, setIsNewLevel] = useState(false);
  const navigate = useNavigate();

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.message) {
        const { pushupCount, personalBest, level } = res.data.message;
        setTotalPushups(pushupCount);
        console.log("hello")
        setPersonalBest(personalBest);
        setLevel(level);
      } else {
        setError("Failed to fetch user stats");
      }
    } catch (error) {
      setError("Failed to fetch user stats");
      console.error("Failed to fetch user stats:", error);
    }
  };
  useEffect(()=>{
    fetchUserStats();
    return;
  },[])

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to Python server (Socket.IO)"));
    socket.on("disconnect", () => console.log("Disconnected from Python server (Socket.IO)"));
    socket.on("connect_error", (err) => console.error("Socket.IO connection error:", err));

    const handleVideoFrame = (data) => {
      if (data && data.frame) {
        setVideoFrame(`data:image/jpeg;base64,${data.frame}`);
      }
    };

    const handlePushupCount = (data) => {
      if (data && data.count !== undefined) {
        setCurrentPushups(data.count);

        if (data.count > personalBest) {
          setPersonalBest(data.count);
          setIsNewPersonalBest(true);
        }

        const newTotalPushups = totalPushups + data.count;
        const newLevel = calculateLevel(newTotalPushups);
        if (newLevel !== level) {
          setLevel(newLevel);
          setIsNewLevel(true);
        }
      }
    };

    socket.on("video_frame", handleVideoFrame);
    socket.on("pushup_count", handlePushupCount);

    return () => {
      socket.off("video_frame", handleVideoFrame);
      socket.off("pushup_count", handlePushupCount);
    };
  }, [totalPushups, personalBest, level]);

  const startTracking = async () => {
    try {
      await fetchUserStats();
      setTracking(true);
      setCurrentPushups(0);
      setIsNewPersonalBest(false);
      setIsNewLevel(false);
      socket.emit("start_camera");
    } catch (error) {
      console.error("Error fetching updated pushup stats:", error);
      setError("Failed to start tracking. Please try again.");
    }
  };

  const stopTracking = async () => {
    try {
      const token = localStorage.getItem("token");

      const pushupCount = Number(currentPushups);
      if (isNaN(pushupCount) || pushupCount < 0) {
        throw new Error("Invalid push-up count.");
      }

      const res = await axios.post(
        `${BASE_URL}/api/user/track-pushups`,
        { pushupCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        socket.emit("stop_camera");
        setTracking(false);
        setTotalPushups((prev) => prev + pushupCount);
        navigate("/dashboard");
      } else {
        setError("Failed to save push-ups.");
      }
    } catch (error) {
      setError("Failed to save push-ups: " + error.message);
      console.error("Failed to save push-ups:", error);
    }
  };

  return (
    <div className="pushup-container">
      <h1>Push-Up Counter</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="video-container">
        {videoFrame ? (
          <img src={videoFrame} alt="Live Feed" className="video-feed" />
        ) : (
          <p className="loading-text">
            {tracking ? "Video is loading..." : "Click on 'Start Counting' to begin tracking your push-ups."}
          </p>
        )}
      </div>
      <div className="stats">
        <p><strong>Current Pushups:</strong> {currentPushups}</p>
        <p><strong>Total Pushups:</strong> {totalPushups + currentPushups}</p>
        <p>
          <strong>Personal Best:</strong>{" "}
          <span style={{ color: isNewPersonalBest ? "red" : "inherit" }}>
            {personalBest}
          </span>
        </p>
        <p>
          <strong>Level:</strong>{" "}
          <span style={{ color: isNewLevel ? "red" : "inherit" }}>
            {level}
          </span>
        </p>
      </div>
      <div className="buttons">
        {!tracking ? (
          <button className="start-btn" onClick={startTracking}>Start Counting</button>
        ) : (
          <button className="stop-btn" onClick={stopTracking}>Stop Counting</button>
        )}
      </div>
    </div>
  );
};

export default PushupCounter;

