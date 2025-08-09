// Learn more about this file at: https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
import { loadEnvConfig } from '@next/env';
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Load environment variables
loadEnvConfig(process.cwd());

// Mock API responses
export const handlers = [
  // Health check
  rest.get('http://localhost:8000/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ status: 'healthy', timestamp: new Date().toISOString() })
    );
  }),
  
  // Image generation
  rest.post('http://localhost:8000/api/generate/image', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ url: 'https://example.com/generated-image.jpg' })
    );
  }),
  
  // Text generation
  rest.post('http://localhost:8000/api/generate/text', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ text: 'This is a generated text response.' })
    );
  }),
  
  // Audio generation
  rest.post('http://localhost:8000/api/generate/audio', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ url: 'https://example.com/generated-audio.mp3' })
    );
  }),
];

// Setup server for API mocking
export const server = setupServer(...handlers);

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during tests
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close());

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => Promise.resolve()),
    };
  },
}));

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({
      children,
    }: {
      children: Array<React.ReactElement>;
    }) => <>{children}</>,
  };
});
