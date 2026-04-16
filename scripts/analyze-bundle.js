#!/usr/bin/env node
/**
 * Bundle Analysis Script
 * Analyzes bundle size and generates reports
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '../reports');
const THRESHOLDS = {
    maxBundleSize: 500 * 1024, // 500KB
    maxChunkSize: 250 * 1024,  // 250KB
    maxVendorSize: 300 * 1024, // 300KB
};

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

console.log('🔍 Starting bundle analysis...\n');

// Build with analyzer
exec('npm run build:analyze', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }

    console.log('✅ Build completed\n');

    // Read stats file
    const statsPath = path.join(REPORTS_DIR, 'bundle-stats.json');

    if (!fs.existsSync(statsPath)) {
        console.error('❌ Stats file not found');
        process.exit(1);
    }

    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

    // Analyze assets
    console.log('📊 Bundle Analysis Results:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let totalSize = 0;
    let warnings = [];

    stats.assets.forEach(asset => {
        totalSize += asset.size;
        console.log(`${asset.name}: ${formatBytes(asset.size)}`);

        // Check thresholds
        if (asset.name.includes('main') && asset.size > THRESHOLDS.maxBundleSize) {
            warnings.push(`⚠️  Main bundle exceeds ${formatBytes(THRESHOLDS.maxBundleSize)}: ${formatBytes(asset.size)}`);
        }

        if (asset.name.includes('chunk') && asset.size > THRESHOLDS.maxChunkSize) {
            warnings.push(`⚠️  Chunk ${asset.name} exceeds ${formatBytes(THRESHOLDS.maxChunkSize)}: ${formatBytes(asset.size)}`);
        }

        if (asset.name.includes('vendor') && asset.size > THRESHOLDS.maxVendorSize) {
            warnings.push(`⚠️  Vendor bundle exceeds ${formatBytes(THRESHOLDS.maxVendorSize)}: ${formatBytes(asset.size)}`);
        }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📦 Total Bundle Size: ${formatBytes(totalSize)}\n`);

    // Display warnings
    if (warnings.length > 0) {
        console.log('⚠️  Warnings:\n');
        warnings.forEach(warning => console.log(warning));
        console.log('');
    } else {
        console.log('✅ All bundles within size thresholds\n');
    }

    // Generate recommendations
    generateRecommendations(stats);

    // Create summary report
    createSummaryReport(stats, totalSize, warnings);

    console.log('📄 Reports generated in ./reports/');
    console.log('🌐 Opening interactive report...\n');
});

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function generateRecommendations(stats) {
    console.log('💡 Recommendations:\n');

    const recommendations = [];

    // Check for large dependencies
    if (stats.modules) {
        const largeDeps = stats.modules
            .filter(m => m.size > 100000)
            .sort((a, b) => b.size - a.size)
            .slice(0, 5);

        if (largeDeps.length > 0) {
            recommendations.push('Consider lazy loading or code splitting for:');
            largeDeps.forEach(dep => {
                recommendations.push(`  - ${dep.name}: ${formatBytes(dep.size)}`);
            });
        }
    }

    // Check for duplicate modules
    const moduleNames = stats.modules ? stats.modules.map(m => m.name) : [];
    const duplicates = moduleNames.filter((name, index) => moduleNames.indexOf(name) !== index);

    if (duplicates.length > 0) {
        recommendations.push('\n⚠️  Duplicate modules detected - consider deduplication');
    }

    recommendations.forEach(rec => console.log(rec));
    console.log('');
}

function createSummaryReport(stats, totalSize, warnings) {
    const report = {
        timestamp: new Date().toISOString(),
        totalSize: totalSize,
        totalSizeFormatted: formatBytes(totalSize),
        assets: stats.assets.map(a => ({
            name: a.name,
            size: a.size,
            sizeFormatted: formatBytes(a.size),
        })),
        warnings: warnings,
        thresholds: THRESHOLDS,
        passed: warnings.length === 0,
    };

    const reportPath = path.join(REPORTS_DIR, 'bundle-summary.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Create markdown report
    const mdReport = `# Bundle Analysis Report

**Generated**: ${new Date().toISOString()}

## Summary

- **Total Bundle Size**: ${formatBytes(totalSize)}
- **Number of Assets**: ${stats.assets.length}
- **Status**: ${warnings.length === 0 ? '✅ PASSED' : '⚠️ WARNINGS'}

## Assets

${stats.assets.map(a => `- **${a.name}**: ${formatBytes(a.size)}`).join('\n')}

## Warnings

${warnings.length > 0 ? warnings.join('\n') : '✅ No warnings'}

## Thresholds

- Max Bundle Size: ${formatBytes(THRESHOLDS.maxBundleSize)}
- Max Chunk Size: ${formatBytes(THRESHOLDS.maxChunkSize)}
- Max Vendor Size: ${formatBytes(THRESHOLDS.maxVendorSize)}
`;

    const mdPath = path.join(REPORTS_DIR, 'bundle-report.md');
    fs.writeFileSync(mdPath, mdReport);
}
