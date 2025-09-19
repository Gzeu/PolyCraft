# PolyCraft Frontend

Modern Next.js 14 frontend for the PolyCraft AI-powered multi-modal generation platform.

## 🚀 Features

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** with custom design system and dark mode
- **React Query** for efficient data management
- **Radix UI** components for accessibility
- **Framer Motion** animations
- **Responsive Design** for all devices
- **Multi-Modal Interface** for image, text, and audio generation
- **Real-time Generation** status and results
- **Modern UX** with loading states and error handling

## 🛠 Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

The application will be available at http://localhost:3005

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx          # Main dashboard page
│   └── globals.css       # Global styles and Tailwind
├── components/
│   ├── ui/               # Reusable UI components
│   ├── theme-provider.tsx # Theme management
│   ├── query-provider.tsx # React Query setup
│   └── *.tsx            # Feature components
├── hooks/                # Custom React hooks
│   ├── use-generation.ts # API generation hook
│   └── use-toast.ts     # Toast notifications
├── lib/                  # Utility functions
│   └── utils.ts         # Common utilities
├── types/               # TypeScript type definitions
│   └── index.ts        # Shared types
└── __tests__/          # Test files
```

## 🎨 Design System

### Colors

The app uses a sophisticated color system with CSS variables:

- `--primary`: Main brand color
- `--secondary`: Secondary accents
- `--background`: Page backgrounds
- `--foreground`: Text colors
- `--muted`: Subdued elements
- `--border`: Border colors

### Components

All UI components are built with:

- **Radix UI** primitives for accessibility
- **Tailwind CSS** for styling
- **Class Variance Authority** for component variants
- **TypeScript** for type safety

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Flexible grid layouts
- Touch-friendly interactions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Testing setup includes:

- **Jest** for test runner
- **React Testing Library** for component testing
- **@testing-library/user-event** for user interactions
- **@testing-library/jest-dom** for custom matchers

## 🏗 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🐳 Docker

```bash
# Build Docker image
docker build -t polycraft-frontend .

# Run container
docker run -p 3005:3005 polycraft-frontend
```

The Dockerfile uses multi-stage builds for optimization:

1. **Dependencies**: Install production dependencies
2. **Builder**: Build the application
3. **Runner**: Optimized production image

## 🔧 Configuration

### Next.js Config

- **Image domains**: Configured for Pollinations AI
- **API rewrites**: Proxy API calls to backend
- **Output**: Standalone for Docker deployment

### Tailwind Config

- **Dark mode**: Class-based theme switching
- **Custom animations**: Fade-in, slide-in effects
- **Design tokens**: Consistent spacing and colors

### TypeScript Config

- **Strict mode**: Enabled for better type safety
- **Path mapping**: `@/` alias for imports
- **JSX**: Preserve for Next.js

## 📱 Features

### Generation Interface

- **Tabbed Interface**: Switch between image, text, and audio generation
- **Parameter Controls**: Adjust model settings, dimensions, and options
- **Real-time Feedback**: Loading states and progress indicators
- **Result Display**: Preview generated content with actions

### User Experience

- **Theme Toggle**: Switch between light and dark themes
- **Responsive Layout**: Adapts to all screen sizes
- **Toast Notifications**: User feedback for actions
- **Error Handling**: Graceful error states and recovery

### Performance

- **React Query**: Efficient data fetching and caching
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Optimized bundle sizes

## 🤝 Contributing

When contributing to the frontend:

1. Follow the existing code style and conventions
2. Add TypeScript types for new components
3. Include tests for new features
4. Update documentation as needed
5. Ensure responsive design compatibility

### Code Style

- Use TypeScript for all new files
- Follow React functional component patterns
- Use custom hooks for reusable logic
- Prefer composition over inheritance
- Keep components small and focused

### Component Guidelines

- Use Radix UI primitives when possible
- Apply consistent styling with Tailwind
- Include proper accessibility attributes
- Add loading and error states
- Make components responsive by default

## 🔗 Integration

The frontend integrates with:

- **PolyCraft Backend**: FastAPI server for AI generation
- **Pollinations AI**: Direct image generation (cached by backend)
- **Vercel**: Recommended deployment platform
- **Docker**: Containerized deployment option

For more information, see the main project README and documentation.
