from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from .schemas import Task, TaskCreate, TaskUpdate, PriorityUpdate, TaskAnalysis
from .services import (
    load_tasks, save_tasks, validate_task_status, validate_task_priority,
    _sample_tasks
)
from google import genai
import os
import re
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Initialize Gemini client
api_key = os.getenv("GEMINI_API_KEY")
genai_client = genai.Client(api_key=api_key) if api_key else None

@router.get("/tasks", response_model=List[Task])
async def get_tasks():
    """Get all tasks"""
    tasks = load_tasks()
    if not tasks:
        # Seed sample tasks if no tasks exist
        sample_tasks = _sample_tasks()
        save_tasks(sample_tasks)
        return sample_tasks
    return tasks

@router.post("/tasks", response_model=Task)
async def create_task(task_create: TaskCreate):
    """Create a new task"""
    # Validate priority
    if not validate_task_priority(task_create.priority):
        raise HTTPException(status_code=400, detail=f"Invalid priority: {task_create.priority}")

    tasks = load_tasks()

    # Generate a new ID (simple approach: use timestamp)
    new_id = str(int(datetime.now().timestamp() * 1000))

    # Create the task object
    new_task = Task(
        id=new_id,
        title=task_create.title,
        description=task_create.description,
        priority=task_create.priority,
        status="NEW",  # Default status for new tasks
        createdAt=datetime.now().isoformat()
    )

    tasks.append(new_task)
    save_tasks(tasks)

    return new_task

@router.patch("/tasks/{task_id}/status", response_model=Task)
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

@router.patch("/tasks/{task_id}/priority", response_model=Task)
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

@router.post("/tasks/{task_id}/analyse", response_model=TaskAnalysis)
async def analyse_task(task_id: str):
    """Analyze a task using Gemini AI"""
    if not genai_client:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")

    tasks = load_tasks()
    task = None

    for t in tasks:
        if t.id == task_id:
            task = t
            break

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        # Create prompt for task analysis
        prompt = f"""
        Analyze the following task and provide structured information:

        Title: {task.title}
        Description: {task.description}
        Priority: {task.priority}
        Status: {task.status}

        Please respond with a JSON object containing:
        - category: one of [BUG_REQUEST, FEATURE_REQUEST, DOCUMENT_REQUEST, TECHNICAL_DEBT, OTHER]
        - priority: one of [HIGH, MEDIUM, LOW] (based on the analysis)
        - summary: a brief summary of what the task is about
        - recommendedAction: a recommended action to take for this task

        Respond only with valid JSON.
        """

        # Generate content using interactions.create (as per working test)
        interaction = genai_client.interactions.create(
            model="gemini-3.8-flash",
            input=prompt
        )
        response_text = interaction.output_text

        # Parse the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
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
        error_str = str(e)
        if "503 UNAVAILABLE" in error_str:
            raise HTTPException(
                status_code=503,
                detail="The AI model is currently experiencing high demand. Please try again later."
            )
        elif "429" in error_str or "too_many_requests" in error_str.lower() or "quota exceeded" in error_str.lower():
            # If quota exceeded, return a fallback analysis instead of error
            return TaskAnalysis(
                category="BUG_REQUEST",  # default category
                priority=task.priority,  # use the task's original priority
                summary=f"Analysis of task: {task.title} (quota exceeded, using fallback)",
                recommendedAction="Please try again later when the AI quota is available, or review the task manually."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"AI analysis failed: {str(e)}"
            )


@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task"""
    tasks = load_tasks()
    task_index = None
    for i, task in enumerate(tasks):
        if task.id == task_id:
            task_index = i
            break
    if task_index is None:
        raise HTTPException(status_code=404, detail="Task not found")
    # Remove the task
    del tasks[task_index]
    save_tasks(tasks)
    return {"detail": "Task deleted"}