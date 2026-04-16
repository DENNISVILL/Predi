const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        // Base URL for tests
        baseUrl: 'http://localhost:3000',

        // Spec pattern
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

        // Support file
        supportFile: 'cypress/support/e2e.js',

        // Viewport
        viewportWidth: 1280,
        viewportHeight: 720,

        // Video recording
        video: true,
        videoCompression: 32,
        videosFolder: 'cypress/videos',

        // Screenshots
        screenshotsFolder: 'cypress/screenshots',
        screenshotOnRunFailure: true,

        // Timeouts
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        responseTimeout: 10000,
        pageLoadTimeout: 30000,

        // Retry logic
        retries: {
            runMode: 2,
            openMode: 0,
        },

        // Environment variables
        env: {
            apiUrl: 'http://localhost:8000',
            testUser: {
                email: 'test@predix.com',
                password: 'TestPassword123!',
            },
            adminUser: {
                email: 'admin@predix.com',
                password: 'AdminPassword123!',
            },
        },

        // Setup node events
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                },
            });

            return config;
        },
    },

    // Component testing configuration
    component: {
        devServer: {
            framework: 'react',
            bundler: 'webpack',
        },
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/component.js',
    },
});
