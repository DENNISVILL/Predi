/**
 * Storybook Preview Configuration
 * Global decorators, parameters, and theme setup
 */

import { BrowserRouter } from 'react-router-dom';
import '../src/styles/index.css';

// Global decorators
export const decorators = [
    (Story) => (
        <BrowserRouter>
            <div style={{ padding: '2rem' }}>
                <Story />
            </div>
        </BrowserRouter>
    ),
];

// Global parameters
export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },

    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
        expanded: true,
        sort: 'requiredFirst',
    },

    // Backgrounds addon
    backgrounds: {
        default: 'light',
        values: [
            {
                name: 'light',
                value: '#ffffff',
            },
            {
                name: 'dark',
                value: '#1a1a1a',
            },
            {
                name: 'gray',
                value: '#f5f5f5',
            },
        ],
    },

    // Viewport addon
    viewport: {
        viewports: {
            mobile: {
                name: 'Mobile',
                styles: {
                    width: '375px',
                    height: '667px',
                },
            },
            tablet: {
                name: 'Tablet',
                styles: {
                    width: '768px',
                    height: '1024px',
                },
            },
            desktop: {
                name: 'Desktop',
                styles: {
                    width: '1440px',
                    height: '900px',
                },
            },
            wide: {
                name: 'Wide Desktop',
                styles: {
                    width: '1920px',
                    height: '1080px',
                },
            },
        },
    },

    // Layout
    layout: 'centered',

    // Docs
    docs: {
        toc: true,
        source: {
            state: 'open',
        },
    },

    // Options
    options: {
        storySort: {
            order: [
                'Introduction',
                'Components',
                ['TrendCard', 'PredictionForm', 'AlertList', 'Settings', 'Profile'],
                'Pages',
                ['Dashboard', 'Explore', 'Analytics'],
                'Examples',
            ],
        },
    },
};
