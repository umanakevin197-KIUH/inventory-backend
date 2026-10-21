import nodemailer, { type Transporter } from "nodemailer";
import { injectable } from "tsyringe";

@injectable()
export class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
            rejectUnauthorized: false,
        },
        });
    }

    // ✅ Enviar correo genérico
    async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
        try {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.warn("⚠️ Email no configurado. Falta EMAIL_USER o EMAIL_PASS en .env");
                return false;
            }

            const info = await this.transporter.sendMail({
                from: `"Jesús es mi Pastor" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
            });

            console.log(`✅ Email enviado a ${to}: ${info.messageId}`);
            return true;
        } catch (error: unknown) {
            console.error(`❌ Error al enviar email a ${to}:`, error);
            return false;
        }
    }

    // ✅ Verificar que las credenciales funcionan
    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log("✅ Servidor de email listo");
            return true;
        } catch (error) {
            console.error("❌ Error de conexión al servidor de email:", error);
            return false;
        }
    }
}