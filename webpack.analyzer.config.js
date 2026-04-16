/**
 * Webpack Bundle Analyzer Configuration
 * Analyzes bundle size and composition
 */

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'production',

    entry: './src/index.tsx',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../reports/bundle-report.html',
            openAnalyzer: true,
            generateStatsFile: true,
            statsFilename: '../reports/bundle-stats.json',
            statsOptions: {
                source: false,
                reasons: true,
                errorDetails: true,
                chunkModules: true,
                chunkOrigins: true,
            },
            logLevel: 'info',
        }),

        new webpack.optimize.ModuleConcatenationPlugin(),
    ],

    optimization: {
        minimize: true,
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                },
                common: {
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true,
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react',
                    priority: 20,
                },
                charts: {
                    test: /[\\/]node_modules[\\/](chart\.js|recharts)[\\/]/,
                    name: 'charts',
                    priority: 15,
                },
            },
        },
    },

    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
