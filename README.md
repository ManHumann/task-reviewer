# Task Management System with AI Analysis

A simple task management application built with React frontend and FastAPI backend, featuring Google Gemini AI integration for task analysis.

## Project Overview

This application demonstrates a full-stack task management system where users can:
- View and manage tasks
- Update task statuses
- Analyze tasks using AI to get categorization, priority recommendations, summaries, and suggested actions
- Filter tasks by status

The application follows a clean separation of concerns with JSON file storage for simplicity and uses environment variables for secure API key management.

## Technologies Used

- **Frontend**: React with Vite
- **Backend**: Python with FastAPI
- **Data Storage**: JSON file
- **AI Integration**: Google Gemini API
- **HTTP Client**: Axios
- **Testing**: Pytest
- **Environment Management**: python-dotenv

## Project Structure

```
task-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   └── main.py
│   ├── tests/
│   │   └── test_task_validation.py
│   ├── .env.example
│   ├── pyproject.toml
│   ├── uv.lock
│   └── .python-version
├── progress.md
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v24.20.0 or higher)
- npm (v11.19.0 or higher)
- Python (3.12.3 or higher)
- uv (Python package installer)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. Start the backend server:
   ```bash
   uv run uvicorn src.main:app --reload
   ```
   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

## API Endpoints

- `GET /tasks` - Retrieve all tasks
- `PATCH /tasks/{id}/status` - Update task status
- `POST /tasks/{id}/analyse` - Analyze task with Gemini AI

## Environment Variables

Create a `.env` file in the backend directory with:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

See `.env.example` for reference.

## Features Implemented

✅ Task management (view, update status)
✅ AI-powered task analysis using Google Gemini
✅ JSON file persistence
✅ RESTful API design
✅ React frontend with task filtering
✅ Error handling for API failures
✅ Automated backend tests
✅ Environment-based API key configuration
✅ CORS configuration for frontend-backend communication

## Error Handling

The application handles various error scenarios gracefully:
- Backend validation of task status values
- Gemini API failures (timeouts, invalid responses, network issues)
- Frontend displays user-friendly error messages
- Application continues to function even when AI analysis fails

## Testing

Run the backend tests with:
```bash
cd backend
.venv/bin/python -m pytest tests/ -v
```

Tests cover:
- Valid task status acceptance
- Invalid task status rejection
- Proper error handling for non-existent tasks

## Implementation Approach

1. **Backend**: Created FastAPI application with task model, JSON storage, and Gemini integration
2. **Frontend**: Built React components to display tasks, update statuses, and trigger AI analysis
3. **Communication**: Used Axios for HTTP requests between frontend and backend
4. **Security**: Stored API keys in environment variables, never exposed to frontend
5. **Persistence**: Used JSON file for simple, inspectable data storage

## AI Integration Details

The Gemini integration follows this flow:
1. Frontend requests analysis for a specific task
2. Backend receives request and calls Gemini API with task details
3. Gemini returns structured analysis (category, priority, summary, recommended action)
4. Backend returns result to frontend
5. Frontend displays analysis results alongside task

## What Could Be Improved with More Time

1. Add user authentication and authorization
2. Implement real-time updates using WebSockets
3. Add more sophisticated task filtering and search
4. Implement task creation and deletion
5. Add loading skeletons for better UX
6. Implement unit tests for frontend components
7. Add data validation and sanitization
8. Implement pagination for large task lists
9. Add more comprehensive error logging
10. Deploy to production environment with proper monitoring

## AI Coding Tools Used

- Claude Code (for code generation, review, and implementation guidance)
- npm and uv for dependency management
- Vite for frontend development tooling
- Pytest for backend testing

## Code Verification

Generated code was verified through:
1. Manual testing of all API endpoints
2. Running the full application stack (frontend + backend)
3. Running automated backend tests
4. Verifying error handling scenarios
5. Checking environment variable usage
6. Validating JSON file persistence