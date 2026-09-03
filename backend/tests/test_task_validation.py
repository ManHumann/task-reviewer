import pytest
from fastapi.testclient import TestClient
import os
import tempfile
import json

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
        "createdAt": "2026-09-03T10:00:00",
        "customerName": "North America Banking",
        "customerMessage": "Customers report being unable to login to their online banking portal after password reset. Error message: 'Invalid credentials'.",
        "attachments": ["screenshot_login_error.png", "logs.txt"]
    },
    {
        "id": "2",
        "title": "Update documentation",
        "description": "API documentation needs updating for new endpoints",
        "priority": "MEDIUM",
        "status": "NEW",
        "createdAt": "2026-09-03T10:00:00",
        "customerName": "Internal Team",
        "customerMessage": "The API documentation for the new /v2/tasks endpoints is missing or outdated. Please update with examples and error codes.",
        "attachments": []
    }
]

# Initialize the temporary file with sample tasks
with open(temp_file.name, 'w') as f:
    json.dump(sample_tasks, f)

# Override the DATA_FILE in the main module before importing
import sys
sys.path.insert(0, '/home/mann/work/odin/assignmnet/demo-app/backend/src')
import main
original_data_file = main.DATA_FILE
main.DATA_FILE = temp_file.name

# Now import the app
from main import app
client = TestClient(app)

def test_valid_task_status_accepted():
    """Test that valid task status values are accepted"""
    # First create a task by using the sample data or we'll test with existing tasks
    response = client.get("/tasks")
    assert response.status_code == 200
    tasks = response.json()
    # Should have our sample tasks
    assert len(tasks) > 0

    # Test updating to each valid status
    for status in ["NEW", "IN_PROGRESS", "COMPLETED"]:
        task_id = tasks[0]["id"]
        response = client.patch(f"/tasks/{task_id}/status", json={"status": status})
        assert response.status_code == 200
        updated_task = response.json()
        assert updated_task["status"] == status

def test_invalid_task_status_rejected():
    """Test that invalid task status values are rejected"""
    response = client.get("/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0

    task_id = tasks[0]["id"]

    # Test various invalid status values
    invalid_statuses = ["invalid", "done", "pending", "", "new", "In_Progress"]
    for status in invalid_statuses:
        response = client.patch(f"/tasks/{task_id}/status", json={"status": status})
        assert response.status_code == 400
        assert "Invalid status" in response.json()["detail"]

def test_task_not_found():
    """Test that updating status of non-existent task returns 404"""
    response = client.patch("/tasks/999/status", json={"status": "IN_PROGRESS"})
    assert response.status_code == 404
    assert "Task not found" in response.json()["detail"]

# Clean up after tests
def teardown_module():
    main.DATA_FILE = original_data_file
    if os.path.exists(temp_file.name):
        os.unlink(temp_file.name)