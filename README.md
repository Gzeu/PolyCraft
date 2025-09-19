# 🚀 PolyCraft

**Craft the Future with AI-Powered Multi-Modal Generation**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Gzeu/PolyCraft)

## 🌟 Quick Deploy

### Option 1: Vercel (Recommended)
1. Click the "Deploy with Vercel" button above
2. Set **Root Directory** to `frontend/`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
4. Deploy! 🚀

### Option 2: Docker (Local)
```bash
git clone https://github.com/Gzeu/PolyCraft.git
cd PolyCraft
docker-compose up --build

# Access at:
# Frontend: http://localhost:3005
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 📋 Table of Contents
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Docker Setup](#-docker-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

## 🌟 Features

**Craft the Future with AI-Powered Multi-Modal Generation**

### Core Capabilities
- **AI Content Mix & Match** - Seamlessly combine text, images, audio, and video generation
- **Smart Content Collections** - Organize and remix projects with AI-powered suggestions
- **Live Collaboration** - Real-time co-creation with team members and AI agents
- **AI Style Market** - Create, share, and apply custom AI styles across content types
- **Multi-Agent System** - Harness multiple AI agents working in parallel

### Technical Highlights
- 🚀 **Next.js 14+** with App Router
- ⚡ **FastAPI** backend with async support
- 🎨 **Tailwind CSS** with dark mode
- 🔄 **Real-time** collaboration features
- 🧩 **Modular** architecture for easy extension
- 🔐 **Optional Authentication** with API keys
- 📊 **Rate Limiting** and caching for performance

## 🌟 Features

- **Multi-Modal Generation**: Seamlessly generate text, images, and audio from a single platform
- **Text Crafting**: Create human-like text with advanced AI models
- **Image Forging**: Transform ideas into stunning visuals with customizable generation
- **Audio Synthesis**: Generate natural-sounding audio from text
- **Unified Dashboard**: Manage all your AI creations in one beautiful interface
- **Responsive Design**: Perfect experience across all devices
- **Modern Tech Stack**: 
  - Frontend: Next.js 14 with TypeScript and Tailwind CSS
  - Backend: FastAPI with Python 3.11+
  - State Management: React Query for efficient data fetching and caching
- **Developer Friendly**: 
  - Type-safe throughout the codebase
  - Comprehensive error handling
  - Easy setup with Docker and local development options
  - Optional API key authentication

## 🚀 Quick Start

**Note**: This project requires Node.js 18+ and Python 3.11+.

### Prerequisites

- Node.js 18+ (LTS recommended)
- Python 3.11+
- npm (comes with Node.js) or yarn
- Git

## 🛠 Installation

```bash
# Clone the repository
git clone https://github.com/Gzeu/PolyCraft.git
cd PolyCraft
```

### Project Structure

```
PolyCraft/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI application entry
│   ├── cache.py            # Caching implementation
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Backend dependencies
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js 14 App Router
│   ├── components/         # React components
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── docker/                 # Docker configurations
├── nginx/                  # Nginx configuration
├── docker-compose.yml      # Development compose
├── docker-compose.prod.yml # Production compose
└── README.md              # This file
```

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Gzeu/PolyCraft.git
   cd PolyCraft
   ```

2. **Set up environment variables**

   ```bash
   # Copy environment examples
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.local.example frontend/.env.local
   
   # Edit the files with your configuration
   ```

3. **Set up the backend**

   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

4. **Set up the frontend**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the development servers**

   In separate terminal windows:

   **Backend server** (from backend directory):

   ```bash
   uvicorn main:app --reload --port 8000
   ```

   **Frontend server** (from frontend directory):

   ```bash
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:3005
   - Backend API: http://localhost:8000
   - API documentation (Swagger UI): http://localhost:8000/docs

## Environment Variables

### Backend Configuration

Configure `backend/.env`:

```bash
# Optional API key authentication
BACKEND_API_KEY=your_secret_key_here_or_leave_empty

# Server settings
PORT=8000
HOST=0.0.0.0

# Rate limits (requests per minute)
RATE_LIMIT_IMAGE=10
RATE_LIMIT_TEXT=30
RATE_LIMIT_AUDIO=20
```

### Frontend Configuration

Configure `frontend/.env.local`:

```bash
# API connection
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3005

