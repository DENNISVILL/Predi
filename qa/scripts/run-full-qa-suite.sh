#!/bin/bash

# Predix QA Automation Suite
# Comprehensive testing script for production readiness validation
# QA Team: Senior QA Engineer

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
QA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$QA_DIR")")"
REPORTS_DIR="$QA_DIR/reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TEST_ENV=${1:-staging}
BASE_URL=${2:-"https://staging.predix.com"}
API_URL=${3:-"https://api.staging.predix.com"}

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Logging functions
log_info() {
    echo -e "${BLUE}[QA INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[QA SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[QA WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[QA ERROR]${NC} $1"
}

log_section() {
    echo -e "${PURPLE}[QA SECTION]${NC} $1"
}

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
CRITICAL_ISSUES=0
HIGH_ISSUES=0
MEDIUM_ISSUES=0
LOW_ISSUES=0

# Function to update test results
update_test_results() {
    local status=$1
    local severity=${2:-"low"}
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [[ "$status" == "PASS" ]]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        case $severity in
            "critical") CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1)) ;;
            "high") HIGH_ISSUES=$((HIGH_ISSUES + 1)) ;;
            "medium") MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1)) ;;
            "low") LOW_ISSUES=$((LOW_ISSUES + 1)) ;;
        esac
    fi
}

