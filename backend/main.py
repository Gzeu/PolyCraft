import os
import time
import json
import httpx
from fastapi import FastAPI, HTTPException, Depends, Request, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Dict, Any, Annotated
from dotenv import load_dotenv
from datetime import datetime, timedelta
from cache import cache
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import random

# Load environment variables
load_dotenv()

# Rate limiting configuration
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="PolyCraft API",
    description="AI-Powered Multi-Modal Generation Platform",
    version="1.0.0"
)

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

# Security
security = HTTPBearer(auto_error=False)
API_KEY = os.getenv("BACKEND_API_KEY")

# Authentication dependency
async def verify_api_key(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """
    Verify API key if BACKEND_API_KEY is configured.
    If no API key is set in environment, allow open access.
    """
    if not API_KEY:
        # No API key configured, allow open access
        return True
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if credentials.credentials != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return True

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
    AUDIO_URL = "https://text.pollinations.ai"
    
    # Text generation templates for better responses
    RESPONSE_TEMPLATES = {
        "story": [
            "Once upon a time, in a world where {prompt_topic}, there lived a character who would change everything. The adventure began when they discovered something extraordinary that would challenge their understanding of reality.",
            "In the depths of imagination, {prompt_topic} sparked a tale of wonder. The protagonist found themselves in a situation that would test their courage and reveal hidden truths about their world.",
            "The story unfolds in a realm where {prompt_topic} holds great significance. Our hero's journey begins with a simple decision that leads to extraordinary consequences."
        ],
        "explanation": [
            "Let me explain {prompt_topic} in a clear and comprehensive way. This concept involves several key aspects that work together to create a complete understanding.",
            "Understanding {prompt_topic} requires us to break it down into fundamental components. Here's a detailed exploration of how it works and why it matters.",
            "To grasp {prompt_topic}, we need to examine its core principles and practical applications. This explanation will guide you through the essential elements."
        ],
        "creative": [
            "Imagine a world where {prompt_topic} becomes the center of creativity and innovation. In this space, possibilities are endless and imagination knows no bounds.",
            "Creative expression through {prompt_topic} opens new doorways to artistic exploration. Here's how we can approach this topic with fresh perspective.",
            "The creative potential of {prompt_topic} invites us to think beyond conventional boundaries and explore uncharted territories of thought."
        ],
        "default": [
            "Regarding {prompt_topic}, there are many fascinating aspects to explore. This topic touches on various dimensions that interconnect in meaningful ways.",
            "When we consider {prompt_topic}, we open ourselves to a rich tapestry of ideas and possibilities that can inspire new ways of thinking.",
            "The subject of {prompt_topic} presents us with opportunities to delve deeper into understanding and discover new insights."
        ]
    }
    
    def __init__(self):
        self.client = httpx.AsyncClient()
        self.rate_limits = {}
    
    def _classify_prompt(self, prompt: str) -> str:
        """Classify the prompt to choose appropriate response template"""
        prompt_lower = prompt.lower()
        
        if any(word in prompt_lower for word in ['story', 'tale', 'narrative', 'once upon', 'character']):
            return 'story'
        elif any(word in prompt_lower for word in ['explain', 'how', 'what is', 'define', 'describe']):
            return 'explanation'
        elif any(word in prompt_lower for word in ['create', 'imagine', 'design', 'art', 'creative']):
            return 'creative'
        else:
            return 'default'
    
    def _extract_topic(self, prompt: str) -> str:
        """Extract the main topic from the prompt"""
        # Simple topic extraction - remove common words and take key terms
        stop_words = {'write', 'tell', 'explain', 'describe', 'create', 'about', 'the', 'a', 'an', 'and', 'or', 'but'}
        words = [word for word in prompt.lower().split() if word not in stop_words]
        return ' '.join(words[:3]) if words else 'this topic'
    
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
                result = {
                    "url": image_url,
                    "metadata": {
                        "model": params.get('model', 'flux'),
                        "dimensions": f"{params.get('width', 1024)}x{params.get('height', 1024)}",
                        "seed": params.get('seed'),
                        "timestamp": datetime.utcnow().isoformat()
                    }
                }
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
        
        # Enhanced text generation with better templates
        try:
            prompt_type = self._classify_prompt(prompt)
            topic = self._extract_topic(prompt)
            
            # Select a random template based on prompt classification
            templates = self.RESPONSE_TEMPLATES.get(prompt_type, self.RESPONSE_TEMPLATES['default'])
            template = random.choice(templates)
            
            # Generate response using template
            base_response = template.format(prompt_topic=topic)
            
            # Add additional context based on prompt type
            if prompt_type == 'story':
                additional = f"\n\nThe story continues as our protagonist faces challenges related to {topic}, learning valuable lessons along the way. Each step of their journey reveals new aspects of this fascinating world, leading to a conclusion that ties together all the elements introduced at the beginning."
            elif prompt_type == 'explanation':
                additional = f"\n\nIn practical terms, {topic} can be understood through several key examples and applications. The implications of this concept extend beyond its basic definition, influencing various fields and approaches to problem-solving."
            elif prompt_type == 'creative':
                additional = f"\n\nThe creative exploration of {topic} can take many forms, from artistic expression to innovative problem-solving. This versatility makes it a rich subject for further investigation and experimentation."
            else:
                additional = f"\n\nFurther exploration of {topic} reveals connections to broader themes and ideas that can enrich our understanding and provide new perspectives on related subjects."
            
            generated_text = base_response + additional
            
            # Cache the result for 5 minutes
            result = {
                "text": generated_text, 
                "source": "enhanced_template",
                "metadata": {
                    "prompt_type": prompt_type,
                    "model": model,
                    "timestamp": datetime.utcnow().isoformat(),
                    "word_count": len(generated_text.split())
                }
            }
            cache.set(cache_key, result, ttl=300)
            return result
            
        except Exception as e:
            # Fallback to simple response
            fallback_text = f"Here's a response about {topic}: This is an interesting topic that deserves thoughtful consideration. There are many aspects to explore and understand, each offering unique insights and perspectives."
            
            result = {
                "text": fallback_text,
                "source": "fallback",
                "metadata": {
                    "model": model,
                    "timestamp": datetime.utcnow().isoformat(),
                    "error": str(e)
                }
            }
            cache.set(cache_key, result, ttl=300)
            return result
    
    async def generate_audio(self, text: str, voice: str = "alloy", **params):
        cache_key = f"audio:{voice}:{hash(text + str(params))}"
        
        # Check cache
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        try:
            # Use Pollinations text-to-speech endpoint
            # Format: https://text.pollinations.ai/TextToSpeech?text=Hello&voice=alloy
            audio_params = {
                'text': text[:500],  # Limit text length for audio
                'voice': voice,
                'speed': params.get('speed', 1.0)
            }
            
            url = f"{self.AUDIO_URL}/TextToSpeech"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=audio_params, follow_redirects=True)
                response.raise_for_status()
                
                # The response should be the audio file URL or direct audio
                audio_url = str(response.url)
                
                result = {
                    "url": audio_url,
                    "metadata": {
                        "voice": voice,
                        "speed": params.get('speed', 1.0),
                        "format": params.get('response_format', 'mp3'),
                        "text_length": len(text),
                        "timestamp": datetime.utcnow().isoformat()
                    }
                }
                
                # Cache the result for 1 hour
                cache.set(cache_key, result, ttl=3600)
                return result
                
        except httpx.HTTPStatusError as e:
            # If Pollinations doesn't support TTS, provide a fallback
            fallback_result = {
                "url": f"data:text/plain;base64,{text}",  # Placeholder
                "error": "Audio generation temporarily unavailable",
                "metadata": {
                    "voice": voice,
                    "speed": params.get('speed', 1.0),
                    "timestamp": datetime.utcnow().isoformat(),
                    "note": "TTS service integration in progress"
                }
            }
            cache.set(cache_key, fallback_result, ttl=300)
            return fallback_result
            
        except Exception as e:
            raise Exception(f"Failed to generate audio: {str(e)}")

