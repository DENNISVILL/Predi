/**
 * E2E Tests for Admin Panel
 * Comprehensive admin functionality testing
 */

describe('Admin Panel E2E Tests', () => {
    const adminUser = {
        email: Cypress.env('adminUser').email,
        password: Cypress.env('adminUser').password,
    };

    beforeEach(() => {
        // Login as admin
        cy.visit('/login');
        cy.login(adminUser.email, adminUser.password);
        cy.url().should('include', '/dashboard');

        // Navigate to admin panel
        cy.visit('/admin');
        cy.url().should('include', '/admin');
    });

    // ============================================
    // Access Control Tests
    // ============================================

    describe('Access Control', () => {
        it('should allow admin users to access admin panel', () => {
            cy.get('[data-testid="admin-panel"]').should('be.visible');
            cy.get('h1').should('contain', 'Admin Panel');
        });

        it('should redirect non-admin users to dashboard', () => {
            // Logout and login as regular user
            cy.logout();
            cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password);

            cy.visit('/admin');
            cy.url().should('not.include', '/admin');
            cy.checkToast('Access denied');
        });

        it('should redirect unauthenticated users to login', () => {
            cy.logout();
            cy.visit('/admin');
            cy.url().should('include', '/login');
        });
    });

    // ============================================
    // User Management Tests
    // ============================================

    describe('User Management', () => {
        beforeEach(() => {
            cy.get('[data-testid="nav-users"]').click();
        });

        it('should display list of all users', () => {
            cy.get('[data-testid="users-table"]').should('be.visible');
            cy.get('[data-testid="user-row"]').should('have.length.greaterThan', 0);
        });

        it('should search users by email', () => {
            const searchEmail = 'test@example.com';

            cy.get('[data-testid="user-search"]').type(searchEmail);
            cy.get('[data-testid="user-row"]').each(($row) => {
                cy.wrap($row).should('contain', searchEmail);
            });
        });

        it('should filter users by role', () => {
            cy.get('[data-testid="role-filter"]').select('premium');
            cy.get('[data-testid="user-role"]').each(($badge) => {
                cy.wrap($badge).should('contain', 'Premium');
            });
        });

        it('should view user details', () => {
            cy.get('[data-testid="user-row"]').first().click();
            cy.get('[data-testid="user-details-modal"]').should('be.visible');
            cy.get('[data-testid="user-email"]').should('be.visible');
            cy.get('[data-testid="user-stats"]').should('be.visible');
        });

        it('should edit user role', () => {
            cy.get('[data-testid="user-row"]').first().within(() => {
                cy.get('[data-testid="edit-user"]').click();
            });

            cy.get('[data-testid="role-select"]').select('premium');
            cy.get('[data-testid="save-user"]').click();

            cy.checkToast('User updated successfully');
        });

        it('should deactivate user account', () => {
            cy.get('[data-testid="user-row"]').first().within(() => {
                cy.get('[data-testid="user-actions"]').click();
            });

            cy.get('[data-testid="deactivate-user"]').click();
            cy.get('[data-testid="confirm-dialog"]').within(() => {
                cy.get('[data-testid="confirm-button"]').click();
            });

            cy.checkToast('User deactivated');
        });

        it('should impersonate user', () => {
            cy.get('[data-testid="user-row"]').first().within(() => {
                cy.get('[data-testid="user-actions"]').click();
            });

            cy.get('[data-testid="impersonate-user"]').click();
            cy.url().should('include', '/dashboard');
            cy.get('[data-testid="impersonation-banner"]').should('be.visible');
        });
    });

    // ============================================
    // Analytics Dashboard Tests
    // ============================================

    describe('Analytics Dashboard', () => {
        beforeEach(() => {
            cy.get('[data-testid="nav-analytics"]').click();
        });

        it('should display platform metrics', () => {
            cy.get('[data-testid="total-users"]').should('be.visible');
            cy.get('[data-testid="active-users"]').should('be.visible');
            cy.get('[data-testid="total-revenue"]').should('be.visible');
            cy.get('[data-testid="total-predictions"]').should('be.visible');
        });

        it('should display charts', () => {
            cy.get('[data-testid="users-chart"]').should('be.visible');
            cy.get('[data-testid="revenue-chart"]').should('be.visible');
            cy.get('[data-testid="predictions-chart"]').should('be.visible');
        });

        it('should filter metrics by date range', () => {
            cy.get('[data-testid="date-range-picker"]').click();
            cy.get('[data-testid="last-7-days"]').click();

            cy.waitForAPI('@getAnalytics');
            cy.get('[data-testid="total-users"]').should('be.visible');
        });

        it('should export analytics data', () => {
            cy.get('[data-testid="export-analytics"]').click();
            cy.get('[data-testid="export-format"]').select('csv');
            cy.get('[data-testid="export-button"]').click();

            // Wait for download
            cy.wait(1000);
            cy.readFile('cypress/downloads/analytics.csv').should('exist');
        });
    });

    // ============================================
    // Payment Management Tests
    // ============================================

    describe('Payment Management', () => {
        beforeEach(() => {
            cy.get('[data-testid="nav-payments"]').click();
        });

        it('should display all payments', () => {
            cy.get('[data-testid="payments-table"]').should('be.visible');
            cy.get('[data-testid="payment-row"]').should('have.length.greaterThan', 0);
        });

        it('should filter payments by status', () => {
            cy.get('[data-testid="status-filter"]').select('completed');
            cy.get('[data-testid="payment-status"]').each(($status) => {
                cy.wrap($status).should('contain', 'Completed');
            });
        });

        it('should view payment details', () => {
            cy.get('[data-testid="payment-row"]').first().click();
            cy.get('[data-testid="payment-details"]').should('be.visible');
            cy.get('[data-testid="payment-amount"]').should('be.visible');
            cy.get('[data-testid="payment-user"]').should('be.visible');
        });

        it('should process refund', () => {
            cy.get('[data-testid="payment-row"]').first().within(() => {
                cy.get('[data-testid="payment-actions"]').click();
            });

            cy.get('[data-testid="refund-payment"]').click();
            cy.get('[data-testid="refund-reason"]').type('Customer request');
            cy.get('[data-testid="confirm-refund"]').click();

            cy.checkToast('Refund processed');
        });
    });

    // ============================================
    // Content Moderation Tests
    // ============================================

    describe('Content Moderation', () => {
        beforeEach(() => {
            cy.get('[data-testid="nav-moderation"]').click();
        });

        it('should display flagged trends', () => {
            cy.get('[data-testid="flagged-trends"]').should('be.visible');
        });

        it('should approve trend', () => {
            cy.get('[data-testid="flagged-trend"]').first().within(() => {
                cy.get('[data-testid="approve-trend"]').click();
            });

            cy.checkToast('Trend approved');
        });

        it('should reject trend', () => {
            cy.get('[data-testid="flagged-trend"]').first().within(() => {
                cy.get('[data-testid="reject-trend"]').click();
            });

            cy.get('[data-testid="rejection-reason"]').type('Inappropriate content');
            cy.get('[data-testid="confirm-rejection"]').click();

            cy.checkToast('Trend rejected');
        });
    });

    // ============================================
    // System Settings Tests
    // ============================================

    describe('System Settings', () => {
        beforeEach(() => {
            cy.get('[data-testid="nav-settings"]').click();
        });

        it('should display system configuration', () => {
            cy.get('[data-testid="system-settings"]').should('be.visible');
        });

        it('should update rate limiting settings', () => {
            cy.get('[data-testid="rate-limit-free"]').clear().type('10');
            cy.get('[data-testid="rate-limit-pro"]').clear().type('100');
            cy.get('[data-testid="save-settings"]').click();

            cy.checkToast('Settings updated');
        });

        it('should configure email notifications', () => {
            cy.get('[data-testid="email-notifications"]').check();
            cy.get('[data-testid="notification-email"]').clear().type('admin@predix.com');
            cy.get('[data-testid="save-settings"]').click();

            cy.checkToast('Email settings updated');
        });
    });

    // ============================================
    // Feedback Management Tests
    // ============================================

    describe('Feedback Management', () => {
        beforeEach(() => {
            cy.get('[data-testid="nav-feedback"]').click();
        });

        it('should display all feedback', () => {
            cy.get('[data-testid="feedback-list"]').should('be.visible');
            cy.get('[data-testid="feedback-item"]').should('have.length.greaterThan', 0);
        });

        it('should filter feedback by type', () => {
            cy.get('[data-testid="feedback-type-filter"]').select('bug');
            cy.get('[data-testid="feedback-type"]').each(($type) => {
                cy.wrap($type).should('contain', 'Bug');
            });
        });

        it('should view feedback details', () => {
            cy.get('[data-testid="feedback-item"]').first().click();
            cy.get('[data-testid="feedback-details"]').should('be.visible');
            cy.get('[data-testid="feedback-description"]').should('be.visible');
        });

        it('should update feedback status', () => {
            cy.get('[data-testid="feedback-item"]').first().within(() => {
                cy.get('[data-testid="status-select"]').select('in_progress');
            });

            cy.checkToast('Status updated');
        });

        it('should prioritize feedback', () => {
            cy.get('[data-testid="feedback-item"]').first().within(() => {
                cy.get('[data-testid="priority-select"]').select('high');
            });

            cy.checkToast('Priority updated');
        });
    });

    // ============================================
    // Audit Log Tests
    // ============================================

    describe('Audit Log', () => {
        beforeEach(() => {
            cy.get('[data-testid="nav-audit"]').click();
        });

        it('should display audit log entries', () => {
            cy.get('[data-testid="audit-log"]').should('be.visible');
            cy.get('[data-testid="audit-entry"]').should('have.length.greaterThan', 0);
        });

        it('should filter by action type', () => {
            cy.get('[data-testid="action-filter"]').select('user_login');
            cy.get('[data-testid="audit-action"]').each(($action) => {
                cy.wrap($action).should('contain', 'Login');
            });
        });

        it('should search by user email', () => {
            cy.get('[data-testid="audit-search"]').type('admin@predix.com');
            cy.get('[data-testid="audit-user"]').each(($user) => {
                cy.wrap($user).should('contain', 'admin@predix.com');
            });
        });

        it('should filter by date range', () => {
            cy.get('[data-testid="audit-date-range"]').click();
            cy.get('[data-testid="last-24-hours"]').click();

            cy.get('[data-testid="audit-entry"]').should('be.visible');
        });
    });

    // ============================================
    // Performance Tests
    // ============================================

    describe('Performance', () => {
        it('should load admin dashboard within 2 seconds', () => {
            const startTime = Date.now();

            cy.visit('/admin');
            cy.get('[data-testid="admin-panel"]').should('be.visible');

            const loadTime = Date.now() - startTime;
            expect(loadTime).to.be.lessThan(2000);
        });

        it('should handle large user list efficiently', () => {
            cy.get('[data-testid="nav-users"]').click();
            cy.get('[data-testid="users-table"]').should('be.visible');

            // Scroll through list
            cy.get('[data-testid="users-table"]').scrollTo('bottom');
            cy.shouldNotBeLoading();
        });
    });

    // ============================================
    // Error Handling Tests
    // ============================================

    describe('Error Handling', () => {
        it('should handle API errors gracefully', () => {
            cy.intercept('GET', '/api/v1/admin/users', {
                statusCode: 500,
                body: { error: 'Server error' },
            }).as('getUsersError');

            cy.get('[data-testid="nav-users"]').click();
            cy.wait('@getUsersError');

            cy.checkToast('Failed to load users');
        });

        it('should retry failed requests', () => {
            let callCount = 0;

            cy.intercept('GET', '/api/v1/admin/analytics', (req) => {
                callCount++;
                if (callCount < 2) {
                    req.reply({ statusCode: 500 });
                } else {
                    req.reply({ statusCode: 200, body: {} });
                }
            }).as('getAnalytics');

            cy.get('[data-testid="nav-analytics"]').click();
            cy.wait('@getAnalytics');
            cy.get('[data-testid="analytics-dashboard"]').should('be.visible');
        });
    });
});
