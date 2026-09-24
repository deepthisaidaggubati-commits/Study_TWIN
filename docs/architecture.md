# StudyTwin AI Architecture Documentation

## Architecture Overview

StudyTwin AI is designed around a three-tier decoupling strategy:

1. **Frontend Client (React.js + Vite + Tailwind CSS)**: Interactive single-page application providing high-fidelity visual dashboards, digital twin indicators, interactive study session tools, and what-if simulation interface.
2. **Core Backend (Node.js + Express + MongoDB)**: Handles user authentication, domain business logic, CRUD data management, topic mastery scoring heuristics, and orchestrates calls to the ML engine.
3. **Machine Learning Service (Python + FastAPI + Scikit-Learn/XGBoost)**: Dedicated statistical modeling and predictive engine performing data preprocessing, forgetting risk prediction, performance scoring, and pattern recognition.

```
+------------------+         REST / JSON          +--------------------+
|  React Client    | <-------------------------> |  Express Backend   |
| (Vite + TailWind)|                              | (Node.js / JWT)    |
+------------------+                              +---------+----------+
                                                            |
                                                   MongoDB  |  HTTP Proxy
                                                   Mongoose |  Requests
                                                            v  v
                                                 +----------------------+
                                                 | MongoDB Database     |
                                                 |                      |
                                                 | Python FastAPI ML    |
                                                 +----------------------+
```
