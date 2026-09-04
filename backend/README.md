# Backend Structure

## Directory Layout
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app entry point
│   ├── schemas.py       # Pydantic models
│   ├── services.py      # Business logic and data handling
│   └── routers.py       # API route definitions
├── tests/               # Test files
├── .env                 # Environment variables
├── pyproject.toml       # Project configuration
└── tasks.json           # Data storage (auto-generated)
```

## API Endpoints
All endpoints are prefixed with `/api`:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/{task_id}/status` - Update task status
- `PATCH /api/tasks/{task_id}/priority` - Update task priority
- `POST /api/tasks/{task_id}/analyse` - Analyze task with AI

## Environment Variables
- `GEMINI_API_KEY` - API key for Gemini AI service