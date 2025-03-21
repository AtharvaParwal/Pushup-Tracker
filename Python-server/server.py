import os
import cv2
import mediapipe as mp
import base64
import numpy as np
import threading
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv

import eventlet
eventlet.monkey_patch()

load_dotenv()

PORT = int(os.getenv("PORT", 5001))  
SECRET_KEY = os.getenv("SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")  

app = Flask(__name__)
app.config["SECRET_KEY"] = SECRET_KEY

# Configure CORS to allow only requests from the frontend
CORS(app, resources={r"/*": {"origins": FRONTEND_URL}})

# Initialize Socket.IO with CORS support
socketio = SocketIO(app, cors_allowed_origins=[FRONTEND_URL])

# Initialize MediaPipe Pose
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Global variables for video capture and push-up tracking
cap = None  # Camera will be initialized later
count = 0  # Push-up count
position = None  # Current position ("up" or "down")
running = False  # Flag to control the video feed loop

# Socket.IO event: Client connects
@socketio.on("connect")
def handle_connect():
    print("Client connected")
    socketio.emit("pushup_count", {"count": count})  # Send initial count to the client

# Socket.IO event: Start camera
@socketio.on("start_camera")
def start_camera():
    global cap, running
    if not running:
        cap = cv2.VideoCapture(0)  # Open the default camera (index 0)
        if not cap.isOpened():
            print("Error: Could not open camera")
            socketio.emit("camera_error", {"message": "Could not open camera"})
            return
        running = True
        threading.Thread(target=generate_frames, daemon=True).start()  # Start frame generation in a separate thread
        print("Camera started")
        socketio.emit("camera_started", {"message": "Camera started successfully"})

# Socket.IO event: Stop camera
@socketio.on("stop_camera")
def stop_camera():
    global cap, running
    running = False
    if cap:
        cap.release()  # Release the camera
        cap = None
    print("Camera stopped")
    socketio.emit("camera_stopped", {"message": "Camera stopped successfully"})

# Function to generate and emit video frames
def generate_frames():
    global count, position, running
    freq = 0
    with mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7) as pose:
        while running:
            success, frame = cap.read()  # Read a frame from the camera
            if not success:
                print("Error: Could not read frame from camera")
                continue

            # Process the frame with MediaPipe Pose
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert to RGB
            result = pose.process(frame)  # Detect pose landmarks
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)  # Convert back to BGR

            # Draw pose landmarks on the frame
            if result.pose_landmarks:
                mp_drawing.draw_landmarks(frame, result.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                # Extract landmark positions
                imlist = []
                for id, lm in enumerate(result.pose_landmarks.landmark):
                    h, w, _ = frame.shape
                    X, Y = int(lm.x * w), int(lm.y * h)
                    imlist.append([id, X, Y])

                if len(imlist) != 0:
                    if ((imlist[12][2] - imlist[14][2]) >= 15 and (imlist[11][2] - imlist[13][2]) >= 15):
                        position = "down"
                    if ((imlist[12][2] - imlist[14][2]) <= 5 and (imlist[11][2] - imlist[13][2]) <= 5) and position == "down":
                        position = "up"
                        freq += 1
                        print("Push-up detected! Count:", freq)  # Debugging
                        socketio.emit("pushup_count", {"count": freq})  # Send updated count to the client

            # Encode the frame as a JPEG image
            _, buffer = cv2.imencode(".jpg", frame)
            frame_bytes = base64.b64encode(buffer).decode("utf-8")  # Convert to base64 string

            # Emit the frame to the frontend
            socketio.emit("video_frame", {"frame": frame_bytes})
            socketio.sleep(0.03)  # Add a small delay to control frame rate

if __name__ == "__main__":
    print(f"Starting server on port {PORT}")
    socketio.run(app, host="0.0.0.0", port=PORT, allow_unsafe_werkzeug=True)