# Function to check prerequisites
check_prerequisites() {
    log_section "🔍 Checking QA Prerequisites"
    
    local missing_tools=()
    
    # Check required tools
    command -v curl >/dev/null 2>&1 || missing_tools+=("curl")
    command -v jq >/dev/null 2>&1 || missing_tools+=("jq")
    command -v node >/dev/null 2>&1 || missing_tools+=("node")
    command -v npm >/dev/null 2>&1 || missing_tools+=("npm")
    command -v docker >/dev/null 2>&1 || missing_tools+=("docker")
    
    if [[ ${#missing_tools[@]} -ne 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Check if services are accessible
    if ! curl -s --max-time 10 "$BASE_URL" >/dev/null; then
        log_error "Cannot access frontend at $BASE_URL"
        exit 1
    fi
    
    if ! curl -s --max-time 10 "$API_URL/health" >/dev/null; then
        log_error "Cannot access API at $API_URL"
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Function to run functional tests
run_functional_tests() {
    log_section "🧪 Running Functional Tests"
    
    local test_report="$REPORTS_DIR/functional_tests_$TIMESTAMP.json"
    
    # Install Cypress if not present
    if [[ ! -d "$QA_DIR/node_modules" ]]; then
        log_info "Installing Cypress dependencies..."
        cd "$QA_DIR"
        npm install cypress --save-dev
    fi
    
    # Run Cypress tests
    log_info "Executing Cypress E2E tests..."
    cd "$QA_DIR"
    
    if npx cypress run --env baseUrl="$BASE_URL",apiUrl="$API_URL" --reporter json --reporter-options "output=$test_report"; then
        log_success "Functional tests completed successfully"
        update_test_results "PASS"
        
        # Parse results
        local total_specs=$(jq '.stats.suites' "$test_report" 2>/dev/null || echo "0")
        local passed_specs=$(jq '.stats.passes' "$test_report" 2>/dev/null || echo "0")
        local failed_specs=$(jq '.stats.failures' "$test_report" 2>/dev/null || echo "0")
        
        log_info "Functional Test Results: $passed_specs passed, $failed_specs failed out of $total_specs total"
        
        if [[ "$failed_specs" -gt 0 ]]; then
            update_test_results "FAIL" "high"
            log_warning "Some functional tests failed"
        fi
    else
        log_error "Functional tests failed"
        update_test_results "FAIL" "critical"
    fi
}

# Function to run performance tests
run_performance_tests() {
    log_section "⚡ Running Performance Tests"
    
    local perf_report="$REPORTS_DIR/performance_test_$TIMESTAMP.jtl"
    
    # Check if JMeter is available
    if command -v jmeter >/dev/null 2>&1; then
        log_info "Running JMeter performance tests..."
        
        jmeter -n -t "$QA_DIR/jmeter/performance-test-plan.jmx" \
               -l "$perf_report" \
               -JBASE_URL="$API_URL" \
               -JTEST_USERS=100 \
               -JRAMP_TIME=60 \
               -e -o "$REPORTS_DIR/jmeter_report_$TIMESTAMP"
        
        if [[ $? -eq 0 ]]; then
            log_success "Performance tests completed"
            update_test_results "PASS"
            
            # Analyze results
            local avg_response=$(awk -F',' 'NR>1 {sum+=$2; count++} END {print sum/count}' "$perf_report" 2>/dev/null || echo "0")
            local error_rate=$(awk -F',' 'NR>1 {if($8=="false") errors++; total++} END {print (errors/total)*100}' "$perf_report" 2>/dev/null || echo "0")
            
            log_info "Performance Results: Avg Response Time: ${avg_response}ms, Error Rate: ${error_rate}%"
            
            # Check performance thresholds
            if (( $(echo "$avg_response > 500" | bc -l) )); then
                update_test_results "FAIL" "medium"
                log_warning "Average response time exceeds 500ms threshold"
            fi
            
            if (( $(echo "$error_rate > 1" | bc -l) )); then
                update_test_results "FAIL" "high"
                log_warning "Error rate exceeds 1% threshold"
            fi
        else
            log_error "Performance tests failed"
            update_test_results "FAIL" "high"
        fi
    else
        log_warning "JMeter not found, running basic performance tests with curl"
        run_basic_performance_tests
    fi
}

# Function to run basic performance tests with curl
run_basic_performance_tests() {
    log_info "Running basic performance validation..."
    
    local endpoints=(
        "$API_URL/health"
        "$API_URL/api/v1/auth/health"
        "$BASE_URL/"
    )
    
    for endpoint in "${endpoints[@]}"; do
        log_info "Testing endpoint: $endpoint"
        
        local response_time=$(curl -w "%{time_total}" -s -o /dev/null "$endpoint")
        local http_code=$(curl -w "%{http_code}" -s -o /dev/null "$endpoint")
        
        if [[ "$http_code" == "200" ]]; then
            log_success "Endpoint $endpoint: ${response_time}s response time"
            update_test_results "PASS"
            
            # Check if response time is acceptable (< 2 seconds for basic test)
            if (( $(echo "$response_time > 2" | bc -l) )); then
                update_test_results "FAIL" "medium"
                log_warning "Slow response time: ${response_time}s"
            fi
        else
            log_error "Endpoint $endpoint failed with HTTP $http_code"
            update_test_results "FAIL" "high"
        fi
    done
}

# Function to run security tests
run_security_tests() {
    log_section "🔒 Running Security Tests"
    
    local security_report="$REPORTS_DIR/security_test_$TIMESTAMP.json"
    
    # Basic security checks
    log_info "Checking SSL/TLS configuration..."
    
    # SSL Labs API check (simplified)
    local ssl_grade=$(curl -s "https://api.ssllabs.com/api/v3/analyze?host=$(echo "$BASE_URL" | sed 's|https://||')" | jq -r '.endpoints[0].grade' 2>/dev/null || echo "Unknown")
    
    if [[ "$ssl_grade" =~ ^[AB] ]]; then
        log_success "SSL Grade: $ssl_grade"
        update_test_results "PASS"
    else
        log_warning "SSL Grade: $ssl_grade (may need improvement)"
        update_test_results "FAIL" "medium"
    fi
    
    # Security headers check
    log_info "Checking security headers..."
    
    local headers=$(curl -s -I "$BASE_URL")
    local security_headers=(
        "Strict-Transport-Security"
        "X-Frame-Options"
        "X-Content-Type-Options"
        "X-XSS-Protection"
    )
    
    for header in "${security_headers[@]}"; do
        if echo "$headers" | grep -qi "$header"; then
            log_success "Security header present: $header"
            update_test_results "PASS"
        else
            log_warning "Missing security header: $header"
            update_test_results "FAIL" "low"
        fi
    done
    
    # Basic vulnerability checks
    log_info "Running basic vulnerability scans..."
    
    # Check for common vulnerabilities
    local vuln_endpoints=(
        "$API_URL/../../../etc/passwd"
        "$API_URL/admin"
        "$API_URL/.env"
        "$API_URL/config"
    )
    
    for endpoint in "${vuln_endpoints[@]}"; do
        local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
        if [[ "$status_code" == "200" ]]; then
            log_error "Potential vulnerability: $endpoint accessible"
            update_test_results "FAIL" "critical"
        else
            log_success "Endpoint properly protected: $endpoint"
            update_test_results "PASS"
        fi
    done
}

# Function to run API tests
run_api_tests() {
    log_section "🔌 Running API Tests"
    
    local api_report="$REPORTS_DIR/api_test_$TIMESTAMP.json"
    
    # Test API endpoints
    local api_endpoints=(
        "GET:$API_URL/health"
        "GET:$API_URL/api/v1/health"
        "POST:$API_URL/api/v1/auth/login"
    )
    
    for endpoint_def in "${api_endpoints[@]}"; do
        local method=$(echo "$endpoint_def" | cut -d: -f1)
        local url=$(echo "$endpoint_def" | cut -d: -f2-)
        
        log_info "Testing $method $url"
        
        case $method in
            "GET")
                local response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url")
                local http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
                ;;
            "POST")
                # For POST endpoints, we expect them to require authentication
                local response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$url")
                local http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
                ;;
        esac
        
        if [[ "$http_code" =~ ^[2-4][0-9][0-9]$ ]]; then
            log_success "API endpoint $method $url: HTTP $http_code"
            update_test_results "PASS"
        else
            log_error "API endpoint $method $url failed: HTTP $http_code"
            update_test_results "FAIL" "high"
        fi
    done
}

# Function to run integration tests
run_integration_tests() {
    log_section "🔗 Running Integration Tests"
    
    # Test database connectivity
    log_info "Testing database integration..."
    
    local db_health=$(curl -s "$API_URL/api/v1/health" | jq -r '.database.status' 2>/dev/null || echo "unknown")
    
    if [[ "$db_health" == "healthy" ]]; then
        log_success "Database integration: healthy"
        update_test_results "PASS"
    else
        log_error "Database integration: $db_health"
        update_test_results "FAIL" "critical"
    fi
    
    # Test Redis connectivity
    log_info "Testing Redis integration..."
    
    local redis_health=$(curl -s "$API_URL/api/v1/health" | jq -r '.redis.status' 2>/dev/null || echo "unknown")
    
    if [[ "$redis_health" == "healthy" ]]; then
        log_success "Redis integration: healthy"
        update_test_results "PASS"
    else
        log_error "Redis integration: $redis_health"
        update_test_results "FAIL" "critical"
    fi
    
    # Test AI system integration
    log_info "Testing AI system integration..."
    
    local ai_health=$(curl -s "$API_URL/api/v1/health" | jq -r '.ai_system.status' 2>/dev/null || echo "unknown")
    
    if [[ "$ai_health" == "healthy" ]]; then
        log_success "AI system integration: healthy"
        update_test_results "PASS"
    else
        log_warning "AI system integration: $ai_health"
        update_test_results "FAIL" "medium"
    fi
}

# Function to generate QA report
generate_qa_report() {
    log_section "📊 Generating QA Report"
    
    local report_file="$REPORTS_DIR/qa_summary_$TIMESTAMP.md"
    local pass_rate=0
    
    if [[ $TOTAL_TESTS -gt 0 ]]; then
        pass_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    fi
    
    cat > "$report_file" << EOF
# QA Test Summary Report

**Test Environment**: $TEST_ENV  
**Test Date**: $(date)  
**Base URL**: $BASE_URL  
**API URL**: $API_URL  

## Test Results Summary

- **Total Tests**: $TOTAL_TESTS
- **Passed Tests**: $PASSED_TESTS
- **Failed Tests**: $FAILED_TESTS
- **Pass Rate**: $pass_rate%

## Issue Breakdown

- **Critical Issues**: $CRITICAL_ISSUES
- **High Priority Issues**: $HIGH_ISSUES
- **Medium Priority Issues**: $MEDIUM_ISSUES
- **Low Priority Issues**: $LOW_ISSUES

## Test Categories

### Functional Tests
Status: $([ $FAILED_TESTS -eq 0 ] && echo "✅ PASSED" || echo "❌ ISSUES FOUND")

### Performance Tests
Status: $([ $FAILED_TESTS -eq 0 ] && echo "✅ PASSED" || echo "❌ ISSUES FOUND")

### Security Tests
Status: $([ $CRITICAL_ISSUES -eq 0 ] && echo "✅ PASSED" || echo "❌ CRITICAL ISSUES")

### API Tests
Status: $([ $FAILED_TESTS -eq 0 ] && echo "✅ PASSED" || echo "❌ ISSUES FOUND")

### Integration Tests
Status: $([ $CRITICAL_ISSUES -eq 0 ] && echo "✅ PASSED" || echo "❌ CRITICAL ISSUES")

## Overall Assessment

$(if [[ $CRITICAL_ISSUES -eq 0 && $HIGH_ISSUES -eq 0 && $pass_rate -ge 95 ]]; then
    echo "✅ **APPROVED FOR PRODUCTION**"
    echo ""
    echo "The system has passed all critical quality gates and is ready for production deployment."
elif [[ $CRITICAL_ISSUES -eq 0 && $pass_rate -ge 90 ]]; then
    echo "⚠️ **CONDITIONAL APPROVAL**"
    echo ""
    echo "The system can proceed to production with minor issues to be addressed post-launch."
else
    echo "❌ **NOT APPROVED FOR PRODUCTION**"
    echo ""
    echo "Critical issues must be resolved before production deployment."
fi)

## Recommendations

$(if [[ $CRITICAL_ISSUES -gt 0 ]]; then
    echo "- **URGENT**: Address $CRITICAL_ISSUES critical issues immediately"
fi)
$(if [[ $HIGH_ISSUES -gt 0 ]]; then
    echo "- **HIGH PRIORITY**: Resolve $HIGH_ISSUES high priority issues"
fi)
$(if [[ $MEDIUM_ISSUES -gt 0 ]]; then
    echo "- **MEDIUM PRIORITY**: Plan to fix $MEDIUM_ISSUES medium priority issues"
fi)
$(if [[ $LOW_ISSUES -gt 0 ]]; then
    echo "- **LOW PRIORITY**: Consider addressing $LOW_ISSUES low priority issues in future releases"
fi)

---
**QA Engineer**: Automated QA Suite  
**Report Generated**: $(date)
EOF
    
    log_success "QA report generated: $report_file"
}

# Function to display final results
display_final_results() {
    log_section "🏆 Final QA Results"
    
    echo "======================================"
    echo "        PREDIX QA TEST SUMMARY        "
    echo "======================================"
    echo "Environment: $TEST_ENV"
    echo "Total Tests: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    echo "Pass Rate: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%"
    echo "======================================"
    echo "Issue Severity Breakdown:"
    echo "Critical: $CRITICAL_ISSUES"
    echo "High: $HIGH_ISSUES"
    echo "Medium: $MEDIUM_ISSUES"
    echo "Low: $LOW_ISSUES"
    echo "======================================"
    
    if [[ $CRITICAL_ISSUES -eq 0 && $HIGH_ISSUES -eq 0 && $((PASSED_TESTS * 100 / TOTAL_TESTS)) -ge 95 ]]; then
        log_success "🎉 QUALITY GATE: APPROVED FOR PRODUCTION"
        echo "The system meets all quality standards for production deployment."
        exit 0
    elif [[ $CRITICAL_ISSUES -eq 0 && $((PASSED_TESTS * 100 / TOTAL_TESTS)) -ge 90 ]]; then
        log_warning "⚠️ QUALITY GATE: CONDITIONAL APPROVAL"
        echo "The system can proceed with minor issues to be addressed."
        exit 1
    else
        log_error "❌ QUALITY GATE: NOT APPROVED"
        echo "Critical issues must be resolved before production deployment."
        exit 2
    fi
}

# Main execution
main() {
    echo "🧪 Starting Predix QA Automation Suite"
    echo "Environment: $TEST_ENV"
    echo "Frontend URL: $BASE_URL"
    echo "API URL: $API_URL"
    echo "Timestamp: $TIMESTAMP"
    echo "======================================"
    
    check_prerequisites
    run_functional_tests
    run_performance_tests
    run_security_tests
    run_api_tests
    run_integration_tests
    generate_qa_report
    display_final_results
}

# Execute main function
main "$@"
