// ***********************************************
// Custom Cypress Commands
// Reusable commands for common test scenarios
// ***********************************************

// Login command
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for redirect or success indicator
    cy.url().should('not.include', '/login');
    cy.window().its('localStorage.token').should('exist');
});

// Login with 2FA
Cypress.Commands.add('loginWith2FA', (email, password, totpCode) => {
    cy.visit('/login');
    cy.get('input[name=email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for 2FA prompt
    cy.contains(/2FA|Two-Factor/i).should('be.visible');

    // Enter 2FA code
    cy.get('input[name="totp_code"]').type(totpCode);
    cy.get('button').contains(/Verify|Submit/i).click();

    // Wait for successful login
    cy.url().should('not.include', '/login');
});

// Logout command
Cypress.Commands.add('logout', () => {
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
});

// Register new user
Cypress.Commands.add('register', (email, username, password) => {
    cy.visit('/register');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for success
    cy.contains(/registered|success/i).should('be.visible');
});

// Setup 2FA
Cypress.Commands.add('setup2FA', () => {
    cy.visit('/settings/security');
    cy.contains('Enable 2FA').click();

    // Wait for QR code
    cy.get('[data-testid="qr-code"]').should('be.visible');

    // Get secret (for testing, we'll use a fixed code)
    cy.get('[data-testid="manual-code"]').invoke('text').as('secret');

    // Enter verification code (would need TOTP library in real scenario)
    cy.get('input[name="verification_code"]').type('123456');
    cy.contains('Verify').click();

    // Save backup codes
    cy.contains(/backup codes/i).should('be.visible');
    cy.get('[data-testid="backup-codes"]').should('have.length.greaterThan', 5);
});

// API request with auth
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
    const token = window.localStorage.getItem('token');

    return cy.request({
        method,
        url: `${Cypress.env('apiUrl')}${url}`,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body,
        failOnStatusCode: false,
    });
});

// Wait for API call
Cypress.Commands.add('waitForAPI', (alias) => {
    cy.wait(alias).its('response.statusCode').should('be.oneOf', [200, 201]);
});

// Check toast notification
Cypress.Commands.add('checkToast', (message, type = 'success') => {
    cy.get('[data-testid="toast"]')
        .should('be.visible')
        .and('contain', message)
        .and('have.class', type);
});

// Create a prediction
Cypress.Commands.add('createPrediction', (trendData) => {
    cy.visit('/dashboard');
    cy.contains('New Prediction').click();

    // Fill form
    cy.get('input[name="platform"]').select(trendData.platform);
    cy.get('input[name="trend_name"]').type(trendData.name);
    cy.get('input[name="views"]').type(trendData.views);

    cy.get('button').contains('Analyze').click();

    // Wait for result
    cy.contains(/viral score/i).should('be.visible');
});

// Navigate to page
Cypress.Commands.add('goTo', (page) => {
    const routes = {
        dashboard: '/',
        explore: '/explore',
        analytics: '/analytics',
        settings: '/settings',
        admin: '/admin',
    };

    cy.visit(routes[page] || page);
});

// Check loading state
Cypress.Commands.add('shouldBeLoading', () => {
    cy.get('[data-testid="loading"]').should('be.visible');
});

Cypress.Commands.add('shouldNotBeLoading', () => {
    cy.get('[data-testid="loading"]').should('not.exist');
});

// Intercept API calls
Cypress.Commands.add('mockAPI', (method, path, response, statusCode = 200) => {
    cy.intercept(method, `**${path}`, {
        statusCode,
        body: response,
    }).as(path.replace(/\//g, '_'));
});

// Upload file
Cypress.Commands.add('uploadFile', (fileName, fileType = 'image/png') => {
    cy.fixture(fileName).then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
            fileContent,
            fileName,
            mimeType: fileType,
        });
    });
});

// Check accessibility
Cypress.Commands.add('checkA11y', () => {
    cy.injectAxe();
    cy.checkA11y();
});

// Take full page screenshot
Cypress.Commands.add('screenshotPage', (name) => {
    cy.screenshot(name, {
        capture: 'fullPage',
        overwrite: true,
    });
});

// Wait for element with timeout
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
    cy.get(selector, { timeout }).should('be.visible');
});

// Local storage helpers
Cypress.Commands.add('setLocalStorage', (key, value) => {
    cy.window().then((window) => {
        window.localStorage.setItem(key, value);
    });
});

Cypress.Commands.add('getLocalStorage', (key) => {
    return cy.window().then((window) => {
        return window.localStorage.getItem(key);
    });
});

// Database seed helpers (requires backend endpoint)
Cypress.Commands.add('seedDatabase', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/test/seed`);
});

Cypress.Commands.add('clearDatabase', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/test/clear`);
});
