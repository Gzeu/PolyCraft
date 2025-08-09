# 🤝 Contributing to PolyCraft MCP

First off, thank you for considering contributing to PolyCraft MCP! We're excited to have you on board. 🎉

## 📋 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Workflow](#-development-workflow)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Enhancements](#-suggesting-enhancements)
- [Code Style](#-code-style)
- [License](#-license)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/PolyCraft.git
   cd PolyCraft
   ```
3. **Set up** the development environment (see [Local Development](#-local-development))
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs
- Check if the bug has already been reported in [GitHub Issues](https://github.com/Gzeu/PolyCraft/issues)
- If not, create a new issue with a clear title and description
- Include steps to reproduce, expected vs actual behavior, and any relevant screenshots

### ✨ Suggesting Enhancements
- Check if the enhancement has already been suggested
- Create a new issue with a clear description of the feature
- Explain why this enhancement would be useful
- Include any mockups or examples if applicable

### 💻 Your First Code Contribution
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it
- Follow the development workflow below

## 🔄 Development Workflow

1. **Sync** your fork with the main repository
   ```bash
   git remote add upstream https://github.com/Gzeu/PolyCraft.git
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following the code style

4. **Run tests** to ensure nothing is broken
   ```bash
   # Run backend tests
   cd backend
   pytest
   
   # Run frontend tests
   cd ../frontend
   npm test
   ```

5. **Commit your changes** following the commit message guidelines

6. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to [Pull Requests](https://github.com/Gzeu/PolyCraft/pulls)
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Submit the PR

## ✏️ Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Example**:
```
feat(auth): add OAuth2 authentication

- Add Google OAuth2 provider
- Implement JWT token generation
- Add user profile endpoint

Closes #123
```

## 🔍 Code Style

### Frontend (React/TypeScript)
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with hooks
- Prefer TypeScript interfaces over types
- Use absolute imports when possible
- Keep components small and focused

### Backend (Python/FastAPI)
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use type hints for all function parameters and return values
- Keep functions small and focused
- Use async/await for I/O operations
- Write docstrings for all public functions and classes

## 📝 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for your interest in contributing to PolyCraft MCP! Your help is greatly appreciated. 🙏
