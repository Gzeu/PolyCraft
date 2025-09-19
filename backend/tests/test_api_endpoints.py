import pytest
import httpx
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import asyncio
import json

from main import app

client = TestClient(app)

class TestHealthEndpoints:
    """Test health check endpoints"""
    
    def test_health_check(self):
        """Test basic health endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"
    
    def test_api_health_check(self):
        """Test API health endpoint"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "timestamp" in data
        assert "version" in data

class TestImageGeneration:
    """Test image generation endpoints"""
    
    @patch('httpx.AsyncClient.get')
    def test_generate_image_success(self, mock_get):
        """Test successful image generation"""
        # Mock response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.url = "https://image.pollinations.ai/prompt/test"
        mock_get.return_value = mock_response
        
        payload = {
            "prompt": "A beautiful sunset",
            "model": "flux",
            "width": 1024,
            "height": 1024
        }
        
        response = client.post("/api/generate/image", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "url" in data
    
    def test_generate_image_missing_prompt(self):
        """Test image generation with missing prompt"""
        payload = {
            "model": "flux",
            "width": 1024,
            "height": 1024
        }
        
        response = client.post("/api/generate/image", json=payload)
        assert response.status_code == 422
    
    def test_generate_image_invalid_dimensions(self):
        """Test image generation with invalid dimensions"""
        payload = {
            "prompt": "A test image",
            "width": 50,  # Too small
            "height": 50
        }
        
        response = client.post("/api/generate/image", json=payload)
        assert response.status_code == 422

class TestTextGeneration:
    """Test text generation endpoints"""
    
    def test_generate_text_static(self):
        """Test static text generation"""
        payload = {
            "prompt": "Tell me about AI",
            "model": "static"
        }
        
        response = client.post("/api/generate/text", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "text" in data
        assert "source" in data
        assert data["source"] == "static"
    
    @patch('httpx.AsyncClient.post')
    def test_generate_text_openai(self, mock_post):
        """Test OpenAI text generation"""
        # Mock OpenAI response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{
                "message": {
                    "content": "This is AI generated text"
                }
            }]
        }
        mock_post.return_value = mock_response
        
        payload = {
            "prompt": "Tell me about AI",
            "model": "openai"
        }
        
        response = client.post("/api/generate/text", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "text" in data
        assert "source" in data
    
    def test_generate_text_missing_prompt(self):
        """Test text generation with missing prompt"""
        payload = {
            "model": "static"
        }
        
        response = client.post("/api/generate/text", json=payload)
        assert response.status_code == 422

class TestAudioGeneration:
    """Test audio generation endpoints"""
    
    @patch('httpx.AsyncClient.post')
    def test_generate_audio_success(self, mock_post):
        """Test successful audio generation"""
        # Mock TTS response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.content = b"fake audio data"
        mock_post.return_value = mock_response
        
        payload = {
            "prompt": "Hello world",
            "voice": "alloy",
            "speed": 1.0
        }
        
        response = client.post("/api/generate/audio", json=payload)
        assert response.status_code == 200
        assert response.headers["content-type"] == "audio/mpeg"
    
    def test_generate_audio_missing_prompt(self):
        """Test audio generation with missing prompt"""
        payload = {
            "voice": "alloy",
            "speed": 1.0
        }
        
        response = client.post("/api/generate/audio", json=payload)
        assert response.status_code == 422

class TestBatchProcessing:
    """Test batch processing endpoints"""
    
    @patch('httpx.AsyncClient.get')
    @patch('httpx.AsyncClient.post')
    def test_batch_mixed_requests(self, mock_post, mock_get):
        """Test batch processing with mixed request types"""
        # Mock image response
        mock_image_response = MagicMock()
        mock_image_response.status_code = 200
        mock_image_response.url = "https://image.pollinations.ai/test"
        mock_get.return_value = mock_image_response
        
        # Mock text response
        mock_text_response = MagicMock()
        mock_text_response.status_code = 200
        mock_text_response.json.return_value = {
            "choices": [{"message": {"content": "Generated text"}}]
        }
        mock_post.return_value = mock_text_response
        
        payload = {
            "requests": [
                {
                    "type": "image",
                    "prompt": "A cat",
                    "model": "flux"
                },
                {
                    "type": "text",
                    "prompt": "Write a poem",
                    "model": "static"
                }
            ]
        }
        
        response = client.post("/api/batch", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert len(data["results"]) == 2
    
    def test_batch_empty_requests(self):
        """Test batch processing with empty requests"""
        payload = {"requests": []}
        
        response = client.post("/api/batch", json=payload)
        assert response.status_code == 422

class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limit_structure(self):
        """Test that rate limiting doesn't break normal requests"""
        # Make a normal request first
        payload = {
            "prompt": "Test prompt",
            "model": "static"
        }
        
        response = client.post("/api/generate/text", json=payload)
        assert response.status_code == 200
        
        # Check rate limit headers if present
        if "X-RateLimit-Remaining" in response.headers:
            remaining = int(response.headers["X-RateLimit-Remaining"])
            assert remaining >= 0

class TestErrorHandling:
    """Test error handling scenarios"""
    
    def test_invalid_json(self):
        """Test handling of invalid JSON"""
        response = client.post(
            "/api/generate/text",
            data="invalid json",
            headers={"content-type": "application/json"}
        )
        assert response.status_code == 422
    
    def test_unsupported_method(self):
        """Test unsupported HTTP methods"""
        response = client.delete("/api/generate/text")
        assert response.status_code == 405
    
    def test_nonexistent_endpoint(self):
        """Test accessing non-existent endpoints"""
        response = client.get("/api/nonexistent")
        assert response.status_code == 404

@pytest.fixture(autouse=True)
def clear_cache():
    """Clear cache before each test"""
    # Clear any caching if implemented
    yield
    # Cleanup after test

if __name__ == "__main__":
    pytest.main([__file__])