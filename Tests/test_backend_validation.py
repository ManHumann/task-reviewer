"""
Tests for backend validation logic
"""
import pytest
from fastapi.testclient import TestClient
import os
import tempfile
import json
import sys

# Create a temporary file for testing
temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
temp_file.close()

# Sample tasks to initialize the test with (matching the updated Task model)
sample_tasks = [
    {
        "id": "1",
        "title": "Fix login issue",
        "description": "Users unable to login after password reset",
        "priority": "HIGH",
        "status": "NEW",
        "createdAt": "2026-09-03T10:00:00"
    },
    {
        "id": "2",
        "title": "Update documentation",
        "description": "API documentation needs updating for new endpoints",
        "priority": "MEDIUM",
        "status": "NEW",
        "createdAt": "2026-09-03T10:00:00"
    }
]

# Initialize the temporary file with sample tasks
with open(temp_file.name, 'w') as f:
    json.dump(sample_tasks, f)

# Override the DATA_FILE in the services module before importing
sys.path.insert(0, 'to-do-app/backend')
import app.services as services
original_data_file = services.DATA_FILE
services.DATA_FILE = temp_file.name

# Import the app from the correct location
sys.path.insert(0, 'to-do-app/backend')
from app.main import app
client = TestClient(app)

def test_valid_task_status_accepted():
    """Test that valid task status values are accepted"""
    # First create a task by using the sample data or we'll test with existing tasks
    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    # Should have our sample tasks
    assert len(tasks) > 0

    # Test updating to each valid status
    for status in ["NEW", "IN PROGRESS", "COMPLETED"]:
        task_id = tasks[0]["id"]
        response = client.patch(f"/api/tasks/{task_id}/status", json={"status": status})
        assert response.status_code == 200
        updated_task = response.json()
        assert updated_task["status"] == status

def test_invalid_task_status_rejected():
    """Test that invalid task status values are rejected"""
    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0

    task_id = tasks[0]["id"]

    # Test various invalid status values
    invalid_statuses = ["invalid", "done", "pending", "", "new", "In_Progress", "completed", "in progress"]
    for status in invalid_statuses:
        response = client.patch(f"/api/tasks/{task_id}/status", json={"status": status})
        assert response.status_code == 400
        assert "Invalid status" in response.json()["detail"]

def test_valid_task_priority_accepted():
    """Test that valid task priority values are accepted"""
    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0

    # Test updating to each valid priority
    for priority in ["LOW", "MEDIUM", "HIGH"]:
        task_id = tasks[0]["id"]
        response = client.patch(f"/api/tasks/{task_id}/priority", json={"priority": priority})
        assert response.status_code == 200
        updated_task = response.json()
        assert updated_task["priority"] == priority

def test_invalid_task_priority_rejected():
    """Test that invalid task priority values are rejected"""
    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0

    task_id = tasks[0]["id"]

    # Test various invalid priority values
    invalid_priorities = ["invalid", "highest", "lowest", "", "low", "medium", "high"]
    for priority in invalid_priorities:
        response = client.patch(f"/api/tasks/{task_id}/priority", json={"priority": priority})
        assert response.status_code == 400
        assert "Invalid priority" in response.json()["detail"]

def test_task_not_found():
    """Test that updating status/priority of non-existent task returns 404"""
    # Test status update
    response = client.patch("/api/tasks/999/status", json={"status": "IN PROGRESS"})
    assert response.status_code == 404
    assert "Task not found" in response.json()["detail"]

    # Test priority update
    response = client.patch("/api/tasks/999/priority", json={"priority": "HIGH"})
    assert response.status_code == 404
    assert "Task not found" in response.json()["detail"]

def test_ai_analysis_endpoint_exists():
    """Test that the AI analysis endpoint exists and returns proper structure"""
    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0

    task_id = tasks[0]["id"]
    # Note: This test might fail if Gemini API is not configured or quota exceeded
    # We're just checking that the endpoint exists and returns proper HTTP codes
    response = client.post(f"/api/tasks/{task_id}/analyse")
    # Should return either 200 (success) or 500/503/429 (API errors handled gracefully)
    assert response.status_code in [200, 500, 503, 429]

    if response.status_code == 200:
        # If successful, check that it has the expected structure
        data = response.json()
        assert "category" in data
        assert "priority" in data
        assert "summary" in data
        assert "recommendedAction" in data

# Clean up after tests
def teardown_module():
    services.DATA_FILE = original_data_file
    if os.path.exists(temp_file.name):
        os.unlink(temp_file.name)