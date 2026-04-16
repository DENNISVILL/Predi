#!/bin/bash
# 🔐 Script de Rotación de Secrets
# Uso: ./rotate_secrets.sh

set -e  # Exit on error

echo "🔐 Rotando Secrets de Predix..."
echo "================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env no encontrado"
    echo "   Ejecutar desde la raíz del proyecto"
    exit 1
fi

# 1. Generar nuevo SECRET_KEY
echo "1️⃣ Generando nuevo SECRET_KEY..."
NEW_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))")
echo "   ✅ Nuevo SECRET_KEY generado (64 bytes)"

# 2. Backup del .env actual
BACKUP_FILE="backend/.env.backup.$(date +%Y%m%d_%H%M%S)"
cp backend/.env "$BACKUP_FILE"
echo "2️⃣ ✅ Backup creado: $BACKUP_FILE"

# 3. Actualizar SECRET_KEY en .env
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/SECRET_KEY=.*/SECRET_KEY=$NEW_SECRET/" backend/.env
else
    # Linux
    sed -i "s/SECRET_KEY=.*/SECRET_KEY=$NEW_SECRET/" backend/.env
fi
echo "3️⃣ ✅ SECRET_KEY actualizado en backend/.env"

# 4. Mostrar el nuevo SECRET_KEY
echo ""
echo "🔑 Nuevo SECRET_KEY:"
echo "   $NEW_SECRET"
echo ""

# 5. Recordatorios
echo "⚠️  IMPORTANTE - Próximos pasos:"
echo "   1. Reiniciar backend: docker-compose restart backend"
echo "   2. O manualmente: pkill -f uvicorn && uvicorn main:app"
echo "   3. Los tokens JWT antiguos EXPIRARÁN"
echo "   4. Usuarios deberán volver a autenticarse"
echo "   5. Notificar a usuarios del mantenimiento"
echo ""

echo "✅ Rotación completada exitosamente"
echo "📝 Backup guardado en: $BACKUP_FILE"
echo "================================"
