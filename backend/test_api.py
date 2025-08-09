import requests
import json

def test_image_generation():
    url = "http://127.0.0.1:8000/api/generate/image"
    data = {
        "prompt": "A beautiful sunset over mountains",
        "model": "flux",
        "width": 1024,
        "height": 1024
    }
    response = requests.post(url, json=data)
    assert response.status_code == 200
    result = response.json()
    assert "url" in result
    print("Image generation test passed!")

def test_text_generation():
    url = "http://127.0.0.1:8000/api/generate/text"
    data = {
        "prompt": "Write a short story about a magical forest"
    }
    response = requests.post(url, json=data)
    assert response.status_code == 200
    result = response.json()
    assert "text" in result
    print("Text generation test passed!")

def test_audio_generation():
    url = "http://127.0.0.1:8000/api/generate/audio"
    data = {
        "prompt": "Hello world"
    }
    response = requests.post(url, json=data)
    assert response.status_code == 200
    result = response.json()
    assert "url" in result
    print("Audio generation test passed!")

if __name__ == "__main__":
    print("Testing API endpoints...")
    try:
        test_image_generation()
        test_text_generation()
        test_audio_generation()
        print("\nAll tests passed successfully!")
    except Exception as e:
        print(f"\nTest failed: {str(e)}")
