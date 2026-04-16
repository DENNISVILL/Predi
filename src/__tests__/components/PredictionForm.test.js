/**
 * Comprehensive Tests for PredictionForm Component
 * Tests form submission, validation, and user interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PredictionForm from '../../components/PredictionForm';

const mockOnSubmit = jest.fn();

describe('PredictionForm Component', () => {
    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    // ============================================
    // Rendering Tests
    // ============================================

    test('renders all form fields', () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/platform/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/trend name|hashtag/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/views/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/likes/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/shares/i)).toBeInTheDocument();
    });

    test('renders submit button', () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        expect(screen.getByRole('button', { name: /predict|analyze/i })).toBeInTheDocument();
    });

    test('renders platform select with all options', () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        const platformSelect = screen.getByLabelText(/platform/i);
        expect(platformSelect).toBeInTheDocument();

        fireEvent.click(platformSelect);
        expect(screen.getByText(/tiktok/i)).toBeInTheDocument();
        expect(screen.getByText(/twitter/i)).toBeInTheDocument();
        expect(screen.getByText(/instagram/i)).toBeInTheDocument();
        expect(screen.getByText(/youtube/i)).toBeInTheDocument();
    });

    // ============================================
    // Form Submission Tests
    // ============================================

    test('submits form with valid data', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'tiktok');
        await userEvent.type(screen.getByLabelText(/trend name/i), '#TestTrend');
        await userEvent.type(screen.getByLabelText(/views/i), '1000000');
        await userEvent.type(screen.getByLabelText(/likes/i), '50000');
        await userEvent.type(screen.getByLabelText(/comments/i), '5000');
        await userEvent.type(screen.getByLabelText(/shares/i), '10000');

        const submitBtn = screen.getByRole('button', { name: /predict/i });
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                platform: 'tiktok',
                name: '#TestTrend',
                views: 1000000,
                likes: 50000,
                comments: 5000,
                shares: 10000,
            });
        });
    });

    test('shows loading state during submission', async () => {
        mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

        render(<PredictionForm onSubmit={mockOnSubmit} />);

        // Fill form
        await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'tiktok');
        await userEvent.type(screen.getByLabelText(/trend name/i), '#Test');
        await userEvent.type(screen.getByLabelText(/views/i), '100000');
        await userEvent.type(screen.getByLabelText(/likes/i), '5000');
        await userEvent.type(screen.getByLabelText(/comments/i), '500');
        await userEvent.type(screen.getByLabelText(/shares/i), '1000');

        const submitBtn = screen.getByRole('button', { name: /predict/i });
        await userEvent.click(submitBtn);

        expect(submitBtn).toBeDisabled();
        expect(screen.getByText(/processing|analyzing|loading/i)).toBeInTheDocument();
    });

    // ============================================
    // Validation Tests
    // ============================================

    test('shows error for missing required fields', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        const submitBtn = screen.getByRole('button', { name: /predict/i });
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/platform is required/i)).toBeInTheDocument();
            expect(screen.getByText(/trend name is required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('validates trend name format (hashtag)', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        await userEvent.type(screen.getByLabelText(/trend name/i), 'InvalidName');

        const submitBtn = screen.getByRole('button', { name: /predict/i });
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/must start with #/i)).toBeInTheDocument();
        });
    });

    test('validates numeric fields are positive', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        await userEvent.type(screen.getByLabelText(/views/i), '-1000');

        await waitFor(() => {
            expect(screen.getByText(/must be positive|greater than 0/i)).toBeInTheDocument();
        });
    });

    test('validates view count minimum', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        await userEvent.type(screen.getByLabelText(/views/i), '100');

        await waitFor(() => {
            expect(screen.getByText(/minimum.*1000/i)).toBeInTheDocument();
        });
    });

    test('shows warning for very high engagement rate', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        await userEvent.type(screen.getByLabelText(/views/i), '1000');
        await userEvent.type(screen.getByLabelText(/likes/i), '500');

        await waitFor(() => {
            expect(screen.getByText(/unusually high|suspicious/i)).toBeInTheDocument();
        });
    });

    // ============================================
    // Calculate Engagement Tests
    // ============================================

    test('calculates and displays engagement rate', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        await userEvent.type(screen.getByLabelText(/views/i), '1000000');
        await userEvent.type(screen.getByLabelText(/likes/i), '50000');
        await userEvent.type(screen.getByLabelText(/comments/i), '5000');
        await userEvent.type(screen.getByLabelText(/shares/i), '10000');

        await waitFor(() => {
            expect(screen.getByText(/engagement rate.*6.5%/i)).toBeInTheDocument();
        });
    });

    // ============================================
    // Initial Data Tests
    // ============================================

    test('populates form with initial data', () => {
        const initialData = {
            platform: 'twitter',
            name: '#ExistingTrend',
            views: 500000,
            likes: 25000,
            comments: 2500,
            shares: 5000,
        };

        render(<PredictionForm onSubmit={mockOnSubmit} initialData={initialData} />);

        expect(screen.getByLabelText(/platform/i)).toHaveValue('twitter');
        expect(screen.getByLabelText(/trend name/i)).toHaveValue('#ExistingTrend');
        expect(screen.getByLabelText(/views/i)).toHaveValue(500000);
    });

    // ============================================
    // Optional Fields Tests
    // ============================================

    test('allows optional description field', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} showDescription />);

        const descriptionField = screen.getByLabelText(/description/i);
        expect(descriptionField).toBeInTheDocument();

        await userEvent.type(descriptionField, 'Test description');
        expect(descriptionField).toHaveValue('Test description');
    });

    test('allows optional hashtags field', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} showHashtags />);

        const hashtagsField = screen.getByLabelText(/hashtags/i);
        await userEvent.type(hashtagsField, '#test1, #test2, #test3');

        expect(hashtagsField).toHaveValue('#test1, #test2, #test3');
    });

    // ============================================
    // Reset/Clear Tests
    // ============================================

    test('clears form when reset button clicked', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} showReset />);

        await userEvent.type(screen.getByLabelText(/trend name/i), '#Test');
        await userEvent.type(screen.getByLabelText(/views/i), '100000');

        const resetBtn = screen.getByRole('button', { name: /reset|clear/i });
        await userEvent.click(resetBtn);

        expect(screen.getByLabelText(/trend name/i)).toHaveValue('');
        expect(screen.getByLabelText(/views/i)).toHaveValue(null);
    });

    // ============================================
    // Error Handling Tests
    // ============================================

    test('displays server error message', async () => {
        mockOnSubmit.mockRejectedValueOnce(new Error('Prediction failed'));

        render(<PredictionForm onSubmit={mockOnSubmit} />);

        // Fill and submit form
        await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'tiktok');
        await userEvent.type(screen.getByLabelText(/trend name/i), '#Test');
        await userEvent.type(screen.getByLabelText(/views/i), '100000');
        await userEvent.type(screen.getByLabelText(/likes/i), '5000');
        await userEvent.type(screen.getByLabelText(/comments/i), '500');
        await userEvent.type(screen.getByLabelText(/shares/i), '1000');

        await userEvent.click(screen.getByRole('button', { name: /predict/i }));

        await waitFor(() => {
            expect(screen.getByText(/prediction failed|error/i)).toBeInTheDocument();
        });
    });

    test('clears error message on field change', async () => {
        mockOnSubmit.mockRejectedValueOnce(new Error('Error'));

        render(<PredictionForm onSubmit={mockOnSubmit} />);

        // Trigger error
        await userEvent.click(screen.getByRole('button', { name: /predict/i }));

        await waitFor(() => {
            expect(screen.getByText(/required/i)).toBeInTheDocument();
        });

        // Change field
        await userEvent.type(screen.getByLabelText(/trend name/i), '#Test');

        await waitFor(() => {
            expect(screen.queryByText(/trend name is required/i)).not.toBeInTheDocument();
        });
    });

    // ============================================
    // Accessibility Tests
    // ============================================

    test('has proper labels for all inputs', () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach(input => {
            expect(input).toHaveAccessibleName();
        });
    });

    test('shows error messages with aria-invalid', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        await userEvent.click(screen.getByRole('button', { name: /predict/i }));

        await waitFor(() => {
            const nameInput = screen.getByLabelText(/trend name/i);
            expect(nameInput).toHaveAttribute('aria-invalid', 'true');
        });
    });

    // ============================================
    // Keyboard Navigation Tests
    // ============================================

    test('supports keyboard navigation through form', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        const platformSelect = screen.getByLabelText(/platform/i);
        platformSelect.focus();
        expect(platformSelect).toHaveFocus();

        // Tab to next field
        await userEvent.tab();
        expect(screen.getByLabelText(/trend name/i)).toHaveFocus();
    });

    test('submits form on Enter key in last field', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} />);

        // Fill form
        await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'tiktok');
        await userEvent.type(screen.getByLabelText(/trend name/i), '#Test');
        await userEvent.type(screen.getByLabelText(/views/i), '100000');
        await userEvent.type(screen.getByLabelText(/likes/i), '5000');
        await userEvent.type(screen.getByLabelText(/comments/i), '500');

        const sharesInput = screen.getByLabelText(/shares/i);
        await userEvent.type(sharesInput, '1000{enter}');

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });

    // ============================================
    // Helper Text Tests
    // ============================================

    test('shows helper text for complex fields', () => {
        render(<PredictionForm onSubmit={mockOnSubmit} showHelperText />);

        expect(screen.getByText(/enter total view count/i)).toBeInTheDocument();
        expect(screen.getByText(/number of likes/i)).toBeInTheDocument();
    });

    // ============================================
    // Example Data Tests
    // ============================================

    test('fills form with example data when button clicked', async () => {
        render(<PredictionForm onSubmit={mockOnSubmit} showExampleButton />);

        const exampleBtn = screen.getByRole('button', { name: /example|sample/i });
        await userEvent.click(exampleBtn);

        expect(screen.getByLabelText(/trend name/i)).not.toHaveValue('');
        expect(screen.getByLabelText(/views/i).value).not.toBe('');
    });
});
