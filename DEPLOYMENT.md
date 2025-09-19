# 🚀 PolyCraft Deployment Guide

## 🌐 Vercel Deployment (Frontend)

### Option 1: Quick Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Gzeu/PolyCraft)

### Option 2: Manual Deployment

#### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository `Gzeu/PolyCraft`
4. **Important**: Set **Root Directory** to `frontend/`

#### Step 2: Configure Build Settings
```bash
# Framework Preset: Next.js
# Root Directory: frontend/
# Build Command: npm run build
# Output Directory: .next (default)
# Install Command: npm install
```

#### Step 3: Environment Variables
Add these environment variables in Vercel dashboard:

```bash
# Required
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_URL=https://poly-craft.vercel.app

# Optional
NEXT_PUBLIC_API_KEY=your_api_key_if_needed
NEXT_PUBLIC_APP_NAME=PolyCraft
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### Step 4: Deploy
Click "Deploy" and wait for the build to complete!

---

## 🖥️ Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Connect Repository**:
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub
   - Select `Gzeu/PolyCraft` repository
   - Set **Root Directory** to `backend/`

2. **Configure Environment**:
   ```bash
   PORT=8000
   BACKEND_API_KEY=your_secure_api_key_here
   CORS_ORIGINS=https://poly-craft.vercel.app
   ```

3. **Deploy Command**:
   ```bash
   pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Option 2: Render

1. **Create Web Service**:
   - Go to [Render](https://render.com)
   - Connect GitHub repository
   - Root Directory: `backend/`

2. **Build Command**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start Command**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Option 3: Fly.io

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy**:
   ```bash
   cd backend
   fly launch
   fly deploy
   ```

### Option 4: Google Cloud Run

1. **Build Docker Image**:
   ```bash
   cd backend
   docker build -t gcr.io/YOUR_PROJECT/polycraft-backend .
   docker push gcr.io/YOUR_PROJECT/polycraft-backend
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy polycraft-backend \
     --image gcr.io/YOUR_PROJECT/polycraft-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

---

## 🔧 Production Configuration

### Frontend Environment Variables

```bash
# .env.local (for local development)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3005

# Vercel Environment Variables (production)
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=https://poly-craft.vercel.app
NEXT_PUBLIC_API_KEY=optional_api_key
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Backend Environment Variables

```bash
# Required
PORT=8000
HOST=0.0.0.0

# Optional Security
BACKEND_API_KEY=your_secure_random_key_here

# CORS Configuration
CORS_ORIGINS=https://poly-craft.vercel.app,https://your-custom-domain.com

# Rate Limiting
RATE_LIMIT_IMAGE=10
RATE_LIMIT_TEXT=30
RATE_LIMIT_AUDIO=20
RATE_LIMIT_BATCH=5

# Cache TTL (seconds)
CACHE_TTL_IMAGE=3600
CACHE_TTL_TEXT=300
CACHE_TTL_AUDIO=3600
```

---

## 🌍 Custom Domain Setup

### Frontend (Vercel)

1. **Add Custom Domain**:
   - Go to Project Settings → Domains
   - Add your domain (e.g., `polycraft.your-domain.com`)
   - Configure DNS records as instructed

2. **DNS Configuration**:
   ```
   Type: CNAME
   Name: polycraft (or @)
   Value: cname.vercel-dns.com
   ```

### Backend (Railway/Render)

1. **Railway**:
   - Go to Settings → Networking
   - Add custom domain
   - Configure DNS CNAME to railway domain

2. **Render**:
   - Go to Settings → Custom Domains
   - Add domain and follow DNS instructions

---

## 🔐 Security Best Practices

### 1. API Key Security
```bash
# Generate secure API key
openssl rand -hex 32

# Set in backend environment
BACKEND_API_KEY=your_generated_key_here

# Add to frontend environment (if needed)
NEXT_PUBLIC_API_KEY=same_key_here
```

### 2. CORS Configuration
```bash
# Production - specific domains only
CORS_ORIGINS=https://poly-craft.vercel.app,https://your-domain.com

# Development - allow localhost
CORS_ORIGINS=http://localhost:3005,https://poly-craft.vercel.app
```

### 3. Rate Limiting
Adjust rate limits based on your needs:
```bash
# Conservative (free tier)
RATE_LIMIT_IMAGE=5
RATE_LIMIT_TEXT=20
RATE_LIMIT_AUDIO=10

# Generous (paid tier)
RATE_LIMIT_IMAGE=20
RATE_LIMIT_TEXT=50
RATE_LIMIT_AUDIO=30
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. "API not found" errors
- Check `NEXT_PUBLIC_API_URL` is correctly set
- Ensure backend is deployed and accessible
- Verify CORS configuration allows your domain

#### 2. Build failures on Vercel
- Ensure Root Directory is set to `frontend/`
- Check all dependencies are in `package.json`
- Verify TypeScript compilation passes locally

#### 3. Backend deployment issues
- Check Python version compatibility (3.11+)
- Ensure all dependencies are in `requirements.txt`
- Verify port configuration (`$PORT` environment variable)

#### 4. CORS errors in production
```python
# Update backend/main.py CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://poly-craft.vercel.app", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Health Check Endpoints

Test your deployments:

```bash
# Frontend health
curl https://poly-craft.vercel.app

# Backend health
curl https://your-backend-url.com/health

# API functionality
curl -X POST https://your-backend-url.com/api/generate/text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello PolyCraft!"}'
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Optionally add Vercel Speed Insights

### Backend Monitoring
Add monitoring to your backend deployment:

```python
# Add to backend/main.py
import time
from fastapi import Request

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

---

## 🎯 Production Checklist

### Before Going Live:

- [ ] **Frontend deployed on Vercel**
- [ ] **Backend deployed on Railway/Render/etc**
- [ ] **Environment variables configured**
- [ ] **Custom domains set up (optional)**
- [ ] **CORS properly configured**
- [ ] **API key authentication enabled (recommended)**
- [ ] **Rate limiting configured**
- [ ] **Health checks working**
- [ ] **Error monitoring set up**
- [ ] **Analytics configured**
- [ ] **SSL certificates active**
- [ ] **Performance tested**

### After Deployment:

- [ ] **Test all generation types (Image/Text/Audio)**
- [ ] **Verify mobile responsiveness**
- [ ] **Check loading times**
- [ ] **Test error handling**
- [ ] **Verify rate limiting works**
- [ ] **Monitor for any issues**

---

## 🌟 Success!

Once deployed, your PolyCraft instance will be available at:
- **Frontend**: `https://poly-craft.vercel.app`
- **Backend**: `https://your-backend-domain.com`
- **API Docs**: `https://your-backend-domain.com/docs`

Congratulations! 🎉 You now have a fully functional AI-powered multi-modal generation platform running in production!

---

*For support, create an issue on [GitHub](https://github.com/Gzeu/PolyCraft/issues)*
