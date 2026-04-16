/**
 * Storybook Main Configuration
 * Complete setup for React + TypeScript
 */

module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y',
        '@storybook/addon-viewport',
        '@storybook/addon-backgrounds',
        '@storybook/addon-measure',
        '@storybook/addon-outline',
        '@storybook/preset-create-react-app',
    ],

    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },

    core: {
        builder: '@storybook/builder-webpack5',
    },

    features: {
        storyStoreV7: true,
        buildStoriesJson: true,
        babelModeV7: true,
    },

    docs: {
        autodocs: 'tag',
    },

    staticDirs: ['../public'],

    webpackFinal: async (config) => {
        // Add TypeScript support
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: require.resolve('babel-loader'),
                    options: {
                        presets: [
                            require.resolve('@babel/preset-typescript'),
                            require.resolve('@babel/preset-react'),
                        ],
                    },
                },
            ],
        });

        config.resolve.extensions.push('.ts', '.tsx');

        // Add CSS support
        config.module.rules.push({
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        });

        return config;
    },
};
