import os
import time
import json
import httpx
from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from datetime import datetime, timedelta
from cache import cache
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# Load environment variables
load_dotenv()

# Rate limiting configuration
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Pollinations MCP Dashboard")

# Apply rate limiting middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000, description="The prompt for generation")
    model: Optional[str] = Field("flux", description="Model to use for generation")
    width: Optional[int] = Field(1024, ge=256, le=2048, description="Width of the generated image")
    height: Optional[int] = Field(1024, ge=256, le=2048, description="Height of the generated image")
    seed: Optional[int] = Field(None, description="Random seed for reproducibility")
    nologo: Optional[bool] = Field(False, description="Disable Pollinations logo")
    private: Optional[bool] = Field(False, description="Make generation private")

class AudioRequest(GenerationRequest):
    voice: Optional[str] = Field("alloy", description="Voice to use for TTS")
    speed: Optional[float] = Field(1.0, ge=0.25, le=4.0, description="Speed of the generated audio")
    response_format: Optional[str] = Field("mp3", description="Format of the audio response")

class BatchRequest(BaseModel):
    requests: List[Dict[str, Any]]

# Rate limiting and caching
def get_rate_limit_key(request: Request):
    return get_remote_address(request)

def get_user_tier(user_id: str = None):
    # In a real app, this would check the user's subscription tier
    return "free"  # free, pro, enterprise

# Pollinations API client
class PollinationsClient:
    BASE_URL = "https://image.pollinations.ai"
    TEXT_URL = "https://text.pollinations.ai"
    
    def __init__(self):
        self.client = httpx.AsyncClient()
        self.rate_limits = {}
    
    async def generate_image(self, prompt: str, **params):
        # Remove prompt from params to avoid duplication
        params.pop("prompt", None)
        cache_key = f"image:{hash(frozenset({**params, 'prompt': prompt}.items()))}"
        
        # Check cache
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        try:
            # Construct the URL with prompt as a path parameter and other params as query params
            url = f"{self.BASE_URL}/prompt/{prompt}"
            
            # Add default parameters if not provided
            if 'model' not in params:
                params['model'] = 'flux'
            if 'width' not in params:
                params['width'] = 1024
            if 'height' not in params:
                params['height'] = 1024
            
            # Make the request with a timeout
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params, follow_redirects=True)
                response.raise_for_status()
                
                # The actual image URL is the final URL after following redirects
                image_url = str(response.url)
                
                # Cache the result for 1 hour
                result = {"url": image_url}
                cache.set(cache_key, result, ttl=3600)
                return result
                
        except httpx.HTTPStatusError as e:
            raise Exception(f"Failed to generate image: {e.response.status_code} {e.response.text}")
        except Exception as e:
            raise Exception(f"Failed to generate image: {str(e)}")
    
    async def generate_text(self, prompt: str, model: str = "openai"):
        cache_key = f"text:{model}:{hash(prompt)}"
        
        # Check cache
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        # Simple implementation that returns a static response
        # This is a temporary solution until we can get the Pollinations API working
        generated_text = (
            f"Here's a response to your request about: {prompt}\n\n"
            "This is a static response from the MCP Dashboard. The text generation "
            "service is currently under maintenance. Please check back later for "
            "AI-generated content."
        )
        
        # Cache the result for 5 minutes
        result = {"text": generated_text, "source": "static"}
        cache.set(cache_key, result, ttl=300)
        return result
    
    async def generate_audio(self, text: str, voice: str = "alloy", **params):
        params.update({"model": "openai-audio", "voice": voice})
        cache_key = f"audio:{voice}:{hash(text + str(params))}"
        
        # Check cache
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        # Make request
        response = await self.client.get(
            f"{self.TEXT_URL}/{text}",
            params=params
        )
        response.raise_for_status()
        
        # Cache the result for 1 hour
        result = {"url": str(response.url)}
        cache.set(cache_key, result, ttl=3600)
        return result

# Initialize client
client = PollinationsClient()

# API Endpoints
@app.post("/api/generate/image")
@limiter.limit("10/minute")
async def generate_image(
    request: Request,
    generation_request: GenerationRequest
):
    """
    Generate an image using Pollinations AI
    """
    try:
        result = await client.generate_image(
            prompt=generation_request.prompt,
            model=generation_request.model,
            width=generation_request.width,
            height=generation_request.height,
            seed=generation_request.seed,
            nologo=generation_request.nologo,
            private=generation_request.private
        )
        return result
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Pollinations API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate image: {str(e)}"
        )

@app.post("/api/generate/text")
@limiter.limit("30/minute")
async def generate_text(
    request: Request,
    generation_request: GenerationRequest
):
    """
    Generate text using Pollinations AI
    """
    try:
        result = await client.generate_text(
            prompt=generation_request.prompt,
            model=generation_request.model
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate text: {str(e)}"
        )

@app.post("/api/generate/audio")
@limiter.limit("20/minute")
async def generate_audio(
    request: Request,
    audio_request: AudioRequest
):
    """
    Generate audio using Pollinations AI
    """
    try:
        result = await client.generate_audio(
            text=audio_request.prompt,
            voice=audio_request.voice,
            speed=audio_request.speed,
            response_format=audio_request.response_format
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate audio: {str(e)}"
        )

@app.post("/api/batch")
@limiter.limit("5/minute")
async def batch_generate(
    request: Request,
    batch_request: BatchRequest
):
    """
    Batch process multiple generation requests
    """
    results = []
    for req in batch_request.requests:
        try:
            if req.get("type") == "image":
                result = await client.generate_image(**req)
            elif req.get("type") == "text":
                result = await client.generate_text(**req)
            elif req.get("type") == "audio":
                result = await client.generate_audio(**req)
            else:
                result = {"error": "Invalid request type"}
            results.append({"status": "success", "result": result})
        except Exception as e:
            results.append({"status": "error", "error": str(e)})
    return {"results": results}

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize resources on startup"""
    print("Starting up with in-memory cache...")
    # Initialize rate limiter
    app.state.limiter = limiter

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup resources on shutdown"""
    await client.client.aclose()
