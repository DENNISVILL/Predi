const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create Reusable Transporter
// NOTE TO USER: Replace these with your actual SMTP credentials
// For Gmail: You need an "App Password" (not your normal password)
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail', // or 'smtp.ionos.com', 'smtp.aws.com'
    auth: {
        user: process.env.SMTP_USER || 'tu_email@gmail.com',
        pass: process.env.SMTP_PASS || 'tu_app_password_google'
    }
});

/**
 * Send Welcome Email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 */
const sendWelcomeEmail = async (to, name) => {
    try {
        const info = await transporter.sendMail({
            from: `"Predix AI" <${process.env.SMTP_USER || 'noreply@predix.com'}>`,
            to: to,
            subject: "¡Bienvenido a Predix! 🚀",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #007bff;">¡Hola ${name}! 👋</h2>
                    <p>Bienvenido a <strong>Predix</strong>, la plataforma de IA más avanzada para predecir tendencias.</p>
                    <p>Estamos emocionados de tenerte a bordo. Aquí tienes algunos pasos para empezar:</p>
                    <ul>
                        <li>Explora el <strong>Dashboard</strong> para ver tendencias.</li>
                        <li>Configura tus <strong>Alertas</strong> en Ajustes.</li>
                        <li>Prueba nuestro <strong>Chat con IA</strong>.</li>
                    </ul>
                    <p>Si tienes dudas, responde a este correo.</p>
                    <br>
                    <p style="font-size: 12px; color: #777;">&copy; 2024 Predix Inc.</p>
                </div>
            `
        });
        console.log("📨 Welcome Email Sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Email Error:", error);
        // Don't crash app if email fails (common in dev if no creds)
        return false;
    }
};

module.exports = {
    sendWelcomeEmail
};