# Optional API key (if backend requires authentication)
# NEXT_PUBLIC_API_KEY=your_api_key_here
```

## API Documentation

### Authentication

If `BACKEND_API_KEY` is set in the backend environment, all `/api/*` endpoints require authentication:

```bash
Authorization: Bearer YOUR_API_KEY
```

If no API key is configured, the API allows open access (development mode).

### Endpoints

#### Health Check

```http
GET /health
GET /api/health
```

Returns API health status.

#### Image Generation

```http
POST /api/generate/image
```

**Request Body:**

```json
{
  "prompt": "A beautiful sunset over mountains",
  "model": "flux",
  "width": 1024,
  "height": 1024,
  "seed": 42,
  "nologo": true,
  "private": false
}
```

**Response:**

```json
{
  "url": "https://image.pollinations.ai/prompt/..."
}
```

#### Text Generation

```http
POST /api/generate/text
```

**Request Body:**

```json
{
  "prompt": "Tell me about artificial intelligence",
  "model": "openai"
}
```

**Response:**

```json
{
  "text": "Artificial intelligence (AI) is...",
  "source": "static"
}
```

#### Audio Generation

```http
POST /api/generate/audio
```

**Request Body:**

```json
{
  "prompt": "Hello world",
  "voice": "alloy",
  "speed": 1.0,
  "response_format": "mp3"
}
```

#### Batch Processing

```http
POST /api/batch
```

**Request Body:**

```json
{
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
}
```

### Error Responses

|Status Code|Description|
|--|--|
|400|Bad Request - Invalid input|
|401|Unauthorized - Invalid or missing API key|
|422|Validation Error - Invalid request format|
|429|Too Many Requests - Rate limit exceeded|
|500|Internal Server Error - Something went wrong|

## 🐳 Docker Setup

### Quick Start with Docker Compose

Get everything up and running with a single command:

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build -d
```

Your application will be available at:

- Frontend: http://localhost:3005
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🧪 Testing

Run the test suites to ensure everything works as expected:

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd ../frontend
npm test
```

## 🛠 Development Workflow

1. **Create a new feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**

   - Follow the code style guidelines
   - Write tests for new features
   - Update documentation as needed

3. **Run tests**

   ```bash
   # Backend tests
   cd backend
   pytest

   # Frontend tests
   cd ../frontend
   npm test
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

   - Describe your changes
   - Reference any related issues
   - Request reviews from team members

## 🚀 Deployment

### Vercel (Frontend) - Recommended

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Gzeu/PolyCraft)

1. Click the deploy button above or:
2. Push your code to a GitHub repository
3. Import the project in Vercel
4. Set the root directory to `frontend/`
5. Set environment variables:

   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

6. Deploy!

### Backend Deployment

The backend can be deployed to any cloud provider that supports Python applications:

- **Railway** (Recommended)
- **Render**
- **AWS Elastic Beanstalk**
- **Google Cloud Run**
- **Azure App Service**
- **Heroku**
- **Or any VPS with Docker support**

**Example Docker deployment:**

```bash
# Build and run backend
cd backend
docker build -t polycraft-backend .
docker run -p 8000:8000 -e BACKEND_API_KEY=your_key polycraft-backend
```

📖 **Detailed Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Report bugs** - Open an issue with detailed reproduction steps
2. **Suggest features** - Share your ideas for new features
3. **Fix issues** - Pick an open issue and submit a pull request
4. **Improve documentation** - Help us make the docs better

### Development Setup

1. **Fork** the repository
2. **Clone** your fork

   ```bash
   git clone https://github.com/your-username/PolyCraft.git
   cd PolyCraft
   ```

3. **Create a branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
5. **Run tests**
6. **Commit your changes**
7. **Push to your fork**
8. **Open a Pull Request**

### Code Style

- **Python**: Follow PEP 8
- **JavaScript/TypeScript**: Follow Airbnb Style Guide
- **Git**: Write conventional commits

### Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code changes that don't fix bugs or add features
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

A huge thank you to all the amazing projects and people that made this possible:

- **Pollinations AI** - For their incredible AI services
- **Next.js** - The React Framework for Production
- **FastAPI** - Modern, fast web framework for building APIs
- **Tailwind CSS** - A utility-first CSS framework
- **React Query** - Powerful data synchronization
- **shadcn/ui** - Beautifully designed components
- **TypeScript** - Typed JavaScript
- **Docker** - Containerization platform
- **Vercel** - For amazing hosting

And to all our wonderful contributors who have helped make this project better! 🎉

---

**Made with ❤️ by the PolyCraft Team**

**Live Demo**: [poly-craft.vercel.app](https://poly-craft.vercel.app)

**Repository**: [github.com/Gzeu/PolyCraft](https://github.com/Gzeu/PolyCraft)