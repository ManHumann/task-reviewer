import os
import json
from contextlib import asynccontextmanager
from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed sample tasks on first run (replaces deprecated on_event("startup"))
    if not os.path.exists(DATA_FILE):
        save_tasks(_sample_tasks())
    yield

app = FastAPI(title="Task Management API", version="1.0.0", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Task model
class Task(BaseModel):
    id: str
    title: str
    description: str
    priority: str  # HIGH, MEDIUM, LOW
    status: str    # NEW, IN_PROGRESS, COMPLETED
    createdAt: str
    customerName: str
    customerMessage: str
    attachments: List[str]

class TaskCreate(BaseModel):
    title: str
    description: str
    priority: str  # HIGH, MEDIUM, LOW

class TaskUpdate(BaseModel):
    status: str

class PriorityUpdate(BaseModel):
    priority: str  # HIGH, MEDIUM, LOW

class TaskAnalysis(BaseModel):
    category: str
    priority: str
    summary: str
    recommendedAction: str

# Valid values
VALID_STATUSES = {"NEW", "IN_PROGRESS", "COMPLETED"}
VALID_PRIORITIES = {"HIGH", "MEDIUM", "LOW"}

# Storage file
DATA_FILE = "tasks.json"

def load_tasks() -> List[Task]:
    """Load tasks from JSON file"""
    if not os.path.exists(DATA_FILE):
        return []

    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return [Task(**task) for task in data]
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_tasks(tasks: List[Task]):
    """Save tasks to JSON file"""
    with open(DATA_FILE, 'w') as f:
        json.dump([task.model_dump() for task in tasks], f, indent=2)

def validate_task_status(status: str) -> bool:
    """Validate task status"""
    return status in VALID_STATUSES

def validate_task_priority(priority: str) -> bool:
    """Validate task priority"""
    return priority in VALID_PRIORITIES

def _sample_tasks() -> List[Task]:
    """Sample tasks used to seed tasks.json on first run"""
    return [
            Task(
                id="1",
                title="Fix login issue",
                description="Users unable to login after password reset",
                priority="HIGH",
                status="NEW",
                createdAt=datetime.now().isoformat(),
                customerName="North America Banking",
                customerMessage="Customers report being unable to login to their online banking portal after password reset. Error message: 'Invalid credentials'.",
                attachments=["screenshot_login_error.png", "logs.txt"]
            ),
            Task(
                id="2",
                title="Update documentation",
                description="API documentation needs updating for new endpoints",
                priority="MEDIUM",
                status="NEW",
                createdAt=datetime.now().isoformat(),
                customerName="Internal Team",
                customerMessage="The API documentation for the new /v2/tasks endpoints is missing or outdated. Please update with examples and error codes.",
                attachments=[]
            ),
            Task(
                id="3",
                title="Database optimization",
                description="Optimize slow queries in user service",
                priority="MEDIUM",
                status="IN_PROGRESS",
                createdAt=datetime.now().isoformat(),
                customerName="Database Team",
                customerMessage="Queries in the user service are taking >5 seconds to execute during peak hours. Need to add indexes and refactor joins.",
                attachments=["query_explain_plan.pdf"]
            ),
            Task(
                id="4",
                title="Refactor legacy module",
                description="Refactor the billing module for better performance",
                priority="LOW",
                status="COMPLETED",
                createdAt=datetime.now().isoformat(),
                customerName="Billing Department",
                customerMessage="The legacy billing module is causing delays in invoice generation. Refactor to use the new payment gateway API.",
                attachments=["module_diagram.vsdx", "test_results.json"]
            )
    ]

@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    """Get all tasks"""
    return load_tasks()

@app.post("/tasks", response_model=Task)
async def create_task(task_create: TaskCreate):
    """Create a new task"""
    # Validate priority
    if not validate_task_priority(task_create.priority):
        raise HTTPException(status_code=400, detail=f"Invalid priority: {task_create.priority}")

    tasks = load_tasks()

    # Generate a new ID (simple approach: use timestamp)
    new_id = str(int(datetime.now().timestamp() * 1000))

    # Create the task object with default values for customer-related fields
    new_task = Task(
        id=new_id,
        title=task_create.title,
        description=task_create.description,
        priority=task_create.priority,
        status="NEW",  # Default status for new tasks
        createdAt=datetime.now().isoformat(),
        customerName="Unknown Customer",
        customerMessage="No message provided",
        attachments=[]
    )

    tasks.append(new_task)
    save_tasks(tasks)

    return new_task

@app.patch("/tasks/{task_id}/status", response_model=Task)
async def update_task_status(task_id: str, task_update: TaskUpdate):
    """Update task status"""
    if not validate_task_status(task_update.status):
        raise HTTPException(status_code=400, detail=f"Invalid status: {task_update.status}")

    tasks = load_tasks()
    task_index = None

    for i, task in enumerate(tasks):
        if task.id == task_id:
            task_index = i
            break

    if task_index is None:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update the task
    tasks[task_index].status = task_update.status
    save_tasks(tasks)

    return tasks[task_index]

@app.patch("/tasks/{task_id}/priority", response_model=Task)
async def update_task_priority(task_id: str, priority_update: PriorityUpdate):
    """Update task priority"""
    # Validate priority
    if not validate_task_priority(priority_update.priority):
        raise HTTPException(status_code=400, detail=f"Invalid priority: {priority_update.priority}")

    tasks = load_tasks()
    task_index = None

    for i, task in enumerate(tasks):
        if task.id == task_id:
            task_index = i
            break

    if task_index is None:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update the task's priority
    tasks[task_index].priority = priority_update.priority
    save_tasks(tasks)

    return tasks[task_index]

@app.post("/tasks/{task_id}/analyse", response_model=TaskAnalysis)
async def analyse_task(task_id: str):
    """Analyze a task using Gemini AI"""
    tasks = load_tasks()
    task = None

    for t in tasks:
        if t.id == task_id:
            task = t
            break

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Get Gemini API key from environment
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")

    try:
        import google.generativeai as genai

        # Configure Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Create prompt for task analysis
        prompt = f"""
        Analyze the following task and provide structured information:

        Title: {task.title}
        Description: {task.description}
        Priority: {task.priority}
        Status: {task.status}
        Customer Name: {task.customerName}
        Customer Message: {task.customerMessage}

        Please respond with a JSON object containing:
        - category: one of [BUG_REQUEST, FEATURE_REQUEST, DOCUMENT_REQUEST, TECHNICAL_DEBT, OTHER]
        - priority: one of [HIGH, MEDIUM, LOW] (based on the analysis)
        - summary: a brief summary of what the task is about
        - recommendedAction: a recommended action to take for this task

        Respond only with valid JSON.
        """

        # Generate content
        response = model.generate_content(prompt)

        # Parse the response
        import re
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            # Validate the result has required fields
            required_fields = ["category", "priority", "summary", "recommendedAction"]
            if all(field in result for field in required_fields):
                return TaskAnalysis(**result)

        # Fallback if parsing fails
        return TaskAnalysis(
            category="OTHER",
            priority=task.priority,
            summary=f"Analysis of task: {task.title}",
            recommendedAction="Review the task details and determine appropriate action"
        )

    except Exception as e:
        # Handle AI API failures gracefully
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
