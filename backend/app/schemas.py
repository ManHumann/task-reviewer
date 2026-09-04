from pydantic import BaseModel
from typing import List

# Task model
class Task(BaseModel):
    id: str
    title: str
    description: str
    priority: str  # LOW, MEDIUM, HIGH
    status: str    # NEW, IN PROGRESS, COMPLETED
    createdAt: str

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