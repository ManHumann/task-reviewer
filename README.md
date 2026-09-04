# Task Management Application

This is a full-stack application with a Python/FastAPI backend and a React/Vite frontend.

## 📋 Prerequisites

- Backend: Python 3.14+ (with virtual environment)
- Frontend: Node.js and npm
- Git (for cloning, but not required for running)

## 📁 Project Structure

```
/backend
  /app
    __init__.py
    main.py          # FastAPI app entry point
    schemas.py       # Pydantic models
    services.py      # Business logic and data handling
    routers.py       # API route definitions
  requirements.txt   # Python dependencies
  tasks.json         # Data storage (auto-generated)
  .env               # Environment variables (including GEMINI_API_KEY)

/frontend
  /src
    /components
      LeftSidebar.jsx
      CenterMainView.jsx
      RightSidebar.jsx
      NewTaskModal.jsx
      TopNavigationBar.jsx
    App.jsx
    main.jsx
  index.html
  package.json
  vite.config.js
  requirements.txt   # Frontend dependencies (npm packages in package==version format)
```

## 🚀 How to Run the Application

### 1. Kill Any Existing Processes (Important - Run First)
```bash
# Kill processes on backend and frontend ports
lsof -ti:8000 | xargs kill -9 2>/dev/null || true; lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo "🧹 Cleared ports 8000 (backend) and 5173 (frontend)"
```
Install the requirements file , you have to create a virtual python environment for running backend

### 2. Start the Backend Server
```bash
# Change to backend directory
cd to-do-app/backend
#Create a .env file to store your GEMINI API KEY
cp .env.example .env

# Start the backend server (with auto-reload)
.venv/bin/python -m app.main --reload
```
- The backend will be available at: http://localhost:8000
- API documentation: http://localhost:8000/docs
- The server will automatically reload when you change Python code

### 3. Start the Frontend Server
```bash
# In a new terminal tab/window, change to frontend directory
cd to-do-app/frontend

# Start the frontend development server
npm run dev -- --port 5173
```
- The frontend will be available at: http://localhost:5173
- The server will automatically reload when you change frontend code

### 4. Use the Application
- Open your browser to http://localhost:5173
- You should see the task management interface
- Click on a task to select it
- Click the "Analyze with AI" button to get AI analysis for the selected task
- The AI Triage Terminal panel will show:
  - Loading state while the request is in-flight
  - Raw JSON response when successful (in the debug block)
  - Error details if the request fails
  - The styled UI with the analysis results

### 5. Verify the API is Working (Optional)
```bash
# Test backend health (should return task list)
curl -s http://localhost:8000/api/tasks | head -3

# Test AI analysis (should return analysis or fallback)
curl -s -X POST http://localhost:8000/api/tasks/1/analyse | head -3
```

## 🛑 To Stop the Servers
```bash
# Kill processes on backend and frontend ports
lsof -ti:8000 | xargs kill -9 2>/dev/null || true; lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo "🛑 Servers stopped"
```

## 📝 Important Notes

### Backend
- The backend uses a modular structure with separate files for schemas, services, and routers
- The AI analysis endpoint uses the Google Gemini API with proper error handling
- If the Gemini API quota is exceeded, the backend returns a fallback analysis instead of an error
- Environment variables are loaded from `.env` (including `GEMINI_API_KEY`)

### Frontend
- The frontend now includes a local error boundary in the AI Triage Terminal component
- The AI Triage Terminal always shows a raw JSON debug block:
  - Loading state: "Loading..."
  - Success: Pretty-printed JSON response from the API
  - Error: Raw error object/message including status code and response body
- The frontend only triggers AI analysis when the "Analyze with AI" button is clicked (not on task selection)
- Console logs are added at each step of the fetch lifecycle for debugging
- The frontend correctly calls backend endpoints with the `/api/` prefix

### Data Persistence
- Tasks are stored in `backend/tasks.json` (JSON file)
- Sample tasks are seeded automatically if the file doesn't exist or is empty
- The file is updated whenever tasks are created, updated, or deleted

## 🔧 Troubleshooting

### Backend not starting?
- Check that the virtual environment is activated (though we use the direct path to the Python executable)
- Verify that the `GEMINI_API_KEY` is set in `.env`
- Check the backend logs for error messages

### Frontend not connecting to backend?
- Verify that the backend is running on port 8000
- Check that the frontend is making requests to `http://localhost:8000/api/*`
- Look at the browser's DevTools → Network tab for failed requests
- Check the frontend console for error messages

### AI Analysis not showing results?
- Check if the Gemini API quota has been exceeded (backend will return a fallback analysis)
- Look at the raw JSON debug block in the AI Triage Terminal for the actual response
- Check the backend logs for any errors during AI analysis

## 📄 License
This project is for educational purposes.