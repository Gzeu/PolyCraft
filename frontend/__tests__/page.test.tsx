import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/page'

// Mock the useGeneration hook
jest.mock('@/hooks/use-generation', () => ({
  useGeneration: () => ({
    generateContent: jest.fn(),
    isLoading: false,
    result: null,
    error: null,
    reset: jest.fn(),
  }),
}))

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByText('Craft the Future')
    expect(heading).toBeInTheDocument()
  })

  it('renders generation tabs', () => {
    render(<Home />)
    
    expect(screen.getByText('Image')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
    expect(screen.getByText('Audio')).toBeInTheDocument()
  })

  it('renders the prompt textarea', () => {
    render(<Home />)
    
    const textarea = screen.getByPlaceholderText(/Enter your.*generation prompt/)
    expect(textarea).toBeInTheDocument()
  })

  it('renders the generate button', () => {
    render(<Home />)
    
    const button = screen.getByRole('button', { name: /Generate Image/ })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled() // Should be disabled when prompt is empty
  })
})
