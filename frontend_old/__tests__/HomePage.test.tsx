import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { server } from './setup';
import Home from '../pages/index';
import { rest } from 'msw';

// Mock the API module
jest.mock('../lib/api', () => ({
  generateImage: jest.fn().mockResolvedValue({ 
    data: { url: 'https://example.com/generated-image.jpg' } 
  }),
  generateText: jest.fn().mockResolvedValue({ 
    data: { text: 'This is a generated text response.' } 
  }),
  generateAudio: jest.fn().mockResolvedValue({ 
    data: { url: 'https://example.com/generated-audio.mp3' } 
  }),
  checkHealth: jest.fn().mockResolvedValue(true),
}));

describe('Home Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Pollinations MCP Dashboard');
  });

  it('has tabs for different generation types', () => {
    render(<Home />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveTextContent('Text');
    expect(tabs[1]).toHaveTextContent('Image');
    expect(tabs[2]).toHaveTextContent('Audio');
  });

  it('generates text when the generate button is clicked', async () => {
    render(<Home />);
    
    // Find the textarea and button
    const textarea = screen.getByPlaceholderText('Enter your prompt...');
    const generateButton = screen.getByRole('button', { name: /generate text/i });
    
    // Enter text and click generate
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(generateButton);
    
    // Check if loading state is shown
    expect(screen.getByRole('button', { name: /generating/i })).toBeInTheDocument();
    
    // Wait for the generation to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate text/i })).toBeInTheDocument();
    });
    
    // Check if the result is displayed
    expect(screen.getByText('This is a generated text response.')).toBeInTheDocument();
  });

  it('shows an error message when generation fails', async () => {
    // Mock a failed API response
    server.use(
      rest.post('http://localhost:8000/api/generate/text', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ detail: 'Failed to generate text' })
        );
      })
    );
    
    render(<Home />);
    
    // Find the textarea and button
    const textarea = screen.getByPlaceholderText('Enter your prompt...');
    const generateButton = screen.getByRole('button', { name: /generate text/i });
    
    // Enter text and click generate
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(generateButton);
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/failed to generate text/i)).toBeInTheDocument();
    });
  });

  it('switches between tabs correctly', () => {
    render(<Home />);
    
    // Initially, text generation should be visible
    expect(screen.getByText('Text Generation')).toBeInTheDocument();
    
    // Click on the Image tab
    const imageTab = screen.getByRole('tab', { name: /image/i });
    fireEvent.click(imageTab);
    
    // Now image generation should be visible
    expect(screen.getByText('Image Generation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate image/i })).toBeInTheDocument();
    
    // Click on the Audio tab
    const audioTab = screen.getByRole('tab', { name: /audio/i });
    fireEvent.click(audioTab);
    
    // Now audio generation should be visible
    expect(screen.getByText('Audio Generation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate audio/i })).toBeInTheDocument();
  });

  it('displays a loading state while generating', async () => {
    // Mock a slow API response
    server.use(
      rest.post('http://localhost:8000/api/generate/text', (req, res, ctx) => {
        return new Promise((resolve) => 
          setTimeout(() => 
            resolve(ctx.json({ text: 'Delayed response' })), 
            1000
          )
        );
      })
    );
    
    render(<Home />);
    
    const textarea = screen.getByPlaceholderText('Enter your prompt...');
    const generateButton = screen.getByRole('button', { name: /generate text/i });
    
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(generateButton);
    
    // Button should show loading state
    expect(screen.getByRole('button', { name: /generating/i })).toBeInTheDocument();
    
    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate text/i })).toBeInTheDocument();
    });
  });
});
