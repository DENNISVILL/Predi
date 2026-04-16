/**
 * Complete User Flow E2E Tests
 * Tests the entire user journey from registration to prediction
 */

describe('Complete User Flow', () => {
    const testUser = {
        email: `test${Date.now()}@predix.com`,
        username: `testuser${Date.now()}`,
        password: 'SecureTestPass123!',
    };

    before(() => {
        // Clear database if test endpoint exists
        // cy.clearDatabase();
    });

    after(() => {
        // Cleanup
    });

    describe('1. User Registration', () => {
        it('should register a new user successfully', () => {
            cy.visit('/register');

            // Fill registration form
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="username"]').type(testUser.username);
            cy.get('input[name="password"]').type(testUser.password);
            cy.get('input[name="confirmPassword"]').type(testUser.password);
            cy.get('input[name="fullName"]').type('Test User');

            // Submit
            cy.get('button[type="submit"]').click();

            // Verify success
            cy.url().should('include', '/login');
            cy.checkToast('registered successfully', 'success');
        });

        it('should not allow duplicate email', () => {
            cy.visit('/register');

            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="username"]').type('anotheruser');
            cy.get('input[name="password"]').type(testUser.password);
            cy.get('input[name="confirmPassword"]').type(testUser.password);

            cy.get('button[type="submit"]').click();

            cy.contains(/email already exists/i).should('be.visible');
        });
    });

    describe('2. User Login', () => {
        it('should login successfully', () => {
            cy.login(testUser.email, testUser.password);

            // Should be on dashboard
            cy.url().should('include', '/dashboard');
            cy.contains('Welcome').should('be.visible');
        });

        it('should reject invalid credentials', () => {
            cy.visit('/login');
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="password"]').type('WrongPassword123!');
            cy.get('button[type="submit"]').click();

            cy.contains(/incorrect|invalid/i).should('be.visible');
            cy.url().should('include', '/login');
        });
    });

    describe('3. Dashboard Interaction', () => {
        beforeEach(() => {
            cy.login(testUser.email, testUser.password);
        });

        it('should display dashboard correctly', () => {
            // Check main sections
            cy.contains('Dashboard').should('be.visible');
            cy.get('[data-testid="stats-cards"]').should('be.visible');
            cy.get('[data-testid="trends-list"]').should('be.visible');
        });

        it('should show user stats', () => {
            cy.get('[data-testid="total-predictions"]').should('be.visible');
            cy.get('[data-testid="active-alerts"]').should('be.visible');
        });

        it('should navigate between sections', () => {
            // Navigate to Explore
            cy.contains('Explore').click();
            cy.url().should('include', '/explore');

            // Navigate to Analytics
            cy.contains('Analytics').click();
            cy.url().should('include', '/analytics');

            // Back to Dashboard
            cy.contains('Dashboard').click();
            cy.url().should('match', /\/$|\/dashboard$/);
        });
    });

    describe('4. Trend Exploration', () => {
        beforeEach(() => {
            cy.login(testUser.email, testUser.password);
            cy.goTo('explore');
        });

        it('should load and display trends', () => {
            cy.get('[data-testid="trends-grid"]').should('be.visible');
            cy.get('[data-testid="trend-card"]').should('have.length.greaterThan', 0);
        });

        it('should filter trends by platform', () => {
            // Click TikTok filter
            cy.get('[data-testid="filter-tiktok"]').click();

            // All visible trends should be from TikTok
            cy.get('[data-testid="trend-card"]').each(($card) => {
                cy.wrap($card).should('contain', 'TikTok');
            });
        });

        it('should search trends', () => {
            cy.get('input[placeholder="Search trends..."]').type('#viral');

            cy.get('[data-testid="trend-card"]').each(($card) => {
                cy.wrap($card).invoke('text').should('match', /#viral/i);
            });
        });

        it('should open trend details', () => {
            cy.get('[data-testid="trend-card"]').first().click();

            cy.get('[data-testid="trend-details-modal"]').should('be.visible');
            cy.contains('Viral Score').should('be.visible');
            cy.contains('Growth Rate').should('be.visible');
        });
    });

    describe('5. AI Prediction', () => {
        beforeEach(() => {
            cy.login(testUser.email, testUser.password);
        });

        it('should create a new prediction', () => {
            cy.visit('/dashboard');
            cy.contains('New Prediction').click();

            // Fill prediction form
            cy.get('select[name="platform"]').select('tiktok');
            cy.get('input[name="trend_name"]').type('#TestTrend');
            cy.get('input[name="views"]').type('1000000');
            cy.get('input[name="likes"]').type('50000');
            cy.get('input[name="comments"]').type('5000');
            cy.get('input[name="shares"]').type('10000');

            // Submit for analysis
            cy.get('button').contains('Analyze').click();

            // Should show loading
            cy.shouldBeLoading();

            // Wait for result
            cy.contains('Viral Score', { timeout: 15000 }).should('be.visible');
            cy.get('[data-testid="viral-score"]').should('be.visible');
            cy.get('[data-testid="confidence-score"]').should('be.visible');

            // Check that score is a number
            cy.get('[data-testid="viral-score"]')
                .invoke('text')
                .should('match', /\d+\.?\d*/);
        });

        it('should display prediction details', () => {
            cy.visit('/predictions');

            // Should show previous predictions
            cy.get('[data-testid="prediction-card"]').should('exist');

            // Click on a prediction
            cy.get('[data-testid="prediction-card"]').first().click();

            // Should show detailed view
            cy.contains('Growth Predictions').should('be.visible');
            cy.contains('24h').should('be.visible');
            cy.contains('48h').should('be.visible');
            cy.contains('72h').should('be.visible');
        });
    });

    describe('6. Alerts Management', () => {
        beforeEach(() => {
            cy.login(testUser.email, testUser.password);
            cy.goTo('settings');
            cy.contains('Alerts').click();
        });

        it('should create a new alert', () => {
            cy.contains('Create Alert').click();

            cy.get('input[name="alertName"]').type('High Viral Score Alert');
            cy.get('select[name="alertType"]').select('viral_spike');
            cy.get('input[name="threshold"]').type('80');

            cy.get('button').contains('Create').click();

            cy.checkToast('Alert created', 'success');
        });

        it('should list all alerts', () => {
            cy.get('[data-testid="alerts-list"]').should('be.visible');
            cy.get('[data-testid="alert-item"]').should('have.length.greaterThan', 0);
        });

        it('should toggle alert on/off', () => {
            cy.get('[data-testid="alert-toggle"]').first().click();
            cy.checkToast('Alert updated', 'success');
        });

        it('should delete an alert', () => {
            cy.get('[data-testid="alert-item"]').first().within(() => {
                cy.get('[data-testid="delete-alert"]').click();
            });

            cy.contains('Confirm').click();
            cy.checkToast('Alert deleted', 'success');
        });
    });

    describe('7. Settings Management', () => {
        beforeEach(() => {
            cy.login(testUser.email, testUser.password);
            cy.goTo('settings');
        });

        it('should update profile information', () => {
            cy.contains('Profile').click();

            cy.get('input[name="fullName"]').clear().type('Updated Test User');
            cy.get('textarea[name="bio"]').type('Test bio for E2E tests');

            cy.get('button').contains(Save').click();
      
      cy.checkToast('Profile updated', 'success');
        });

        it('should change password', () => {
            cy.contains('Security').click();

            cy.get('input[name="currentPassword"]').type(testUser.password);
            cy.get('input[name="newPassword"]').type('NewSecurePass123!');
            cy.get('input[name="confirmPassword"]').type('NewSecurePass123!');

            cy.get('button').contains('Change Password').click();

            cy.checkToast('Password changed', 'success');

            // Update testUser object
            testUser.password = 'NewSecurePass123!';
        });
    });

    describe('8. 2FA Setup and Usage', () => {
        it('should setup 2FA', () => {
            cy.login(testUser.email, testUser.password);
            cy.goTo('settings');
            cy.contains('Security').click();

            cy.contains('Enable 2FA').click();

            // Should show QR code
            cy.get('[data-testid="qr-code"]').should('be.visible');
            cy.get('[data-testid="backup-codes"]').should('be.visible');

            // Save backup codes
            cy.get('[data-testid="download-codes"]').click();

            // In real test, would scan QR and enter actual TOTP code
            // For E2E, we'll use a mock verification
            cy.get('input[name="verification_code"]').type('123456');
            cy.get('button').contains('Verify').click();

            // Should show success (or error if code invalid)
        });

        it('should login with 2FA', () => {
            // This test needs actual 2FA to be set up with known secret
            // Skipping actual implementation as it requires TOTP generation
        });
    });

    describe('9. Real-time Features', () => {
        beforeEach(() => {
            cy.login(testUser.email, testUser.password);
        });

        it('should receive real-time notifications', () => {
            cy.visit('/dashboard');

            // Wait for WebSocket connection
            cy.wait(2000);

            // Simulate a webhook or wait for real notification
            // Check notification appears
            cy.get('[data-testid="notification"]', { timeout: 30000 })
                .should('be.visible');
        });

        it('should update trends in real-time', () => {
            cy.visit('/explore');

            const initialCount = cy.get('[data-testid="trend-card"]').length;

            // Wait for potential updates
            cy.wait(5000);

            // Check if count changed (if real-time updates occur)
            // This is environment-dependent
        });
    });

    describe('10. Logout', () => {
        it('should logout successfully', () => {
            cy.login(testUser.email, testUser.password);
            cy.logout();

            // Should be redirected to login
            cy.url().should('include', '/login');

            // Token should be cleared
            cy.getLocalStorage('token').should('be.null');
        });
    });

    describe('11. Error Handling', () => {
        it('should handle network errors gracefully', () => {
            cy.login(testUser.email, testUser.password);

            // Simulate offline
            cy.intercept('GET', '**/api/**', { forceNetworkError: true });

            cy.visit('/explore');

            cy.contains(/network error|offline/i).should('be.visible');
        });

        it('should handle 500 errors', () => {
            cy.login(testUser.email, testUser.password);

            cy.intercept('GET', '**/api/v1/trends', {
                statusCode: 500,
                body: { error: 'Internal server error' },
            });

            cy.visit('/explore');

            cy.contains(/error|something went wrong/i).should('be.visible');
        });
    });

    describe('12. Accessibility', () => {
        beforeEach(() => {
            cy.login(testUser.email, testUser.password);
        });

        it('should be keyboard navigable', () => {
            cy.visit('/dashboard');

            // Tab through elements
            cy.get('body').tab();
            cy.focused().should('have.attr', 'role');

            // Check focus indicators
            cy.focused().should('have.css', 'outline-width');
        });

        it('should have proper ARIA labels', () => {
            cy.visit('/explore');

            cy.get('button').each(($btn) => {
                // Every button should have aria-label or text content
                cy.wrap($btn).should('satisfy', ($el) => {
                    return (
                        $el.attr('aria-label') ||
                        $el.text().trim().length > 0
                    );
                });
            });
        });

        it('should pass automated accessibility tests', () => {
            cy.visit('/dashboard');
            cy.checkA11y();
        });
    });

    describe('13. Performance', () => {
        it('should load dashboard quickly', () => {
            cy.login(testUser.email, testUser.password);

            const start = Date.now();
            cy.visit('/dashboard');

            cy.get('[data-testid="trends-list"]').should('be.visible');

            const loadTime = Date.now() - start;
            expect(loadTime).to.be.lessThan(3000); // Under 3 seconds
        });

        it('should handle large data sets', () => {
            cy.login(testUser.email, testUser.password);
            cy.visit('/explore');

            // Scroll through large list
            cy.get('[data-testid="trends-grid"]').scrollTo('bottom');

            // Should still be responsive
            cy.get('[data-testid="trend-card"]').first().click({ timeout: 1000 });
        });
    });
});
