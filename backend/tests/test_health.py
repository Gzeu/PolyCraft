import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    """Test health endpoint returns 200 OK"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "version" in data

def test_api_health_endpoint():
    """Test API health endpoint returns 200 OK"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "services" in data
    assert data["services"]["image_generation"] == "operational"
    assert data["services"]["text_generation"] == "operational"
    assert data["services"]["audio_generation"] == "operational"

def test_root_endpoint():
    """Test root endpoint returns welcome message"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "PolyCraft" in data["message"]
    assert data["version"] == "1.0.0"