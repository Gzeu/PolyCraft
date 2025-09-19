import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app

client = TestClient(app)

class TestHealthEndpoint:
    def test_health_check(self):
        """Test the health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data

class TestImageGeneration:
    def test_generate_image_success(self):
        """Test successful image generation."""
        with patch('main.client.generate_image') as mock_generate:
            mock_generate.return_value = {
                "url": "https://image.pollinations.ai/test-image.png"
            }
            
            response = client.post("/api/generate/image", json={
                "prompt": "A beautiful sunset",
                "model": "flux",
                "width": 1024,
                "height": 1024
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "url" in data
            assert data["url"].startswith("https://")
    
    def test_generate_image_invalid_prompt(self):
        """Test image generation with invalid prompt."""
        response = client.post("/api/generate/image", json={
            "prompt": "",  # Empty prompt
            "model": "flux"
        })
        
        assert response.status_code == 422  # Validation error
    
    def test_generate_image_invalid_dimensions(self):
        """Test image generation with invalid dimensions."""
        response = client.post("/api/generate/image", json={
            "prompt": "A beautiful sunset",
            "width": 100,  # Too small
            "height": 3000  # Too large
        })
        
        assert response.status_code == 422  # Validation error

class TestTextGeneration:
    def test_generate_text_success(self):
        """Test successful text generation."""
        with patch('main.client.generate_text') as mock_generate:
            mock_generate.return_value = {
                "text": "This is generated text",
                "source": "static"
            }
            
            response = client.post("/api/generate/text", json={
                "prompt": "Write a story about AI",
                "model": "openai"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "text" in data
            assert len(data["text"]) > 0
    
    def test_generate_text_empty_prompt(self):
        """Test text generation with empty prompt."""
        response = client.post("/api/generate/text", json={
            "prompt": ""
        })
        
        assert response.status_code == 422

class TestAudioGeneration:
    def test_generate_audio_success(self):
        """Test successful audio generation."""
        with patch('main.client.generate_audio') as mock_generate:
            mock_generate.return_value = {
                "url": "https://audio.pollinations.ai/test-audio.mp3"
            }
            
            response = client.post("/api/generate/audio", json={
                "prompt": "Hello world",
                "voice": "alloy",
                "speed": 1.0
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "url" in data
    
    def test_generate_audio_invalid_speed(self):
        """Test audio generation with invalid speed."""
        response = client.post("/api/generate/audio", json={
            "prompt": "Hello world",
            "speed": 10.0  # Too fast
        })
        
        assert response.status_code == 422

class TestBatchGeneration:
    def test_batch_generate_mixed(self):
        """Test batch generation with mixed request types."""
        with patch('main.client.generate_image') as mock_image, \
             patch('main.client.generate_text') as mock_text:
            
            mock_image.return_value = {"url": "https://test-image.png"}
            mock_text.return_value = {"text": "Generated text"}
            
            response = client.post("/api/batch", json={
                "requests": [
                    {
                        "type": "image",
                        "prompt": "A cat"
                    },
                    {
                        "type": "text",
                        "prompt": "Write a poem"
                    }
                ]
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "results" in data
            assert len(data["results"]) == 2

class TestRateLimiting:
    def test_rate_limiting(self):
        """Test that rate limiting is applied."""
        # Make multiple rapid requests to trigger rate limiting
        for _ in range(15):  # Exceed the 10/minute limit
            response = client.post("/api/generate/image", json={
                "prompt": "Test prompt"
            })
        
        # The last request should be rate limited
        assert response.status_code == 429

class TestErrorHandling:
    def test_invalid_json(self):
        """Test handling of invalid JSON."""
        response = client.post("/api/generate/image", 
                             data="invalid json",
                             headers={"Content-Type": "application/json"})
        assert response.status_code == 422
    
    def test_missing_required_fields(self):
        """Test handling of missing required fields."""
        response = client.post("/api/generate/image", json={})
        assert response.status_code == 422
        
    def test_internal_server_error(self):
        """Test handling of internal server errors."""
        with patch('main.client.generate_image') as mock_generate:
            mock_generate.side_effect = Exception("Internal error")
            
            response = client.post("/api/generate/image", json={
                "prompt": "Test prompt"
            })
            
            assert response.status_code == 500
            data = response.json()
            assert "detail" in data