# Initialize client
client = PollinationsClient()

# Health check endpoints (both /health and /api/health for compatibility)
@app.get("/health")
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "services": {
            "image_generation": "operational",
            "text_generation": "operational", 
            "audio_generation": "operational"
        }
    }

# API Endpoints (protected by API key if configured)
@app.post("/api/generate/image")
@limiter.limit("10/minute")
async def generate_image(
    request: Request,
    generation_request: GenerationRequest,
    _: bool = Depends(verify_api_key)
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
    generation_request: GenerationRequest,
    _: bool = Depends(verify_api_key)
):
    """
    Generate text using enhanced templates
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
    audio_request: AudioRequest,
    _: bool = Depends(verify_api_key)
):
    """
    Generate audio using Pollinations TTS
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
    batch_request: BatchRequest,
    _: bool = Depends(verify_api_key)
):
    """
    Batch process multiple generation requests
    """
    results = []
    for req in batch_request.requests:
        try:
            if req.get("type") == "image":
                result = await client.generate_image(**{k: v for k, v in req.items() if k != "type"})
            elif req.get("type") == "text":
                result = await client.generate_text(**{k: v for k, v in req.items() if k != "type"})
            elif req.get("type") == "audio":
                result = await client.generate_audio(**{k: v for k, v in req.items() if k != "type"})
            else:
                result = {"error": "Invalid request type. Use 'image', 'text', or 'audio'"}
            results.append({"status": "success", "result": result})
        except Exception as e:
            results.append({"status": "error", "error": str(e)})
    return {"results": results}

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
    auth_status = "enabled" if API_KEY else "disabled"
    print(f"🚀 Starting PolyCraft API v1.0.0")
    print(f"🔐 Authentication: {auth_status}")
    print(f"🎨 Image generation: Pollinations AI (Flux)")
    print(f"📝 Text generation: Enhanced templates")
    print(f"🔊 Audio generation: Pollinations TTS")
    # Initialize rate limiter
    app.state.limiter = limiter

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup resources on shutdown"""
    await client.client.aclose()
    print("👋 PolyCraft API shutdown complete")