import os
import json
from datetime import datetime
from typing import List
from .schemas import Task, TaskCreate, TaskUpdate, PriorityUpdate, TaskAnalysis

# Valid values
VALID_STATUSES = {"NEW", "IN PROGRESS", "COMPLETED"}
VALID_PRIORITIES = {"LOW", "MEDIUM", "HIGH"}

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
            createdAt=datetime.now().isoformat()
        ),
        Task(
            id="2",
            title="Update documentation",
            description="API documentation needs updating for new endpoints",
            priority="MEDIUM",
            status="NEW",
            createdAt=datetime.now().isoformat()
        ),
        Task(
            id="3",
            title="Database optimization",
            description="Optimize slow queries in user service",
            priority="MEDIUM",
            status="IN PROGRESS",
            createdAt=datetime.now().isoformat()
        ),
        Task(
            id="4",
            title="Refactor legacy module",
            description="Refactor the billing module for better performance",
            priority="LOW",
            status="COMPLETED",
            createdAt=datetime.now().isoformat()
        )
    ]