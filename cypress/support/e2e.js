// ***********************************************************
// Cypress Support File
// Custom commands and global configuration
// ***********************************************************

import './commands';

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
}

// Global before hook
beforeEach(() => {
    // Clear local storage
    cy.clearLocalStorage();

    // Clear cookies
    cy.clearCookies();

    // Set viewport
    cy.viewport(1280, 720);
});

// Global after hook
afterEach(() => {
    // Take screenshot on failure
    cy.screenshot({ capture: 'runner', overwrite: true });
});

// Suppress uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    // We log it instead
    console.error('Uncaught exception:', err);

    // Still fail on critical errors
    if (err.message.includes('ResizeObserver') || err.message.includes('Animation')) {
        return false;
    }

    return true;
});

// Add custom error handlers
Cypress.on('fail', (error, runnable) => {
    // Log additional debugging info
    cy.task('log', `Test failed: ${runnable.title}`);
    cy.task('log', `Error: ${error.message}`);

    throw error;
});
