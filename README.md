# Task Management Application

This is a full-stack application with a Python/FastAPI backend and a React/Vite frontend.

## Prerequisites

- Backend: Python 3.14+ (with virtual environment)
- Frontend: Node.js and npm


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
- Install the requirements file , you have to create a virtual python environment for running backend
- Create using => python3 -m venv .venv
- Activate your environment (if linux use) => source/bin/activate
- install the requirements => pip install -r requirements.txt

### 2. Start the Backend Server
```bash
# Change to backend directory
cd task-reviewer/backend
#Create a .env file to store your GEMINI API KEY
cp .env.example .env



# Start the backend server (with auto-reload)
.venv/bin/python -m app.main --reload
or
activate your virtual machine and run in ~/task-reviewer/backend$ python -m app.main --reload
```
- The backend will be available at: http://localhost:8000
- API documentation: http://localhost:8000/docs
- The server will automatically reload when you change Python code

### 3. Start the Frontend Server
```bash
# In a new terminal tab/window, change to frontend directory
cd task-reviewer/frontend

#Install Packages
npm install

# Start the frontend development server
export PATH="$HOME/.nvm/versions/node/v24.20.0/bin:$PATH"
npm run dev -- --host 0.0.0.0 --port 5173
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

## Brief explanation of your approach.

- The app is built on React JS as frontend and FastAPI as backend.
- The app is mostly built on CRUD operations.
- I used FastAPI because of the simplicity of the app — since it was a simple one-page UI with no need for user login or roles, using a framework like Django would be too heavy for the scope of this task.
- The UI is easy to navigate and does not really need any instructions to use.
- FastAPI allowed for quick setup and provided a built-in /docs page to test the API endpoints, which was very helpful during development.
- The application starts up with the first task pre-selected. One can change the priority and status of the task.
- Tasks can be filtered with predefined filters or simply searched.
- By default, the status of a newly created task is set to "new," and that is immutable.
- In the task card, the "Complete Task" button in red indicates deletion of the task.


## What I would improve if I had more time.

- Setting up preconditions for completing a task (deleting the task card) — if we were to set a condition which enforced that a task should only be deleted if the task status == completed.

- When analysing with AI, I found that after analysis, when we click on another task or elsewhere, the banner with the AI suggestion collapses. We then have to run the analysis again to see the result for the same task. The state is not persistent, and since an AI model may give a different answer every time we prompt it, prompting again and again will also increase token cost (in the case of the free Gemini model, it may even hit rate limits). Adding persistent data storage to keep the latest analysis result — or even a history of analyses for a particular task — would be a big improvement.

- Creating embeddings of requests and storing them in a vector database could save on token cost down the line, once enough tasks have been handled.

- Introducing a departments field would also improve business processes and help optimize each sector.

## Which AI coding tools you used.

- UI design = https://stitch.withgoogle.com/
- Coding assistance = Claude Code and GitHub Copilot

## How you checked that AI-generated code was correct.

- Manually tested all the features and buttons individually in the frontend, and tested the API endpoints via the backend docs. Noted down required changes in a physical notebook.

- Had the coding assistant write automated testing scripts.


## 📄 License
This project is for educational purposes.
