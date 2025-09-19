describe('PolyCraft App Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Homepage', () => {
    it('should load the homepage successfully', () => {
      cy.contains('PolyCraft').should('be.visible')
      cy.get('[data-testid="hero-section"]').should('exist')
    })

    it('should display navigation menu', () => {
      cy.get('nav').should('be.visible')
      cy.contains('Features').should('be.visible')
      cy.contains('About').should('be.visible')
    })

    it('should have working CTA buttons', () => {
      cy.get('[data-testid="cta-button"]').should('be.visible').and('not.be.disabled')
    })
  })

  describe('Text Generation', () => {
    it('should navigate to text generation page', () => {
      cy.get('[data-testid="text-generation-link"]').click()
      cy.url().should('include', '/text')
      cy.contains('Text Generation').should('be.visible')
    })

    it('should generate text with valid input', () => {
      cy.visit('/text')
      
      // Fill the prompt
      cy.get('[data-testid="text-prompt-input"]')
        .type('Write a short story about artificial intelligence')
      
      // Select model
      cy.get('[data-testid="model-select"]').select('static')
      
      // Submit form
      cy.get('[data-testid="generate-text-btn"]').click()
      
      // Check for loading state
      cy.get('[data-testid="loading-indicator"]').should('be.visible')
      
      // Check for result
      cy.get('[data-testid="generated-text"]', { timeout: 10000 })
        .should('be.visible')
        .and('not.be.empty')
    })

    it('should show validation error for empty prompt', () => {
      cy.visit('/text')
      cy.get('[data-testid="generate-text-btn"]').click()
      cy.get('[data-testid="error-message"]').should('contain', 'required')
    })
  })

  describe('Image Generation', () => {
    it('should navigate to image generation page', () => {
      cy.get('[data-testid="image-generation-link"]').click()
      cy.url().should('include', '/image')
      cy.contains('Image Generation').should('be.visible')
    })

    it('should generate image with valid input', () => {
      cy.visit('/image')
      
      // Fill the prompt
      cy.get('[data-testid="image-prompt-input"]')
        .type('A beautiful sunset over mountains')
      
      // Set dimensions
      cy.get('[data-testid="width-input"]').clear().type('1024')
      cy.get('[data-testid="height-input"]').clear().type('1024')
      
      // Submit form
      cy.get('[data-testid="generate-image-btn"]').click()
      
      // Check for loading state
      cy.get('[data-testid="loading-indicator"]').should('be.visible')
      
      // Check for result
      cy.get('[data-testid="generated-image"]', { timeout: 15000 })
        .should('be.visible')
        .and('have.attr', 'src')
        .and('not.be.empty')
    })

    it('should validate image dimensions', () => {
      cy.visit('/image')
      
      cy.get('[data-testid="image-prompt-input"]').type('Test image')
      cy.get('[data-testid="width-input"]').clear().type('50')
      cy.get('[data-testid="height-input"]').clear().type('50')
      
      cy.get('[data-testid="generate-image-btn"]').click()
      cy.get('[data-testid="error-message"]').should('contain', 'dimension')
    })
  })

  describe('Audio Generation', () => {
    it('should navigate to audio generation page', () => {
      cy.get('[data-testid="audio-generation-link"]').click()
      cy.url().should('include', '/audio')
      cy.contains('Audio Generation').should('be.visible')
    })

    it('should generate audio with valid input', () => {
      cy.visit('/audio')
      
      // Fill the prompt
      cy.get('[data-testid="audio-prompt-input"]')
        .type('Hello, this is a test message')
      
      // Select voice
      cy.get('[data-testid="voice-select"]').select('alloy')
      
      // Submit form
      cy.get('[data-testid="generate-audio-btn"]').click()
      
      // Check for loading state
      cy.get('[data-testid="loading-indicator"]').should('be.visible')
      
      // Check for audio player
      cy.get('[data-testid="audio-player"]', { timeout: 15000 })
        .should('be.visible')
    })
  })

  describe('Batch Processing', () => {
    it('should handle batch requests', () => {
      cy.visit('/batch')
      
      // Add text generation request
      cy.get('[data-testid="add-text-request"]').click()
      cy.get('[data-testid="batch-text-prompt-0"]').type('Generate a poem')
      
      // Add image generation request
      cy.get('[data-testid="add-image-request"]').click()
      cy.get('[data-testid="batch-image-prompt-1"]').type('A serene landscape')
      
      // Submit batch
      cy.get('[data-testid="submit-batch"]').click()
      
      // Check for results
      cy.get('[data-testid="batch-results"]', { timeout: 20000 })
        .should('be.visible')
      
      cy.get('[data-testid="batch-result-0"]').should('exist')
      cy.get('[data-testid="batch-result-1"]').should('exist')
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x')
      cy.visit('/')
      
      // Check mobile menu
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible').click()
      cy.get('[data-testid="mobile-menu"]').should('be.visible')
    })

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2')
      cy.visit('/')
      
      // Check that main content is properly sized
      cy.get('main').should('be.visible')
      cy.get('[data-testid="hero-section"]').should('be.visible')
    })
  })

  describe('Dark Mode', () => {
    it('should toggle dark mode', () => {
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('html').should('have.class', 'dark')
      
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('html').should('not.have.class', 'dark')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept API calls and simulate network error
      cy.intercept('POST', '**/api/generate/**', { forceNetworkError: true })
      
      cy.visit('/text')
      cy.get('[data-testid="text-prompt-input"]').type('Test prompt')
      cy.get('[data-testid="generate-text-btn"]').click()
      
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'error')
    })

    it('should handle API errors gracefully', () => {
      // Intercept API calls and return error
      cy.intercept('POST', '**/api/generate/**', {
        statusCode: 500,
        body: { detail: 'Internal server error' }
      })
      
      cy.visit('/text')
      cy.get('[data-testid="text-prompt-input"]').type('Test prompt')
      cy.get('[data-testid="generate-text-btn"]').click()
      
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'error')
    })
  })

  describe('Performance', () => {
    it('should load pages quickly', () => {
      const start = Date.now()
      cy.visit('/')
      cy.get('[data-testid="hero-section"]').should('be.visible').then(() => {
        const loadTime = Date.now() - start
        expect(loadTime).to.be.lessThan(3000) // Should load in under 3 seconds
      })
    })
  })
})