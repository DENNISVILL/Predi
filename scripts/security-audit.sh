#!/bin/bash
###############################################################################
# Security Audit Automation Script
# Runs comprehensive security checks
###############################################################################

set -e

echo "🔐 Starting Security Audit..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create reports directory
mkdir -p reports
REPORT_DIR="./reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

###############################################################################
# 1. NPM AUDIT
###############################################################################
echo "📦 Running NPM Audit..."
echo "─────────────────────────────────────────────"

# Run npm audit
npm audit --json > "$REPORT_DIR/npm-audit-$TIMESTAMP.json" || true
npm audit > "$REPORT_DIR/npm-audit-$TIMESTAMP.txt" || true

# Count vulnerabilities
CRITICAL=$(npm audit --json 2>/dev/null | jq '.metadata.vulnerabilities.critical // 0')
HIGH=$(npm audit --json 2>/dev/null | jq '.metadata.vulnerabilities.high // 0')
MODERATE=$(npm audit --json 2>/dev/null | jq '.metadata.vulnerabilities.moderate // 0')
LOW=$(npm audit --json 2>/dev/null | jq '.metadata.vulnerabilities.low // 0')

echo "Critical: $CRITICAL"
echo "High: $HIGH"
echo "Moderate: $MODERATE"
echo "Low: $LOW"
echo ""

# Fail if critical or high vulnerabilities
if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
    echo "❌ CRITICAL or HIGH vulnerabilities found!"
    echo "Run 'npm audit fix' to remediate"
    NPM_STATUS="FAIL"
else
    echo "✅ NPM Audit passed"
    NPM_STATUS="PASS"
fi
echo ""

###############################################################################
# 2. SNYK TEST
###############################################################################
echo "🛡️  Running Snyk Security Scan..."
echo "─────────────────────────────────────────────"

if command -v snyk &> /dev/null; then
    # Run Snyk test
    snyk test --json > "$REPORT_DIR/snyk-test-$TIMESTAMP.json" || true
    snyk test --severity-threshold=high > "$REPORT_DIR/snyk-test-$TIMESTAMP.txt" || SNYK_EXIT_CODE=$?
    
    if [ "${SNYK_EXIT_CODE:-0}" -eq 0 ]; then
        echo "✅ Snyk scan passed"
        SNYK_STATUS="PASS"
    else
        echo "⚠️  Snyk found vulnerabilities"
        SNYK_STATUS="WARN"
    fi
    
    # Monitor project
    snyk monitor --project-name=predix || true
else
    echo "⚠️  Snyk not installed. Install with: npm install -g snyk"
    SNYK_STATUS="SKIP"
fi
echo ""

###############################################################################
# 3. DEPENDENCY CHECK
###############################################################################
echo "📚 Checking for Outdated Dependencies..."
echo "─────────────────────────────────────────────"

npm outdated > "$REPORT_DIR/outdated-$TIMESTAMP.txt" || true
OUTDATED_COUNT=$(npm outdated --json 2>/dev/null | jq 'length')

echo "Outdated packages: ${OUTDATED_COUNT:-0}"

if [ "${OUTDATED_COUNT:-0}" -gt 20 ]; then
    echo "⚠️  Many outdated dependencies. Consider updating."
    DEP_STATUS="WARN"
else
    echo "✅ Dependencies reasonably up-to-date"
    DEP_STATUS="PASS"
fi
echo ""

###############################################################################
# 4. LICENSE CHECK
###############################################################################
echo "📜 Checking Licenses..."
echo "─────────────────────────────────────────────"

if command -v license-checker &> /dev/null; then
    license-checker --json > "$REPORT_DIR/licenses-$TIMESTAMP.json" || true
    echo "✅ License report generated"
    LICENSE_STATUS="PASS"
else
    echo "⚠️  license-checker not installed"
    LICENSE_STATUS="SKIP"
fi
echo ""

###############################################################################
# 5. SECRET SCANNING
###############################################################################
echo "🔑 Scanning for Secrets..."
echo "─────────────────────────────────────────────"

# Check for common secret patterns
SECRETS_FOUND=0

# API keys
if grep -r "api[_-]key\s*=\s*['\"][^'\"]\+" --include="*.{js,ts,py,json}" --exclude-dir={node_modules,build,dist} . &> /dev/null; then
    echo "⚠️  Potential API keys found in code"
    ((SECRETS_FOUND++))
fi

# Passwords
if grep -r "password\s*=\s*['\"][^'\"]\+" --include="*.{js,ts,py,json}" --exclude-dir={node_modules,build,dist} . &> /dev/null; then
    echo "⚠️  Potential passwords found in code"
    ((SECRETS_FOUND++))
fi

# Tokens
if grep -r "token\s*=\s*['\"][^'\"]\+" --include="*.{js,ts,py,json}" --exclude-dir={node_modules,build,dist} . &> /dev/null; then
    echo "⚠️  Potential tokens found in code"
    ((SECRETS_FOUND++))
