#!/bin/bash
# 📊 Script de Análisis de Bundle
# Identifica archivos grandes, código muerto y oportunidades de optimización

set -e

echo "📊 Análisis de Bundle - Predix"
echo "==============================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Info del build actual
echo "1️⃣ Información del Build Actual"
echo "--------------------------------"
if [ -d "build" ]; then
    TOTAL_SIZE=$(du -sh build | cut -f1)
    JS_SIZE=$(du -sh build/static/js 2>/dev/null | cut -f1 || echo "N/A")
    CSS_SIZE=$(du -sh build/static/css 2>/dev/null | cut -f1 || echo "N/A")
    
    echo "Total Build:    $TOTAL_SIZE"
    echo "JavaScript:     $JS_SIZE"
    echo "CSS:            $CSS_SIZE"
else
    echo -e "${RED}❌ Build no encontrado. Ejecutar: npm run build${NC}"
    exit 1
fi
echo ""

# 2. Listar archivos JS grandes
echo "2️⃣ Archivos JavaScript (ordenados por tamaño)"
echo "--------------------------------"
find build/static/js -name "*.js" -type f -exec du -h {} \; | sort -hr | head -10
echo ""

# 3. Análisis de dependencias pesadas
echo "3️⃣ Dependencias más Pesadas"
echo "--------------------------------"
echo "Ejecutando webpack-bundle-analyzer..."
echo "Se abrirá una ventana del navegador con el análisis visual"
echo ""

# 4. Buscar código potencialmente no usado
echo "4️⃣ Buscando Imports Potencialmente No Usados"
echo "--------------------------------"
echo "Componentes que podrían no estar en uso:"
grep -r "import.*from" src --include="*.js" --include="*.jsx" | \
  grep -v "node_modules" | \
  cut -d':' -f2 | \
  sort | uniq -c | sort -n | head -20
echo ""

# 5. Identificar librerías grandes
echo "5️⃣ Librerías Grandes en node_modules"
echo "--------------------------------"
du -sh node_modules/* 2>/dev/null | sort -hr | head -15
echo ""

# 6. Recomendaciones
echo "💡 Recomendaciones Automáticas"
echo "--------------------------------"
echo "1. Lazy load rutas pesadas (ContentScheduler, Dashboard)"
echo "2. Optimizar imports de chart.js y framer-motion"
echo "3. Considerar tree-shaking de lucide-react icons"
echo "4. Verificar si todos los paquetes en dependencies son necesarios"
echo ""

echo "✅ Análisis completado"
echo "📊 Para análisis visual: npm run analyze"
echo "==============================="
