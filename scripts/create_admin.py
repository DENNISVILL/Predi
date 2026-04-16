#!/usr/bin/env python3
"""
Script para crear el primer usuario administrador de Predix
"""

import sys
import os
import bcrypt
from datetime import datetime

# Añadir el directorio backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.database import SessionLocal
from app.models import AdminUser

def hash_password(password: str) -> str:
    """Hash de la contraseña usando bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_admin_user():
    """Crear el primer usuario administrador"""
    db = SessionLocal()
    
    try:
        # Verificar si ya existe un admin
        existing_admin = db.query(AdminUser).first()
        if existing_admin:
            print("❌ Ya existe un usuario administrador en el sistema.")
            print(f"   Usuario existente: {existing_admin.username} ({existing_admin.email})")
            return False
        
        print("🔧 Creando el primer usuario administrador...")
        print("=" * 50)
        
        # Solicitar datos del administrador
        username = input("👤 Username: ").strip()
        if not username:
            print("❌ El username es requerido")
            return False
            
        email = input("📧 Email: ").strip()
        if not email or '@' not in email:
            print("❌ Email válido es requerido")
            return False
            
        full_name = input("👨‍💼 Nombre completo: ").strip()
        if not full_name:
            print("❌ El nombre completo es requerido")
            return False
            
        password = input("🔒 Contraseña (mín. 8 caracteres): ").strip()
        if len(password) < 8:
            print("❌ La contraseña debe tener al menos 8 caracteres")
            return False
            
        confirm_password = input("🔒 Confirmar contraseña: ").strip()
        if password != confirm_password:
            print("❌ Las contraseñas no coinciden")
            return False
        
        # Verificar si el username o email ya existen
        existing = db.query(AdminUser).filter(
            (AdminUser.username == username) | (AdminUser.email == email)
        ).first()
        
        if existing:
            print("❌ El username o email ya están en uso")
            return False
        
        # Crear el usuario administrador
        hashed_password = hash_password(password)
        
        admin_user = AdminUser(
            username=username,
            email=email,
            password_hash=hashed_password,
            full_name=full_name,
            role='super_admin',
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("\n✅ Usuario administrador creado exitosamente!")
        print("=" * 50)
        print(f"👤 Username: {admin_user.username}")
        print(f"📧 Email: {admin_user.email}")
        print(f"👨‍💼 Nombre: {admin_user.full_name}")
        print(f"🛡️ Rol: {admin_user.role}")
        print(f"🆔 ID: {admin_user.id}")
        print("\n🚀 Ahora puedes acceder al panel admin en: http://localhost:3000/admin")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creando el administrador: {str(e)}")
        db.rollback()
        return False
        
    finally:
        db.close()

def main():
    """Función principal"""
    print("🔧 PREDIX ADMIN SETUP")
    print("=" * 50)
    print("Este script creará el primer usuario administrador del sistema.")
    print("Asegúrate de que la base de datos esté configurada y las migraciones ejecutadas.\n")
    
    confirm = input("¿Continuar? (y/N): ").strip().lower()
    if confirm not in ['y', 'yes', 'sí', 's']:
        print("❌ Operación cancelada")
        return
    
    success = create_admin_user()
    
    if success:
        print("\n🎉 ¡Configuración completada!")
        print("📋 Próximos pasos:")
        print("   1. Iniciar el servidor backend: cd backend && uvicorn app.main:app --reload")
        print("   2. Iniciar el frontend: npm start")
        print("   3. Acceder al panel admin: http://localhost:3000/admin")
    else:
        print("\n❌ La configuración falló. Revisa los errores anteriores.")

if __name__ == "__main__":
    main()
