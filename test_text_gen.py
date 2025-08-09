import requests
import json

def test_text_generation():
    url = "http://localhost:8000/api/generate/text"
    headers = {"Content-Type": "application/json"}
    data = {"prompt": "Tell me a short story about a robot learning to paint"}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print("Response:", json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_text_generation()
