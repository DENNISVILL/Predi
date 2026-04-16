"""
Email Service
Handles all email sending (verification, password reset, notifications)
"""
from typing import Optional, Dict, Any
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Template
import logging

from config import settings

logger = logging.getLogger(__name__)

# ============================================
# Email Configuration
# ============================================
conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER,
    MAIL_PASSWORD=settings.SMTP_PASSWORD,
    MAIL_FROM=settings.EMAIL_FROM,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_HOST,
    MAIL_STARTTLS=settings.SMTP_TLS,
    MAIL_SSL_TLS=settings.SMTP_SSL,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fastmail = FastMail(conf)


# ============================================
# Email Templates
# ============================================

VERIFICATION_EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Verifica tu Email - Predix</h1>
        </div>
        <div class="content">
            <p>Hola {{ name }},</p>
            <p>¡Gracias por registrarte en Predix! Para comenzar a usar tu cuenta, por favor verifica tu dirección de email.</p>
            <center>
                <a href="{{ verification_link }}" class="button">Verificar Email</a>
            </center>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #667eea;">{{ verification_link }}</p>
            <p><strong>Este enlace expira en 24 horas.</strong></p>
            <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
        </div>
        <div class="footer">
            <p>© 2024 Predix - Plataforma predictiva de tendencias digitales</p>
            <p><a href="{{ settings_url }}">Configuración</a> | <a href="{{ privacy_url }}">Privacidad</a></p>
        </div>
    </div>
</body>
</html>
"""

PASSWORD_RESET_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; color: white; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Restablecer Contraseña</h1>
        </div>
        <div class="content">
            <p>Hola {{ name }},</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta Predix.</p>
            <center>
                <a href="{{ reset_link }}" class="button">Restablecer Contraseña</a>
            </center>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #f5576c;">{{ reset_link }}</p>
            <p><strong>Este enlace expira en 1 hora.</strong></p>
            <div class="warning">
                <strong>⚠️ Importante:</strong> Si no solicitaste restablecer tu contraseña, ignora este email y tu contraseña permanecerá sin cambios.
            </div>
        </div>
        <div class="footer">
            <p>© 2024 Predix</p>
            <p>Por seguridad, nunca compartas este email con nadie.</p>
        </div>
    </div>
</body>
</html>
"""

