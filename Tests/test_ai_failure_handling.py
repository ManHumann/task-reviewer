"""
Tests for AI failure handling in the backend
"""
import pytest
from fastapi.testclient import TestClient
import os
import tempfile
import json
from unittest.mock import patch, MagicMock
import sys

# Create a temporary file for testing
temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
temp_file.close()

# Sample tasks to initialize the test with
sample_tasks = [
    {
        "id": "1",
        "title": "Fix login issue",
        "description": "Users unable to login after password reset",
        "priority": "HIGH",
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

def test_ai_analysis_success():
    """Test successful AI analysis"""
    # Mock the Gemini client to return a successful response
    with patch('app.routers.genai_client') as mock_client:
        # Mock the interaction response
        mock_interaction = MagicMock()
        mock_interaction.output_text = '{"category": "BUG_REQUEST", "priority": "HIGH", "summary": "Test summary", "recommendedAction": "Test action"}'
        mock_client.interactions.create.return_value = mock_interaction

        response = client.get("/api/tasks")
        assert response.status_code == 200
        tasks = response.json()
        task_id = tasks[0]["id"]

        response = client.post(f"/api/tasks/{task_id}/analyse")
        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "BUG_REQUEST"
        assert data["priority"] == "HIGH"
        assert data["summary"] == "Test summary"
        assert data["recommendedAction"] == "Test action"

def test_ai_analysis_quota_exceeded():
    """Test AI analysis when quota is exceeded (returns fallback)"""
    # Mock the Gemini client to raise a quota exceeded exception
    with patch('app.routers.genai_client') as mock_client:
        mock_client.interactions.create.side_effect = Exception("429 You exceeded your current quota")

        response = client.get("/api/tasks")
        assert response.status_code == 200
        tasks = response.json()
        task_id = tasks[0]["id"]

        response = client.post(f"/api/tasks/{task_id}/analyse")
        # Should return 200 with fallback analysis, not an error
        assert response.status_code == 200
        data = response.json()
        # Should be our fallback analysis
        assert data["category"] == "BUG_REQUEST"
        assert data["priority"] == tasks[0]["priority"]  # Uses original task priority
        assert "quota exceeded" in data["summary"].lower()
        assert "try again later" in data["recommendedAction"].lower()

def test_ai_analysis_service_unavailable():
    """Test AI analysis when service is unavailable (503)"""
    # Mock the Gemini client to raise a 503 exception
    with patch('app.routers.genai_client') as mock_client:
        mock_client.interactions.create.side_effect = Exception("503 UNAVAILABLE The AI model is currently experiencing high demand")

        response = client.get("/api/tasks")
        assert response.status_code == 200
        tasks = response.json()
        task_id = tasks[0]["id"]

        response = client.post(f"/api/tasks/{task_id}/analyse")
        # Should return 503 status code
        assert response.status_code == 503
        assert "high demand" in response.json()["detail"]

def test_ai_analysis_api_key_missing():
    """Test AI analysis when API key is missing"""
    # Temporarily remove API key from environment
    original_key = os.environ.pop("GEMINI_API_KEY", None)

    # Reload the modules to pick up the new environment variable
    if 'app.routers' in sys.modules:
        del sys.modules['app.routers']
    if 'app.main' in sys.modules:
        del sys.modules['app.main']

    # Re-import with updated environment
    sys.path.insert(0, 'to-do-app/backend')
    import app.routers as routers
    from app.main import app
    client = TestClient(app)

    # Reset the genai_client to None since API key is missing
    routers.genai_client = None

    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    task_id = tasks[0]["id"]

    response = client.post(f"/api/tasks/{task_id}/analyse")
    # Should return 500 status code
    assert response.status_code == 500
    assert "Gemini API key not configured" in response.json()["detail"]

    # Restore original API key
    if original_key is not None:
        os.environ["GEMINI_API_KEY"] = original_key

# Clean up after tests
def teardown_module():
    services.DATA_FILE = original_data_file
    if os.path.exists(temp_file.name):
        os.unlink(temp_file.name)