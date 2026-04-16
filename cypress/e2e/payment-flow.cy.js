/**
 * E2E Tests for Payment Flow
 * Complete payment and subscription testing
 */

describe('Payment Flow E2E Tests', () => {
    const testUser = {
        email: Cypress.env('testUser').email,
        password: Cypress.env('testUser').password,
    };

    const testCard = {
        number: '4111111111111111',  // Test card
        cvv: '123',
        expMonth: '12',
        expYear: '2025',
        name: 'Test User',
    };

    beforeEach(() => {
        cy.login(testUser.email, testUser.password);
        cy.visit('/dashboard');
    });

    // ============================================
    // Plan Selection Tests
    // ============================================

    describe('Plan Selection', () => {
        it('should display all available plans', () => {
            cy.visit('/pricing');

            cy.get('[data-testid="plan-free"]').should('be.visible');
            cy.get('[data-testid="plan-pro"]').should('be.visible');
            cy.get('[data-testid="plan-enterprise"]').should('be.visible');
        });

        it('should show plan features', () => {
            cy.visit('/pricing');

            cy.get('[data-testid="plan-pro"]').within(() => {
                cy.get('[data-testid="plan-features"]').should('be.visible');
                cy.contains('100 predictions/month').should('be.visible');
                cy.contains('Advanced analytics').should('be.visible');
            });
        });

        it('should navigate to checkout when plan selected', () => {
            cy.visit('/pricing');

            cy.get('[data-testid="plan-pro"]').within(() => {
                cy.get('[data-testid="select-plan"]').click();
            });

            cy.url().should('include', '/checkout');
            cy.get('[data-testid="selected-plan"').should('contain', 'Pro');
        });

        it('should show current plan badge', () => {
            cy.visit('/pricing');

            cy.get('[data-testid="current-plan-badge"]').should('be.visible');
        });
    });

    // ============================================
    // Checkout Flow Tests
    // ============================================

    describe('Checkout Process', () => {
        beforeEach(() => {
            cy.visit('/pricing');
            cy.get('[data-testid="plan-pro"]').within(() => {
                cy.get('[data-testid="select-plan"]').click();
            });
            cy.url().should('include', '/checkout');
        });

        it('should display checkout summary', () => {
            cy.get('[data-testid="checkout-summary"]').should('be.visible');
            cy.get('[data-testid="plan-name"]').should('contain', 'Pro');
            cy.get('[data-testid="plan-price"]').should('contain', '$29.99');
        });

        it('should fill payment form with card details', () => {
            cy.get('[data-testid="card-number"]').type(testCard.number);
            cy.get('[data-testid="card-cvv"]').type(testCard.cvv);
            cy.get('[data-testid="card-exp-month"]').select(testCard.expMonth);
            cy.get('[data-testid="card-exp-year"]').select(testCard.expYear);
            cy.get('[data-testid="card-name"]').type(testCard.name);

            cy.get('[data-testid="payment-button"]').should('not.be.disabled');
        });

        it('should validate card number format', () => {
            cy.get('[data-testid="card-number"]').type('1234');
            cy.get('[data-testid="payment-button"]').click();

            cy.get('[data-testid="card-number-error"]').should('contain', 'Invalid card number');
        });

        it('should validate CVV format', () => {
            cy.get('[data-testid="card-cvv"]').type('12');

            cy.get('[data-testid="cvv-error"]').should('contain', 'Invalid CVV');
        });

        it('should validate expiration date', () => {
            cy.get('[data-testid="card-exp-month"]').select('01');
            cy.get('[data-testid="card-exp-year"]').select('2020');

            cy.get('[data-testid="exp-error"]').should('contain', 'Card expired');
        });

        it('should show secure payment badge', () => {
            cy.get('[data-testid="secure-payment-badge"]').should('be.visible');
            cy.contains('Secure payment by Paymentez').should('be.visible');
        });
    });

    // ============================================
    // Payment Processing Tests
    // ============================================

    describe('Payment Processing', () => {
        beforeEach(() => {
            cy.visit('/pricing');
            cy.get('[data-testid="plan-pro"]').within(() => {
                cy.get('[data-testid="select-plan"]').click();
            });
        });

        it('should process successful payment', () => {
            // Fill payment form
            cy.get('[data-testid="card-number"]').type(testCard.number);
            cy.get('[data-testid="card-cvv"]').type(testCard.cvv);
            cy.get('[data-testid="card-exp-month"]').select(testCard.expMonth);
            cy.get('[data-testid="card-exp-year"]').select(testCard.expYear);
            cy.get('[data-testid="card-name"]').type(testCard.name);

            // Submit payment
            cy.get('[data-testid="payment-button"]').click();

            // Wait for processing
            cy.shouldBeLoading();
            cy.waitForAPI('@processPayment', { timeout: 10000 });

            // Check success
            cy.url().should('include', '/payment/success');
            cy.checkToast('Payment successful');
        });

        it('should show processing state during payment', () => {
            cy.get('[data-testid="card-number"]').type(testCard.number);
            cy.get('[data-testid="card-cvv"]').type(testCard.cvv);
            cy.get('[data-testid="card-exp-month"]').select(testCard.expMonth);
            cy.get('[data-testid="card-exp-year"]').select(testCard.expYear);
            cy.get('[data-testid="card-name"]').type(testCard.name);

            cy.get('[data-testid="payment-button"]').click();

            cy.get('[data-testid="payment-button"]').should('be.disabled');
            cy.contains('Processing payment...').should('be.visible');
        });

        it('should handle declined payment', () => {
            // Use declined card
            cy.get('[data-testid="card-number"]').type('4000000000000002');
            cy.get('[data-testid="card-cvv"]').type(testCard.cvv);
            cy.get('[data-testid="card-exp-month"]').select(testCard.expMonth);
            cy.get('[data-testid="card-exp-year"]').select(testCard.expYear);
            cy.get('[data-testid="card-name"]').type(testCard.name);

            cy.get('[data-testid="payment-button"]').click();

            cy.waitForAPI('@processPayment');
            cy.checkToast('Payment declined');
            cy.get('[data-testid="error-message"]').should('be.visible');
        });

        it('should allow retry after failed payment', () => {
            // Simulate failed payment
            cy.intercept('POST', '/api/v1/payments/create', {
                statusCode: 400,
                body: { error: 'Payment failed' },
            }).as('failedPayment');

            cy.get('[data-testid="card-number"]').type(testCard.number);
            cy.get('[data-testid="card-cvv"]').type(testCard.cvv);
            cy.get('[data-testid="card-exp-month"]').select(testCard.expMonth);
            cy.get('[data-testid="card-exp-year"]').select(testCard.expYear);
            cy.get('[data-testid="card-name"]').type(testCard.name);

            cy.get('[data-testid="payment-button"]').click();
            cy.wait('@failedPayment');

            // Retry button should appear
            cy.get('[data-testid="retry-payment"]').should('be.visible').click();
            cy.get('[data-testid="payment-button"]').should('not.be.disabled');
        });
    });

    // ============================================
    // Subscription Management Tests
    // ============================================

    describe('Subscription Management', () => {
        it('should display active subscription', () => {
            cy.visit('/settings/subscription');

            cy.get('[data-testid="active-subscription"]').should('be.visible');
            cy.get('[data-testid="subscription-plan"]').should('be.visible');
            cy.get('[data-testid="subscription-expires"]').should('be.visible');
        });

        it('should show subscription benefits', () => {
            cy.visit('/settings/subscription');

            cy.get('[data-testid="subscription-benefits"]').should('be.visible');
            cy.contains('predictions remaining').should('be.visible');
        });

        it('should upgrade subscription', () => {
            cy.visit('/settings/subscription');

            cy.get('[data-testid="upgrade-plan"]').click();
            cy.url().should('include', '/pricing');
            cy.get('[data-testid="upgrade-badge"]').should('be.visible');
        });

        it('should downgrade subscription', () => {
            cy.visit('/settings/subscription');

            cy.get('[data-testid="change-plan"]').click();
            cy.get('[data-testid="downgrade-option"]').click();

            cy.get('[data-testid="confirm-dialog"]').should('be.visible');
            cy.contains('Downgrade will take effect at end of period').should('be.visible');

            cy.get('[data-testid="confirm-button"]').click();
            cy.checkToast('Plan change scheduled');
        });

        it('should cancel subscription', () => {
            cy.visit('/settings/subscription');

            cy.get('[data-testid="cancel-subscription"]').click();

            cy.get('[data-testid="cancel-dialog"]').should('be.visible');
            cy.get('[data-testid="cancel-reason"]').select('Too expensive');
            cy.get('[data-testid="cancel-feedback"]').type('Great service but budget constraints');

            cy.get('[data-testid="confirm-cancel"]').click();

            cy.checkToast('Subscription cancelled');
            cy.get('[data-testid="cancellation-date"]').should('be.visible');
        });

        it('should reactivate cancelled subscription', () => {
            // Assume subscription is cancelled
            cy.visit('/settings/subscription');

            cy.get('[data-testid="reactivate-subscription"]').click();
            cy.get('[data-testid="confirm-reactivation"]').click();

            cy.checkToast('Subscription reactivated');
        });
    });

    // ============================================
    // Payment History Tests
    // ============================================

    describe('Payment History', () => {
        it('should display payment history', () => {
            cy.visit('/settings/billing');

            cy.get('[data-testid="payment-history"]').should('be.visible');
            cy.get('[data-testid="payment-record"]').should('have.length.greaterThan', 0);
        });

        it('should show payment details', () => {
            cy.visit('/settings/billing');

            cy.get('[data-testid="payment-record"]').first().within(() => {
                cy.get('[data-testid="payment-amount"]').should('be.visible');
                cy.get('[data-testid="payment-date"]').should('be.visible');
                cy.get('[data-testid="payment-status"]').should('be.visible');
            });
        });

        it('should download invoice', () => {
            cy.visit('/settings/billing');

            cy.get('[data-testid="payment-record"]').first().within(() => {
                cy.get('[data-testid="download-invoice"]').click();
            });

            cy.wait(1000);
            // Verify download started
            cy.readFile('cypress/downloads/invoice.pdf').should('exist');
        });

        it('should filter by payment status', () => {
            cy.visit('/settings/billing');

            cy.get('[data-testid="status-filter"]').select('completed');
            cy.get('[data-testid="payment-status"]').each(($status) => {
                cy.wrap($status).should('contain', 'Completed');
            });
        });
    });

    // ============================================
    // Trial Period Tests
    // ============================================

    describe('Trial Period', () => {
        it('should start trial without payment', () => {
            cy.visit('/pricing');

            cy.get('[data-testid="plan-pro"]').within(() => {
                cy.get('[data-testid="start-trial"]').click();
            });

            cy.get('[data-testid="trial-confirmation"]').should('be.visible');
            cy.get('[data-testid="confirm-trial"]').click();

            cy.checkToast('Trial started');
            cy.url().should('include', '/dashboard');
        });

        it('should show trial expiration warning', () => {
            // Mock trial expiring soon
            cy.visit('/dashboard');

            cy.get('[data-testid="trial-warning"]').should('be.visible');
            cy.contains('Trial expires in').should('be.visible');
        });

        it('should convert trial to paid', () => {
            cy.visit('/dashboard');

            cy.get('[data-testid="upgrade-from-trial"]').click();
            cy.url().should('include', '/checkout');

            // Complete payment
            cy.get('[data-testid="card-number"]').type(testCard.number);
            cy.get('[data-testid="card-cvv"]').type(testCard.cvv);
            cy.get('[data-testid="card-exp-month"]').select(testCard.expMonth);
            cy.get('[data-testid="card-exp-year"]').select(testCard.expYear);
            cy.get('[data-testid="card-name"]').type(testCard.name);

            cy.get('[data-testid="payment-button"]').click();

            cy.waitForAPI('@processPayment');
            cy.checkToast('Subscription activated');
        });
    });

    // ============================================
    // Coupon/Promo Code Tests
    // ============================================

    describe('Promo Codes', () => {
        beforeEach(() => {
            cy.visit('/pricing');
            cy.get('[data-testid="plan-pro"]').within(() => {
                cy.get('[data-testid="select-plan"]').click();
            });
        });

        it('should apply valid promo code', () => {
            cy.get('[data-testid="promo-code-input"]').type('SAVE20');
            cy.get('[data-testid="apply-promo"]').click();

            cy.checkToast('Promo code applied');
            cy.get('[data-testid="discount-amount"]').should('contain', '20%');
            cy.get('[data-testid="final-price"]').should('contain', '$23.99');
        });

        it('should reject invalid promo code', () => {
            cy.get('[data-testid="promo-code-input"]').type('INVALID');
            cy.get('[data-testid="apply-promo"]').click();

            cy.checkToast('Invalid promo code');
        });

        it('should remove applied promo code', () => {
            cy.get('[data-testid="promo-code-input"]').type('SAVE20');
            cy.get('[data-testid="apply-promo"]').click();

            cy.get('[data-testid="remove-promo"]').click();
            cy.get('[data-testid="final-price"]').should('contain', '$29.99');
        });
    });

    // ============================================
    // Refund Flow Tests
    // ============================================

    describe('Refund Process', () => {
        it('should request refund', () => {
            cy.visit('/settings/billing');

            cy.get('[data-testid="payment-record"]').first().within(() => {
                cy.get('[data-testid="request-refund"]').click();
            });

            cy.get('[data-testid="refund-reason"]').select('Service not as expected');
            cy.get('[data-testid="refund-details"]').type('Did not meet my needs');
            cy.get('[data-testid="submit-refund"]').click();

            cy.checkToast('Refund request submitted');
            cy.get('[data-testid="refund-status"]').should('contain', 'Pending');
        });
    });

    // ============================================
    // Error Handling Tests
    // ============================================

    describe('Error Handling', () => {
        it('should handle payment API errors', () => {
            cy.intercept('POST', '/api/v1/payments/create', {
                statusCode: 500,
                body: { error: 'Server error' },
            }).as('paymentError');

            cy.visit('/pricing');
            cy.get('[data-testid="plan-pro"]').within(() => {
                cy.get('[data-testid="select-plan"]').click();
            });

            cy.get('[data-testid="card-number"]').type(testCard.number);
            cy.get('[data-testid="card-cvv"]').type(testCard.cvv);
            cy.get('[data-testid="card-exp-month"]').select(testCard.expMonth);
            cy.get('[data-testid="card-exp-year"]').select(testCard.expYear);
            cy.get('[data-testid="card-name"]').type(testCard.name);

            cy.get('[data-testid="payment-button"]').click();
            cy.wait('@paymentError');

            cy.checkToast('Payment failed');
            cy.get('[data-testid="error-message"]').should('be.visible');
        });

        it('should handle network timeout', () => {
            cy.intercept('POST', '/api/v1/payments/create', (req) => {
                req.reply({ delay: 35000, statusCode: 408 });
            }).as('timeout');

            cy.visit('/pricing');
            cy.get('[data-testid="plan-pro"]').within(() => {
                cy.get('[data-testid="select-plan"]').click();
            });

            // Fill and submit
            cy.get('[data-testid="payment-button"]').click();

            cy.checkToast('Request timeout', { timeout: 40000 });
        });
    });

    // ============================================
    // Security Tests
    // ============================================

    describe('Payment Security', () => {
        it('should not display full card number', () => {
            cy.visit('/settings/billing');

            cy.get('[data-testid="saved-card"]').within(() => {
                cy.get('[data-testid="card-number"]').should('contain', '****');
                cy.get('[data-testid="card-number"]').should('not.contain', '4111111111111111');
            });
        });

        it('should require re-authentication for payment changes', () => {
            cy.visit('/settings/billing');

            cy.get('[data-testid="update-payment-method"]').click();
            cy.get('[data-testid="password-prompt"]').should('be.visible');
        });

        it('should use HTTPS for payment pages', () => {
            cy.visit('/checkout');
            cy.location('protocol').should('eq', 'https:');
        });
    });
});