WELCOME_EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
        .content { background: #f9f9f9; padding: 30px; }
        .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 ¡Bienvenido a Predix!</h1>
        </div>
        <div class="content">
            <p>Hola {{ name }},</p>
            <p>¡Tu cuenta ha sido verificada exitosamente! Ahora puedes acceder a todas las funcionalidades de Predix.</p>
            
            <h3>🚀 Comienza a usar Predix:</h3>
            <div class="feature">
                <strong>📊 Crea tu primer post</strong><br>
                Programa contenido para TikTok, Instagram, YouTube y más.
            </div>
            <div class="feature">
                <strong>🤖 Predicciones con IA</strong><br>
                Obtén un viral score y recomendaciones para tu contenido.
            </div>
            <div class="feature">
                <strong>📈 Analytics detallado</strong><br>
                Monitorea el rendimiento de tus publicaciones.
            </div>
            
            <center>
                <a href="{{ dashboard_url }}" class="button">Ir al Dashboard</a>
            </center>
            
            <p>¿Necesitas ayuda? Visita nuestro <a href="{{ help_url }}">Centro de Ayuda</a> o responde a este email.</p>
        </div>
    </div>
</body>
</html>
"""


# ============================================
# Email Sending Functions
# ============================================

async def send_verification_email(email: str, name: str, verification_token: str) -> bool:
    """
    Send email verification email
    
    Args:
        email: Recipient email
        name: User's name
        verification_token: Verification token
        
    Returns:
        bool: True if sent successfully
    """
    try:
        verification_link = f"{settings.FRONTEND_URL}{settings.FRONTEND_VERIFY_EMAIL_PATH}?token={verification_token}"
        
        template = Template(VERIFICATION_EMAIL_TEMPLATE)
        html = template.render(
            name=name or "Usuario",
            verification_link=verification_link,
            settings_url=f"{settings.FRONTEND_URL}/settings",
            privacy_url=f"{settings.FRONTEND_URL}/legal/privacy-policy",
        )
        
        message = MessageSchema(
            subject=settings.VERIFICATION_EMAIL_SUBJECT,
            recipients=[email],
            body=html,
            subtype="html"
        )
        
        await fastmail.send_message(message)
        logger.info(f"Verification email sent to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send verification email to {email}: {e}")
        return False


async def send_password_reset_email(email: str, name: str, reset_token: str) -> bool:
    """
    Send password reset email
    
    Args:
        email: Recipient email
        name: User's name
        reset_token: Password reset token
        
    Returns:
        bool: True if sent successfully
    """
    try:
        reset_link = f"{settings.FRONTEND_URL}{settings.FRONTEND_RESET_PASSWORD_PATH}?token={reset_token}"
        
        template = Template(PASSWORD_RESET_TEMPLATE)
        html = template.render(
            name=name or "Usuario",
            reset_link=reset_link,
        )
        
        message = MessageSchema(
            subject=settings.PASSWORD_RESET_SUBJECT,
            recipients=[email],
            body=html,
            subtype="html"
        )
        
        await fastmail.send_message(message)
        logger.info(f"Password reset email sent to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send password reset email to {email}: {e}")
        return False


async def send_welcome_email(email: str, name: str) -> bool:
    """
    Send welcome email after verification
    
    Args:
        email: Recipient email
        name: User's name
        
    Returns:
        bool: True if sent successfully
    """
    try:
        template = Template(WELCOME_EMAIL_TEMPLATE)
        html = template.render(
            name=name or "Usuario",
            dashboard_url=f"{settings.FRONTEND_URL}/dashboard",
            help_url=f"{settings.FRONTEND_URL}/help",
        )
        
        message = MessageSchema(
            subject="¡Bienvenido a Predix! 🎉",
            recipients=[email],
            body=html,
            subtype="html"
        )
        
        await fastmail.send_message(message)
        logger.info(f"Welcome email sent to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email to {email}: {e}")
        return False


async def send_custom_email(
    email: str,
    subject: str,
    html_content: str
) -> bool:
    """
    Send a custom email
    
    Args:
        email: Recipient email
        subject: Email subject
        html_content: HTML content
        
    Returns:
        bool: True if sent successfully
    """
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[email],
            body=html_content,
            subtype="html"
        )
        
        await fastmail.send_message(message)
        logger.info(f"Custom email sent to {email}: {subject}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send custom email to {email}: {e}")
        return False


# Payment-specific email templates
PAYMENT_CONFIRMATION_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; color: white; }
        .content { background: #f9f9f9; padding: 30px; }
        .payment-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #11998e; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; color: #11998e; }
        .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Pago Confirmado</h1>
        </div>
        <div class="content">
            <p>Hola {{ name }},</p>
            <p>¡Tu pago ha sido procesado exitosamente! Gracias por tu confianza en Predix.</p>
            
            <div class="payment-details">
                <h3 style="margin-top: 0;">Detalles del pago</h3>
                <div class="detail-row">
                    <span>Plan:</span>
                    <strong>{{ plan_name }}</strong>
                </div>
                <div class="detail-row">
                    <span>Monto:</span>
                    <strong>${{ amount }} {{ currency }}</strong>
                </div>
                <div class="detail-row">
                    <span>ID de Transacción:</span>
                    <span style="font-family: monospace; font-size: 12px;">{{ transaction_id }}</span>
                </div>
                <div class="detail-row">
                    <span>Fecha:</span>
                    <span>{{ payment_date }}</span>
                </div>
                <div class="detail-row total">
                    <span>Total Pagado:</span>
                    <span>${{ amount }} {{ currency }}</span>
                </div>
            </div>
            
            <p>Tu suscripción está activa y puedes acceder a todas las funcionalidades de {{ plan_name }}.</p>
            
            <center>
                <a href="{{ dashboard_url }}" class="button">Ir al Dashboard</a>
            </center>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
                Recibirás una factura detallada en un correo electrónico separado.
                Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
        </div>
    </div>
</body>
</html>
"""

PAYMENT_FAILED_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; color: white; }
        .content { background: #f9f9f9; padding: 30px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .steps { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .step { padding: 10px 0; border-left: 3px solid #f5576c; padding-left: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ Problema con el Pago</h1>
        </div>
        <div class="content">
            <p>Hola {{ name }},</p>
            <p>Lamentamos informarte que no pudimos procesar tu pago para {{ plan_name }}.</p>
            
            <div class="warning">
                <strong>⚠️ Detalles del error:</strong><br>
                Monto: ${{ amount }} {{ currency }}<br>
                ID de Transacción: {{ transaction_id }}<br>
                <br>
                Razón: {{ error_message }}
            </div>
            
            <h3>¿Qué puedes hacer?</h3>
            <div class="steps">
                <div class="step">
                    <strong>1.</strong> Verifica que tu tarjeta tenga fondos suficientes
                </div>
                <div class="step">
                    <strong>2.</strong> Confirma que los datos de la tarjeta sean correctos
                </div>
                <div class="step">
                    <strong>3.</strong> Contacta a tu banco si el problema persiste
                </div>
                <div class="step">
                    <strong>4.</strong> Intenta con un método de pago diferente
                </div>
            </div>
            
            <center>
                <a href="{{ payment_url }}" class="button">Intentar Nuevamente</a>
            </center>
            
            <p style="margin-top: 30px;">
                Si necesitas ayuda, nuestro equipo de soporte está disponible para asistirte.
            </p>
            
            <p style="color: #666; font-size: 12px;">
                <strong>Nota:</strong> Tu cuenta permanece activa con tu plan actual hasta que se resuelva este problema.
            </p>
        </div>
    </div>
</body>
</html>
"""


async def send_payment_confirmation(
    email: str,
    name: str,
    plan_name: str,
    amount: float,
    currency: str,
    transaction_id: str,
    payment_date: str
) -> bool:
    """
    Send payment confirmation email
    
    Args:
        email: Recipient email
        name: User's name
        plan_name: Name of the subscription plan
        amount: Payment amount
        currency: Payment currency
        transaction_id: Transaction ID
        payment_date: Payment date
        
    Returns:
        bool: True if sent successfully
    """
    try:
        template = Template(PAYMENT_CONFIRMATION_TEMPLATE)
        html = template.render(
            name=name or "Usuario",
            plan_name=plan_name,
            amount=f"{amount:.2f}",
            currency=currency,
            transaction_id=transaction_id,
            payment_date=payment_date,
            dashboard_url=f"{settings.FRONTEND_URL}/dashboard",
        )
        
        message = MessageSchema(
            subject=f"✅ Pago Confirmado - {plan_name}",
            recipients=[email],
            body=html,
            subtype="html"
        )
        
        await fastmail.send_message(message)
        logger.info(f"Payment confirmation email sent to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send payment confirmation email to {email}: {e}")
        return False


async def send_payment_failed(
    email: str,
    name: str,
    plan_name: str,
    amount: float,
    currency: str,
    transaction_id: str,
    error_message: str
) -> bool:
    """
    Send payment failed notification email
    
    Args:
        email: Recipient email
        name: User's name
        plan_name: Name of the subscription plan
        amount: Payment amount
        currency: Payment currency
        transaction_id: Transaction ID
        error_message: Error message
        
    Returns:
        bool: True if sent successfully
    """
    try:
        template = Template(PAYMENT_FAILED_TEMPLATE)
        html = template.render(
            name=name or "Usuario",
            plan_name=plan_name,
            amount=f"{amount:.2f}",
            currency=currency,
            transaction_id=transaction_id,
            error_message=error_message,
            payment_url=f"{settings.FRONTEND_URL}/subscriptions/upgrade",
        )
        
        message = MessageSchema(
            subject=f"❌ Problema con el Pago - {plan_name}",
            recipients=[email],
            body=html,
            subtype="html"
        )
        
        await fastmail.send_message(message)
        logger.info(f"Payment failed email sent to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send payment failed email to {email}: {e}")
        return False
