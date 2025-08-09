# Pollinations.AI Services Documentation

## Overview
Pollinations.AI provides a suite of AI-powered services for generating and processing various types of content. This document outlines the available services and how to integrate with them.

## Core Services

### 1. Image Generation Service
**Endpoint:** `https://image.pollinations.ai`

#### Features:
- Text-to-Image generation
- Image-to-Image transformation
- Multiple AI models (flux, kontext, gptimage)
- Customizable parameters (size, seed, style)

#### Example Usage:
```bash
# Basic image generation
curl -o output.jpg "https://image.pollinations.ai/prompt/A%20beautiful%20sunset"

# With parameters
curl -o output.jpg "https://image.pollinations.ai/prompt/A%20cat?width=1024&height=768&model=flux"
```

### 2. Text Generation Service
**Endpoint:** `https://text.pollinations.ai`

#### Features:
- Text completion
- Chat-like interactions
- Multiple AI models
- Streaming support

#### Example Usage:
```bash
# Basic text generation
curl "https://text.pollinations.ai/Explain%20quantum%20computing%20in%20simple%20terms"

# With model specification
curl "https://text.pollinations.ai/Write%20a%20poem%20about%20AI?model=gpt-4"
```

### 3. Audio Generation Service
**Endpoint:** `https://text.pollinations.ai` (with audio parameters)

#### Features:
- **Text-to-Speech (TTS)**: Convert text to natural-sounding speech
- **Multiple Voice Options**: Various voice profiles available
- **Speech-to-Text (STT)**: Transcribe audio to text
- **Model Support**: Uses `openai-audio` model

#### Text-to-Speech (TTS)

**Endpoint:** `GET https://text.pollinations.ai/{text}?model=openai-audio&voice={voice}`

**Parameters:**
| Parameter | Required | Description | Default |
|-----------|----------|-------------|---------|
| `model`   | Yes      | Must be `openai-audio` | - |
| `voice`   | No       | Voice to use (see below) | `alloy` |
| `speed`   | No       | Speed of speech (0.25x - 4.0x) | 1.0 |
| `response_format` | No | Output format (`mp3`, `opus`, `aac`, `flac`) | `mp3` |
| `seed`    | No       | Random seed for reproducible results | random |

**Available Voices:**
- `alloy`
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`

**Example Usage:**
```bash
# Basic TTS
curl "https://text.pollinations.ai/Hello%20world?model=openai-audio&voice=nova" > hello.mp3

# With additional parameters
curl "https://text.pollinations.ai/This%20is%20a%20test?model=openai-audio&voice=shimmer&speed=1.2&response_format=opus" > test.opus
```

#### Speech-to-Text (STT)

**Endpoint:** `POST https://text.pollinations.ai/transcribe`

**Parameters (JSON body):**
```json
{
  "model": "whisper-1",
  "file": "base64_encoded_audio",
  "language": "en"
}
```

**Example Usage (Python):**
```python
import base64
import requests

def transcribe_audio(audio_path):
    with open(audio_path, "rb") as audio_file:
        base64_audio = base64.b64encode(audio_file.read()).decode('utf-8')
    
    response = requests.post(
        "https://text.pollinations.ai/transcribe",
        json={
            "model": "whisper-1",
            "file": f"data:audio/mp3;base64,{base64_audio}",
            "language": "en"
        }
    )
    return response.json()

# Usage
transcription = transcribe_audio("recording.mp3")
print(transcription["text"])
```

#### Audio Processing Best Practices:
1. Keep audio files under 25MB for transcription
2. Use appropriate formats (MP3, WAV, M4A, etc.)
3. For long audio, consider chunking the input
4. Handle rate limits (1 request per 3 seconds for free tier)
5. Cache results when possible to reduce API calls

## Authentication

### API Keys
1. Visit [auth.pollinations.ai](https://auth.pollinations.ai)
2. Generate an API key
3. Use in requests as a query parameter: `?token=YOUR_API_KEY`

### Rate Limits
- Free tier: 1 concurrent request per 5 seconds (images), 1 per 3 seconds (text)
- Higher tiers available with increased limits

## Integration Options

### 1. Direct API Calls
Make HTTP requests directly to the endpoints shown above.

### 2. JavaScript/React
Use the official React hooks:
```javascript
import { useImagePollination } from '@pollinations/ai';

function MyComponent() {
  const { generate, result, isLoading } = useImagePollination();
  
  const handleGenerate = () => {
    generate({
      prompt: 'A beautiful landscape',
      model: 'flux',
      width: 1024,
      height: 768
    });
  };
  
  return (
    <div>
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
      {result && <img src={result} alt="Generated content" />}
    </div>
  );
}
```

### 3. Python Integration
```python
import requests

def generate_image(prompt, width=1024, height=1024, model="flux"):
    base_url = "https://image.pollinations.ai/prompt"
    params = {
        "prompt": prompt,
        "width": width,
        "height": height,
        "model": model
    }
    response = requests.get(f"{base_url}/{prompt}", params=params)
    return response.content

# Usage
image_data = generate_image("A futuristic city at night")
with open("city.png", "wb") as f:
    f.write(image_data)
```

## Best Practices
1. Always handle errors and timeouts
2. Cache results when possible
3. Respect rate limits
4. Use appropriate model sizes for your needs
5. Monitor your API usage

## Support
For additional help, visit the [GitHub repository](https://github.com/pollinations/pollinations) or join the [Discord community](https://discord.gg/pollinations).
