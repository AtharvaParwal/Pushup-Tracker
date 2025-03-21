```md
# 🏋️ Push-Up Tracker

A real-time push-up tracking web application that utilizes **MERN stack** for frontend and backend, along with **Python, OpenCV, and Mediapipe** for push-up detection. The application tracks push-ups in real-time, stores user progress, and maintains a leaderboard.

---

## **🚀 Features**
- 📊 **Real-time Push-up Counting** using **OpenCV & Mediapipe** in Python.
- 🔄 **Live Data Updates** with **Flask-SocketIO** for seamless frontend-backend communication.
- 🔐 **User Authentication & Profile Management** with MongoDB.
- 🏆 **Leaderboard System** ranking users based on **total push-ups**, **personal best**, and **registration order**.
- 📈 **User Levels** based on total push-ups to keep motivation high.

---

## **🛠️ Tech Stack**
### **Frontend**
- **React.js** (User Interface)
- **Axios** (API requests)

### **Backend**
- **Node.js + Express.js** (REST API)
- **MongoDB + Mongoose** (Database)
- **Cloudinary** (Profile image uploads)

### **Python Server**
- **Flask + Flask-SocketIO** (Real-time push-up detection)
- **OpenCV & Mediapipe** (Pose estimation)

---

## **📂 Project Structure**
```
pushup-tracker/
│── backend/                # Node.js Backend
│   │── controllers/        # Request handlers
│   │── middleware/         # Middleware functions
│   │── models/            # Mongoose Models
│   │── routes/            # API Routes
│   │── utils/             # Utility functions
│   │── .env               # Environment variables
│   │── server.js          # Entry point
│
│── frontend/               # React.js Frontend
│   │── src/
│   │   │── components/    # Reusable UI components
│   │   │── pages/         # React Pages
│   │   │── services/      # API calls
│   │   │── App.js        # Main App Component
│   │── .env               # Environment variables
│
│── python-server/          # Flask Server (Push-up detection)
│   │── models/            # ML/Detection models
│   │── utils/             # Helper functions
│   │── server.py          # Main Flask server
│   │── requirements.txt   # Dependencies
│   │── .env               # Environment variables
│
│── docker-compose.yml      # Docker configuration
│── README.md               # Project Documentation
```

---

## **🛠️ Installation & Setup**

### **🔹 1️⃣ Clone the Repository**
First, clone the repository and navigate to the project directory:
```sh
git clone https://github.com/your-username/pushup-tracker.git
cd pushup-tracker
```

---

### **🔹 2️⃣ Backend Setup**
#### **📌 Navigate to Backend**
```sh
cd backend
```

#### **📌 Install Dependencies**
```sh
npm install
```

#### **📌 Configure `.env` File**
Create a `.env` file inside the **backend** folder and add:
```env
# Server Port
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://mongo:<your_password>@mainline.proxy.rlwy.net:5947/pushup_db

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT Token Configuration
ACCESS_TOKEN_EXPIRES=15m
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES=7d

# Default Avatar Image
DEFAULT_AVATAR=https://res.cloudinary.com/dcrlrz4mm/image/upload/v1741676564/young-strong-man_h8k0bb.jpg

# CORS Configuration
FRONTEND_URL=http://localhost:3000  # Or Railway frontend URL after deployment
```
> Replace `<your_password>` with the actual **MongoDB password** from Railway.

#### **📌 Start the Backend Server**
```sh
npm start
```

---

### **🔹 3️⃣ Frontend Setup**
#### **📌 Navigate to Frontend**
```sh
cd ../frontend
```

#### **📌 Install Dependencies**
```sh
npm install
```

#### **📌 Configure `.env` File**
Create a `.env` file inside the **frontend** folder and add:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_PYTHON_URL=http://localhost:5001
```
#### **📌 Start the Frontend Server**
```sh
npm start
```

---

### **🔹 4️⃣ Python Server Setup**
#### **📌 Navigate to Python Server**
```sh
cd ../python-server
```

#### **📌 Create & Activate Virtual Environment**
```sh
python -m venv venv
source venv/bin/activate  # MacOS/Linux
venv\Scripts\activate     # Windows
```

#### **📌 Install Dependencies**
```sh
pip install -r requirements.txt
```

#### **📌 Configure `.env` File**
Create a `.env` file inside the **python-server** folder and add:
```env
PORT=5001
FRONTEND_URL=http://localhost:3000  # Or Railway frontend URL after deployment
```

#### **📌 Start the Python Server**
```sh
python server.py
```

---

## **✅ Testing**
1️⃣ **Start the backend (`http://localhost:5000`)**  
2️⃣ **Start the Python server (`http://localhost:5001`)**  
3️⃣ **Start the frontend (`http://localhost:3000`)**  
4️⃣ **Go to the browser** and test real-time push-up tracking.

---

## **🚀 Deployment**
- **Containerized with Docker**
- **Database hosted on Railway (MongoDB)**
- **Frontend, Backend, and Python server can be deployed separately**

---

## **📌 Contributing**
Feel free to fork the repository and submit pull requests.
```