fi

if [ $SECRETS_FOUND -eq 0 ]; then
    echo "✅ No obvious secrets found in code"
    SECRET_STATUS="PASS"
else
    echo "⚠️  $SECRETS_FOUND potential secrets found. Review manually."
    SECRET_STATUS="WARN"
fi
echo ""

###############################################################################
# 6. CODE QUALITY CHECK
###############################################################################
echo "📝 Running Code Quality Checks..."
echo "─────────────────────────────────────────────"

# ESLint
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
    npm run lint > "$REPORT_DIR/eslint-$TIMESTAMP.txt" 2>&1 || ESLINT_EXIT=$?
    
    if [ "${ESLINT_EXIT:-0}" -eq 0 ]; then
        echo "✅ ESLint passed"
        ESLINT_STATUS="PASS"
    else
        echo "⚠️  ESLint warnings/errors found"
        ESLINT_STATUS="WARN"
    fi
else
    echo "⚠️  ESLint not configured"
    ESLINT_STATUS="SKIP"
fi

# TypeScript check
if [ -f "tsconfig.json" ]; then
    npx tsc --noEmit > "$REPORT_DIR/typescript-$TIMESTAMP.txt" 2>&1 || TSC_EXIT=$?
    
    if [ "${TSC_EXIT:-0}" -eq 0 ]; then
        echo "✅ TypeScript check passed"
        TSC_STATUS="PASS"
    else
        echo "⚠️  TypeScript errors found"
        TSC_STATUS="WARN"
    fi
else
    TSC_STATUS="SKIP"
fi
echo ""

###############################################################################
# 7. GENERATE SUMMARY REPORT
###############################################################################
echo "📄 Generating Summary Report..."
echo "─────────────────────────────────────────────"

cat > "$REPORT_DIR/security-summary-$TIMESTAMP.md" << EOF
# Security Audit Summary

**Date**: $(date)
**Project**: Predix Platform

## Results

| Check | Status | Details |
|-------|--------|---------|
| NPM Audit | $NPM_STATUS | Critical: $CRITICAL, High: $HIGH, Moderate: $MODERATE, Low: $LOW |
| Snyk Scan | $SNYK_STATUS | See snyk-test-$TIMESTAMP.txt for details |
| Dependencies | $DEP_STATUS | ${OUTDATED_COUNT:-0} outdated packages |
| Licenses | $LICENSE_STATUS | Report generated |
| Secrets | $SECRET_STATUS | $SECRETS_FOUND potential issues |
| ESLint | $ESLINT_STATUS | See eslint-$TIMESTAMP.txt |
| TypeScript | $TSC_STATUS | See typescript-$TIMESTAMP.txt |

## Recommendations

EOF

# Add recommendations based on results
if [ "$NPM_STATUS" = "FAIL" ]; then
    echo "- ❌ **CRITICAL**: Fix npm vulnerabilities immediately with \`npm audit fix\`" >> "$REPORT_DIR/security-summary-$TIMESTAMP.md"
fi

if [ "$SNYK_STATUS" = "WARN" ]; then
    echo "- ⚠️  Review and fix Snyk vulnerabilities" >> "$REPORT_DIR/security-summary-$TIMESTAMP.md"
fi

if [ "$SECRET_STATUS" = "WARN" ]; then
    echo "- ⚠️  Review potential secrets in code and move to environment variables" >> "$REPORT_DIR/security-summary-$TIMESTAMP.md"
fi

if [ "$DEP_STATUS" = "WARN" ]; then
    echo "- ⚠️  Update outdated dependencies with \`npm update\`" >> "$REPORT_DIR/security-summary-$TIMESTAMP.md"
fi

cat >> "$REPORT_DIR/security-summary-$TIMESTAMP.md" << EOF

## Next Steps

1. Review all WARN and FAIL items
2. Fix critical and high severity issues
3. Update dependencies
4. Run penetration testing
5. Schedule next audit in 30 days

EOF

echo "✅ Summary report: $REPORT_DIR/security-summary-$TIMESTAMP.md"
echo ""

###############################################################################
# FINAL STATUS
###############################################################################
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Security Audit Complete!"
echo ""
echo "Reports saved to: $REPORT_DIR/"
echo ""

# Determine overall status
if [ "$NPM_STATUS" = "FAIL" ]; then
    echo "❌ OVERALL STATUS: FAIL (Critical vulnerabilities found)"
    exit 1
elif [ "$SNYK_STATUS" = "WARN" ] || [ "$SECRET_STATUS" = "WARN" ]; then
    echo "⚠️  OVERALL STATUS: WARNINGS (Review required)"
    exit 0
else
    echo "✅ OVERALL STATUS: PASS"
    exit 0
fi
