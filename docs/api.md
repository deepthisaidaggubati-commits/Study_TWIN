# StudyTwin AI API Specification

## Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Get current authenticated user profile
- `PUT /api/auth/profile` - Update profile settings

### Subjects & Topics (`/api/subjects`, `/api/topics`)
- `GET /api/subjects` - List subjects for active user
- `POST /api/subjects` - Create subject
- `GET /api/topics` - List topics (optional query `subjectId`)
- `POST /api/topics` - Create topic

### Study Sessions (`/api/study-sessions`)
- `POST /api/study-sessions` - Record completed or active study session
- `GET /api/study-sessions` - Get study session logs and analytics

### Quizzes (`/api/quizzes`)
- `GET /api/quizzes` - Fetch adaptive quiz questions
- `POST /api/quizzes/:id/attempt` - Submit quiz answers and recalculate mastery

### Digital Twin Engine (`/api/digital-twin`)
- `GET /api/digital-twin/dashboard` - Main metrics (Mastery, Readiness, Streak, Heatmap)
- `GET /api/digital-twin/twin-profile` - Detailed breakdown of user's digital twin state
- `GET /api/digital-twin/forgetting-risk` - Calculated forgetting risks per topic
- `GET /api/digital-twin/recommendations` - Recommended next study actions
- `POST /api/digital-twin/simulate` - What-if simulation execution
