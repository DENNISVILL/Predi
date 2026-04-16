// Predix Functional Tests - Cypress E2E
// QA Tester: Senior QA Engineer
// Coverage: Critical User Flows

describe('Predix Platform - Functional Testing Suite', () => {
  
  beforeEach(() => {
    cy.visit('/')
    cy.viewport(1920, 1080)
  })

  describe('🔐 Authentication Flow', () => {
    
    it('Should display landing page correctly', () => {
      cy.get('[data-testid="landing-hero"]').should('be.visible')
      cy.get('[data-testid="cta-button"]').should('contain', 'Comenzar')
      cy.title().should('contain', 'Predix')
    })

    it('Should navigate to login page', () => {
      cy.get('[data-testid="login-button"]').click()
      cy.url().should('include', '/login')
      cy.get('[data-testid="login-form"]').should('be.visible')
    })

    it('Should validate login form inputs', () => {
      cy.visit('/login')
      
      // Test empty form submission
      cy.get('[data-testid="login-submit"]').click()
      cy.get('[data-testid="email-error"]').should('contain', 'requerido')
      cy.get('[data-testid="password-error"]').should('contain', 'requerido')
      
      // Test invalid email format
      cy.get('[data-testid="email-input"]').type('invalid-email')
      cy.get('[data-testid="login-submit"]').click()
      cy.get('[data-testid="email-error"]').should('contain', 'válido')
      
      // Test password length validation
      cy.get('[data-testid="email-input"]').clear().type('test@predix.com')
      cy.get('[data-testid="password-input"]').type('123')
      cy.get('[data-testid="login-submit"]').click()
      cy.get('[data-testid="password-error"]').should('contain', 'mínimo')
    })

    it('Should perform successful login', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('qa.tester@predix.com')
      cy.get('[data-testid="password-input"]').type('QATest123!')
      cy.get('[data-testid="login-submit"]').click()
      
      cy.url().should('include', '/dashboard')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      cy.get('[data-testid="welcome-message"]').should('contain', 'Bienvenido')
    })

    it('Should handle login errors gracefully', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('wrong@email.com')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-submit"]').click()
      
      cy.get('[data-testid="error-message"]').should('be.visible')
      cy.get('[data-testid="error-message"]').should('contain', 'Credenciales')
    })

    it('Should register new user successfully', () => {
      cy.visit('/register')
      
      const timestamp = Date.now()
      const testEmail = `qa.test.${timestamp}@predix.com`
      
      cy.get('[data-testid="name-input"]').type('QA Test User')
      cy.get('[data-testid="email-input"]').type(testEmail)
      cy.get('[data-testid="password-input"]').type('QATest123!')
      cy.get('[data-testid="confirm-password-input"]').type('QATest123!')
      cy.get('[data-testid="terms-checkbox"]').check()
      cy.get('[data-testid="register-submit"]').click()
      
      cy.get('[data-testid="success-message"]').should('be.visible')
      cy.url().should('include', '/verify-email')
    })
  })

  describe('📊 Dashboard Functionality', () => {
    
    beforeEach(() => {
      // Login before each dashboard test
      cy.login('qa.tester@predix.com', 'QATest123!')
    })

    it('Should load dashboard with all components', () => {
      cy.get('[data-testid="dashboard-header"]').should('be.visible')
      cy.get('[data-testid="metrics-cards"]').should('have.length.at.least', 4)
      cy.get('[data-testid="trends-chart"]').should('be.visible')
      cy.get('[data-testid="recent-predictions"]').should('be.visible')
    })

    it('Should display real-time metrics', () => {
      cy.get('[data-testid="metric-predictions"]').should('contain.text', /\d+/)
      cy.get('[data-testid="metric-accuracy"]').should('contain.text', '%')
      cy.get('[data-testid="metric-users"]').should('contain.text', /\d+/)
      cy.get('[data-testid="metric-revenue"]').should('contain.text', '$')
    })

    it('Should update charts dynamically', () => {
      cy.get('[data-testid="chart-timeframe"]').select('7d')
      cy.get('[data-testid="trends-chart"]').should('be.visible')
      
      cy.get('[data-testid="chart-timeframe"]').select('30d')
      cy.wait(1000) // Wait for chart update
      cy.get('[data-testid="trends-chart"]').should('be.visible')
    })

    it('Should navigate between modules', () => {
      // Test AI Predictions module
      cy.get('[data-testid="nav-predictions"]').click()
      cy.url().should('include', '/predictions')
      cy.get('[data-testid="predictions-container"]').should('be.visible')
      
      // Test Analytics module
      cy.get('[data-testid="nav-analytics"]').click()
      cy.url().should('include', '/analytics')
      cy.get('[data-testid="analytics-container"]').should('be.visible')
      
      // Test Alerts module
      cy.get('[data-testid="nav-alerts"]').click()
      cy.url().should('include', '/alerts')
      cy.get('[data-testid="alerts-container"]').should('be.visible')
    })
  })

  describe('🤖 AI Predictions Module', () => {
    
    beforeEach(() => {
      cy.login('qa.tester@predix.com', 'QATest123!')
      cy.visit('/predictions')
    })

    it('Should create new prediction request', () => {
      cy.get('[data-testid="new-prediction-btn"]').click()
      cy.get('[data-testid="prediction-modal"]').should('be.visible')
      
      cy.get('[data-testid="content-input"]').type('Testing viral content prediction')
      cy.get('[data-testid="platform-select"]').select('TikTok')
      cy.get('[data-testid="category-select"]').select('Entertainment')
      cy.get('[data-testid="submit-prediction"]').click()
      
      cy.get('[data-testid="success-notification"]').should('be.visible')
      cy.get('[data-testid="prediction-list"]').should('contain', 'Testing viral content')
    })

    it('Should display prediction results', () => {
      cy.get('[data-testid="prediction-item"]').first().click()
      cy.get('[data-testid="prediction-details"]').should('be.visible')
      
      cy.get('[data-testid="viral-score"]').should('contain.text', /\d+/)
      cy.get('[data-testid="confidence-level"]').should('contain.text', '%')
      cy.get('[data-testid="prediction-factors"]').should('be.visible')
    })

    it('Should filter predictions by status', () => {
      cy.get('[data-testid="filter-status"]').select('completed')
      cy.get('[data-testid="prediction-item"]').should('have.length.at.least', 1)
      
      cy.get('[data-testid="filter-status"]').select('pending')
      cy.get('[data-testid="prediction-item"]').each($el => {
        cy.wrap($el).should('contain', 'Procesando')
      })
    })

    it('Should export prediction data', () => {
      cy.get('[data-testid="export-btn"]').click()
      cy.get('[data-testid="export-format"]').select('CSV')
      cy.get('[data-testid="confirm-export"]').click()
      
      cy.get('[data-testid="download-link"]').should('be.visible')
    })
  })

  describe('📈 Analytics Dashboard', () => {
    
    beforeEach(() => {
      cy.login('qa.tester@predix.com', 'QATest123!')
      cy.visit('/analytics')
    })

    it('Should load analytics charts', () => {
      cy.get('[data-testid="performance-chart"]').should('be.visible')
      cy.get('[data-testid="trends-chart"]').should('be.visible')
      cy.get('[data-testid="platform-distribution"]').should('be.visible')
    })

    it('Should filter data by date range', () => {
      cy.get('[data-testid="date-picker-start"]').type('2024-01-01')
      cy.get('[data-testid="date-picker-end"]').type('2024-12-31')
      cy.get('[data-testid="apply-filter"]').click()
      
      cy.get('[data-testid="chart-loading"]').should('not.exist')
      cy.get('[data-testid="performance-chart"]').should('be.visible')
    })

    it('Should display KPI metrics', () => {
      cy.get('[data-testid="kpi-accuracy"]').should('contain.text', '%')
      cy.get('[data-testid="kpi-predictions"]').should('contain.text', /\d+/)
      cy.get('[data-testid="kpi-success-rate"]').should('contain.text', '%')
    })
  })

  describe('🔔 Alerts System', () => {
    
    beforeEach(() => {
      cy.login('qa.tester@predix.com', 'QATest123!')
      cy.visit('/alerts')
    })

    it('Should create new alert', () => {
      cy.get('[data-testid="create-alert-btn"]').click()
      cy.get('[data-testid="alert-modal"]').should('be.visible')
      
      cy.get('[data-testid="alert-name"]').type('QA Test Alert')
      cy.get('[data-testid="alert-condition"]').select('viral_score')
      cy.get('[data-testid="alert-threshold"]').type('85')
      cy.get('[data-testid="alert-notification"]').select('email')
      cy.get('[data-testid="save-alert"]').click()
      
      cy.get('[data-testid="success-message"]').should('be.visible')
      cy.get('[data-testid="alerts-list"]').should('contain', 'QA Test Alert')
    })

    it('Should manage alert notifications', () => {
      cy.get('[data-testid="notification-item"]').first().click()
      cy.get('[data-testid="notification-details"]').should('be.visible')
      
      cy.get('[data-testid="mark-read-btn"]').click()
      cy.get('[data-testid="notification-status"]').should('contain', 'Leída')
    })
  })

  describe('👤 User Profile Management', () => {
    
    beforeEach(() => {
      cy.login('qa.tester@predix.com', 'QATest123!')
      cy.visit('/profile')
    })

    it('Should update user profile', () => {
      cy.get('[data-testid="edit-profile-btn"]').click()
      
      cy.get('[data-testid="name-input"]').clear().type('QA Updated Name')
      cy.get('[data-testid="bio-input"]').type('Updated bio for QA testing')
      cy.get('[data-testid="save-profile"]').click()
      
      cy.get('[data-testid="success-message"]').should('be.visible')
      cy.get('[data-testid="profile-name"]').should('contain', 'QA Updated Name')
    })

    it('Should change password', () => {
      cy.get('[data-testid="change-password-btn"]').click()
      
      cy.get('[data-testid="current-password"]').type('QATest123!')
      cy.get('[data-testid="new-password"]').type('NewQATest123!')
      cy.get('[data-testid="confirm-new-password"]').type('NewQATest123!')
      cy.get('[data-testid="update-password"]').click()
      
      cy.get('[data-testid="success-message"]').should('be.visible')
    })

    it('Should manage API keys', () => {
      cy.get('[data-testid="api-keys-tab"]').click()
      cy.get('[data-testid="generate-key-btn"]').click()
      
      cy.get('[data-testid="key-name"]').type('QA Test Key')
      cy.get('[data-testid="key-permissions"]').select('read')
      cy.get('[data-testid="create-key"]').click()
      
      cy.get('[data-testid="api-key-value"]').should('be.visible')
      cy.get('[data-testid="copy-key-btn"]').click()
    })
  })

  describe('💳 Subscription Management', () => {
    
    beforeEach(() => {
      cy.login('qa.tester@predix.com', 'QATest123!')
      cy.visit('/subscription')
    })

    it('Should display current plan details', () => {
      cy.get('[data-testid="current-plan"]').should('be.visible')
      cy.get('[data-testid="plan-features"]').should('have.length.at.least', 3)
      cy.get('[data-testid="usage-metrics"]').should('be.visible')
    })

    it('Should upgrade subscription plan', () => {
      cy.get('[data-testid="upgrade-btn"]').click()
      cy.get('[data-testid="plans-modal"]').should('be.visible')
      
      cy.get('[data-testid="pro-plan"]').click()
      cy.get('[data-testid="confirm-upgrade"]').click()
      
      // Note: In QA environment, payment is mocked
      cy.get('[data-testid="payment-success"]').should('be.visible')
    })
  })

  describe('📱 Responsive Design', () => {
    
    const viewports = [
      { device: 'mobile', width: 375, height: 667 },
      { device: 'tablet', width: 768, height: 1024 },
      { device: 'desktop', width: 1920, height: 1080 }
    ]

    viewports.forEach(viewport => {
      it(`Should work correctly on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/')
        
        cy.get('[data-testid="landing-hero"]').should('be.visible')
        cy.get('[data-testid="navigation"]').should('be.visible')
        
        if (viewport.device === 'mobile') {
          cy.get('[data-testid="mobile-menu-btn"]').should('be.visible')
          cy.get('[data-testid="mobile-menu-btn"]').click()
          cy.get('[data-testid="mobile-menu"]').should('be.visible')
        }
      })
    })
  })

  describe('♿ Accessibility Testing', () => {
    
    it('Should meet WCAG 2.1 AA standards', () => {
      cy.visit('/')
      cy.injectAxe()
      cy.checkA11y()
    })

    it('Should support keyboard navigation', () => {
      cy.visit('/login')
      
      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-testid', 'email-input')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'data-testid', 'password-input')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'data-testid', 'login-submit')
    })

    it('Should have proper ARIA labels', () => {
      cy.visit('/dashboard')
      cy.login('qa.tester@predix.com', 'QATest123!')
      
      cy.get('[data-testid="metrics-cards"] [role="region"]').should('exist')
      cy.get('[data-testid="trends-chart"] [aria-label]').should('exist')
      cy.get('[data-testid="navigation"] [role="navigation"]').should('exist')
    })
  })

  describe('🔄 Error Handling', () => {
    
    it('Should handle network errors gracefully', () => {
      cy.intercept('GET', '/api/v1/predictions', { forceNetworkError: true })
      
      cy.login('qa.tester@predix.com', 'QATest123!')
      cy.visit('/predictions')
      
      cy.get('[data-testid="error-message"]').should('be.visible')
      cy.get('[data-testid="retry-btn"]').should('be.visible')
    })

    it('Should handle 404 errors', () => {
      cy.visit('/non-existent-page')
      cy.get('[data-testid="404-page"]').should('be.visible')
      cy.get('[data-testid="back-home-btn"]').should('be.visible')
    })

    it('Should handle session expiration', () => {
      cy.login('qa.tester@predix.com', 'QATest123!')
      
      // Mock expired token
      cy.intercept('GET', '/api/v1/user/profile', { statusCode: 401 })
      cy.visit('/profile')
      
      cy.url().should('include', '/login')
      cy.get('[data-testid="session-expired-message"]').should('be.visible')
    })
  })
})

// Custom Cypress Commands
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/v1/auth/login',
    body: { email, password }
  }).then(response => {
    window.localStorage.setItem('authToken', response.body.access_token)
  })
})

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('authToken')
  cy.visit('/login')
})
