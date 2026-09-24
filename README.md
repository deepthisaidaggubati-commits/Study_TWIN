# StudyTwin AI

### An AI-Driven Digital Twin for Personalized Student Learning and Academic Performance Prediction

StudyTwin AI is an intelligent EdTech platform that maintains a continuously updated digital representation ("Digital Twin") of a student's learning behavior. It continuously analyzes study sessions, duration, quiz attempts, historical accuracy, topic difficulty, and memory retention curves to estimate topic mastery, forecast forgetting risks, generate data-driven recommendations, and simulate hypothetical study scenarios.

---

## Architecture Overview

```text
+------------------------+      HTTP / JSON      +-------------------------+
|     React Client       | <-------------------> |   Express Backend API   |
| (Vite + Tailwind CSS)  |                       |  (Node.js / JWT Auth)   |
+------------------------+                       +------------+------------+
                                                              |
                                                     MongoDB  |  HTTP Proxy
                                                     Mongoose |  Inference
                                                              v  v
                                                  +------------------------+
                                                  | MongoDB Database       |
                                                  |                        |
                                                  | Python FastAPI ML      |
                                                  | (XGBoost / Scikit)     |
                                                  +------------------------+
```

---

## Key Features

1. **Personal Digital Twin Profile**: Continuous behavioral learning model capturing study consistency, peak focus periods, topic mastery, and retention trends.
2. **Real-Time Intelligent Dashboard**: Aggregated metrics displaying overall progress, estimated exam readiness, active streak, 7-day study heatmap, weak topics list, high forgetting-risk alerts, and contextual AI recommendations.
3. **Study Session Tracker & Live Timer**: Track live sessions with Start/Pause/Resume/End controls, `localStorage` persistence across browser refreshes, session notes, and filtering.
4. **Adaptive Quiz Engine**: Topic-wise adaptive quizzes with question banks, detailed answer explanations, automated scoring, and instant topic mastery recalibration.
5. **Ebbinghaus Forgetting-Risk Engine**: Mathematical decay modeling ($R = e^{-kt/S}$) estimating memory decay based on revision intervals and topic difficulty.
6. **Python FastAPI ML Service**: Trained XGBoost & Random Forest classifier/regressor pipeline predicting student retention risks ($97.5\%$ accuracy) with Express fallback proxy.
7. **What-if Digital Twin Simulator**: Compare prospective study schedules (e.g. 2 hrs/day vs 4 hrs/day) with Recharts visual trajectory forecasts over 30/60/90 days.
8. **Interactive Knowledge Graph**: Prerequisite dependency visualizer mapping relationships between Subjects, Topics, Subtopics, and Prerequisites.
9. **Advanced Learning Analytics**: Comprehensive charts for study time heatmaps, topic mastery distribution, quiz score trends, and study-type breakdowns.

---

## Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Recharts, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, bcryptjs
- **Machine Learning**: Python 3.14, FastAPI, Scikit-learn, XGBoost, Pandas, NumPy, Joblib
- **Testing**: Automated integration test suites (`test-db.js`, `test-auth.js`, `test-core-apis.js`, `test-study-sessions.js`, `test-e2e-master.js`)

---

## Directory Structure

```text
StudyTwin/
├── client/                     # React Single-Page Application (Vite)
│   ├── src/
│   │   ├── components/ui/      # Reusable UI component library (Button, Input, Card, Modal, Spinner)
│   │   ├── context/            # AuthContext & ToastContext providers
│   │   ├── layouts/            # DashboardLayout (Sidebar, Top Header, Mobile Drawer)
│   │   ├── pages/              # 15 Application pages (Dashboard, MyTwin, Quiz, Simulator, etc.)
│   │   └── services/           # Axios API service client
│   └── package.json
├── server/                     # Node.js + Express REST API Server
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Express request controllers
│   ├── middleware/             # Auth JWT protection middleware
│   ├── models/                 # 9 Mongoose Schema Models (User, Subject, Topic, Session, etc.)
│   ├── routes/                 # Express API routes
│   ├── services/               # Business logic services & ML Proxy
│   └── utils/                  # Seed dataset generator (seed.js)
├── ml-service/                 # Python FastAPI ML Prediction Service
│   ├── app/                    # FastAPI application & endpoints (main.py)
│   ├── models/                 # Trained XGBoost model artifacts
│   ├── training/               # Training pipeline & dataset generator
│   └── requirements.txt
├── docs/                       # Architecture, API, ML & Schema Documentation
├── .env.example
├── README.md
└── package.json
```

---

## Quick Start & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (local `mongodb://127.0.0.1:27017` or MongoDB Atlas)
- Python (v3.10+)

### 1. Environment Setup

Copy `.env.example` into `server/.env` and `client/.env`:

```env
# server/.env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/studytwin
JWT_SECRET=studytwin_super_secret_jwt_key_2026
ML_SERVICE_URL=http://127.0.0.1:8000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Install Dependencies

```powershell
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install Python ML dependencies
cd ../ml-service
pip install -r requirements.txt
```

### 3. Seed Realistic Demo Dataset

Populate the database with realistic Computer Science curricula, demo user (`demo@studytwin.ai`), study sessions, and adaptive quizzes:

```powershell
cd server
npm run seed
```

---

## Running the Application

Start the three tiers:

1. **Express Backend API** (Port 5000):
   ```powershell
   cd server
   npm run dev
   ```

2. **Python FastAPI ML Service** (Port 8000):
   ```powershell
   cd ml-service
   python -m uvicorn app.main:app --reload --port 8000
   ```

3. **React Client** (Port 5173):
   ```powershell
   cd client
   npm run dev
   ```

Access the web application at **`http://localhost:5173`**.

---

## Automated Test Suites

To execute the automated end-to-end integration tests:

```powershell
cd server
node test-e2e-master.js
```

---

## Data & AI Integrity Disclaimer

StudyTwin AI is an educational decision-support tool. All retention values, risk categories, and readiness scores are **model-based predictions and simulations**, designed to guide student study habits. They do not guarantee specific exam marks or passing outcomes.
