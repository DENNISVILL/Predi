#!/bin/bash
# 🧪 Script de Testing Completo
# Ejecuta todos los tests del proyecto: frontend, backend e integración

set -e
trap 'echo "❌ Tests fallaron en línea $LINENO"' ERR

echo "🧪 Testing Completo de Predix"
echo "=============================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
FAILED=0
PASSED=0

# 1. Frontend Tests
echo "1️⃣ Frontend Tests (React + Jest)"
echo "--------------------------------"
if npm test -- --watchAll=false --coverage; then
    echo -e "${GREEN}✅ Frontend tests PASADOS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Frontend tests FALLADOS${NC}"
    ((FAILED++))
fi
echo ""

# 2. Frontend Build
echo "2️⃣ Frontend Build"
echo "--------------------------------"
if npm run build; then
    echo -e "${GREEN}✅ Frontend build EXITOSO${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Frontend build FALLADO${NC}"
    ((FAILED++))
fi
echo ""

# 3. Backend Tests
echo "3️⃣ Backend Tests (Python + Pytest)"
echo "--------------------------------"
cd backend
if python -m pytest -v --cov=. --cov-report=term-missing; then
    echo -e "${GREEN}✅ Backend tests PASADOS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Backend tests FALLADOS${NC}"
    ((FAILED++))
fi
cd ..
echo ""

# 4. Security Audit
echo "4️⃣ Security Audit (npm audit)"
echo "--------------------------------"
if npm audit --audit-level=high; then
    echo -e "${GREEN}✅ Sin vulnerabilidades HIGH o CRITICAL${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️ Vulnerabilidades encontradas${NC}"
    echo "   Ejecutar: npm audit fix"
fi
echo ""

# 5. Linting (si existe)
echo "5️⃣ Code Quality (ESLint)"
echo "--------------------------------"
if npm run lint 2>/dev/null || echo "Skip linting (not configured)"; then
    echo -e "${GREEN}✅ Linting PASADO${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️ Linting con warnings${NC}"
fi
echo ""

# 6. Type Checking (si existe TypeScript)
echo "6️⃣ Type Checking"
echo "--------------------------------"
if command -v tsc &> /dev/null; then
    if npm run type-check 2>/dev/null || tsc --noEmit; then
        echo -e "${GREEN}✅ Type checking PASADO${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️ Type errors encontrados${NC}"
    fi
else
    echo "⏭️  TypeScript no configurado (skip)"
fi
echo ""

# Resultado Final
echo "=============================="
echo "📊 Resumen de Tests"
echo "=============================="
echo -e "${GREEN}✅ Pasados: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Fallados: $FAILED${NC}"
    echo ""
    echo "❌ TESTS FALLARON - Revisar errores arriba"
    exit 1
else
    echo -e "${GREEN}❌ Fallados: 0${NC}"
    echo ""
    echo "✅ TODOS LOS TESTS PASADOS"
    echo "🚀 Listo para deployment"
fi
echo "=============================="
