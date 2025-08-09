<div align="center">

<div align="center">

# 🚀 PolyCraft

**Craft the Future with AI-Powered Multi-Modal Generation**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Gzeu/PolyCraft?style=social)](https://github.com/Gzeu/PolyCraft/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Gzeu/PolyCraft?style=social)](https://github.com/Gzeu/PolyCraft/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Gzeu/PolyCraft)](https://github.com/Gzeu/PolyCraft/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Gzeu/PolyCraft/pulls)

[![Next.js](https://img.shields.io/badge/Next.js-13.4+-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

## 📝 Table of Contents
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Docker Setup](#-docker-setup)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

## 🌟 Features

**Craft the Future with AI-Powered Multi-Modal Generation**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.4+-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

![PolyCraft Dashboard](https://via.placeholder.com/1200x600/1a202c/ffffff?text=PolyCraft+AI+Platform)

</div>

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

## 🚀 Quick Start

> **Note**: This project requires Node.js 18+ and Python 3.11+.

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
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   ├── tests/        # Backend tests
│   └── main.py       # FastAPI application entry
├── frontend/         # Next.js frontend
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── docker/           # Docker configurations
└── README.md         # This file
```

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mcp-dashboard.git
   cd windsurf-project
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   # source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create `.env` file in the backend directory:
   ```env
   # Backend .env
   NODE_ENV=development
   ```
   
   Create `.env.local` file in the frontend directory:
   ```env
   # Frontend .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

5. **Start the development servers**
   
   In separate terminal windows:
   
   Backend server (from backend directory):
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   
   Frontend server (from frontend directory):
   ```bash
   npm run dev
   ```
   
   The application will be available at http://localhost:3005
   
   API documentation (Swagger UI) is available at http://localhost:8000/docs

## 🐳 Docker Setup

### Quick Start with Docker Compose

Get everything up and running with a single command:

```bash
docker-compose -f docker-compose.dev.yml up --build
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

### Development with Docker Compose

1. **Start the services**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3005
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Production Deployment

1. **Build and start the production containers**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```
   
2. **View logs**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

## 📚 API Reference

### Authentication
All endpoints require authentication. Include your API key in the `Authorization` header.

```http
Authorization: Bearer YOUR_API_KEY
```

### Endpoints

#### Image Generation
```http
POST /api/generate/image
```

**Request Body**
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

**Response**
```json
{
  "url": "https://image.pollinations.ai/prompt/..."
}
```

#### Text Generation
```http
POST /api/generate/text
```

**Request Body**
```json
{
  "prompt": "Tell me about artificial intelligence",
  "model": "gpt-3.5-turbo"
}
```

**Response**
```json
{
  "text": "Artificial intelligence (AI) is..."
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid API key |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Something went wrong |

### Image Generation
- `POST /api/generate/image` - Generate an image from text prompt
  - Parameters: `prompt`, `model`, `width`, `height`, `seed`, `nologo`, `private`

### Text Generation
- `POST /api/generate/text` - Generate text using AI models
  - Parameters: `prompt`, `model`

### System Status
- `GET /api/health` - Check API health status

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fwindsurf-project&env=NEXT_PUBLIC_API_URL&envDescription=API%20URL%20for%20the%20backend%20service&envLink=https%3A%2F%2Fgithub.com%2Fyourusername%2Fwindsurf-project%2Fblob%2Fmain%2FREADME.md%23environment-variables)

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the following environment variables:
   ```
   NEXT_PUBLIC_API_URL=your-backend-url
   ```
4. Deploy!

### Self-Hosted

1. **Build the Docker images**
   ```bash
   # Build frontend
   cd frontend
   docker build -t windsurf-frontend .
   
   # Build backend
   cd ../backend
   docker build -t windsurf-backend .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Set up a reverse proxy** (Nginx example)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3005;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api/ {
           proxy_pass http://localhost:8000/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
       }
   }
   ```

### Vercel (Frontend)

1. Push your code to a GitHub/GitLab repository
2. Import the project in Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=your-backend-url
   ```
4. Deploy!

### Backend (Cloud Providers)

The backend can be deployed to any cloud provider that supports Python applications:
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- Heroku
- Or any VPS with Docker support

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
   git clone https://github.com/your-username/windsurf-project.git
   cd windsurf-project
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Run tests**
   ```bash
   # Backend tests
   cd backend
   pytest
   
   # Frontend tests
   cd ../frontend
   npm test
   ```
6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Style

- **Python**: Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- **JavaScript/TypeScript**: Follow [Airbnb Style Guide](https://github.com/airbnb/javascript)
- **Git**: Write [conventional commits](https://www.conventionalcommits.org/)

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

A huge thank you to all the amazing projects and people that made this possible:

- [Pollinations AI](https://pollinations.ai/) - For their incredible AI services
- [Next.js](https://nextjs.org/) - The React Framework for Production
- [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework for building APIs
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [React Query](https://tanstack.com/query) - Powerful data synchronization
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Docker](https://www.docker.com/) - Containerization platform
- [Vercel](https://vercel.com/) - For amazing hosting

And to all our wonderful contributors who have helped make this project better! 🎉

---

<div align="center">
  Made with ❤️ by the MCP Team
</div>
