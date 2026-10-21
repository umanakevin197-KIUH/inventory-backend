import { container } from "tsyringe";
import { EmailService } from "../../Application/services/email.service";
import { executeWithRetry } from "./dbHelper";
import {
    reminderTemplate,
    overdueTemplate,
    confirmationTemplate,
} from "./emailTemplates";

interface SaleForEmail {
    id: string;
    sale_number: string;
    customer_id: string | null;
    customer_name_optional: string | null;
    customer_name: string | null;
    customer_email: string | null;
    total: number;
    total_paid: number;
    balance_due: number;
    next_payment_date: string | null;
    notification_days_before: number;
}

// ✅ Calcular días restantes
function daysUntil(dateStr: string | null): number | null {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ✅ Verificar si ya se envió un correo hoy
async function alreadySentToday(saleId: string, emailType: string): Promise<boolean> {
    const today = new Date().toISOString().split("T")[0];
    const result = await executeWithRetry(
        `SELECT id FROM email_logs 
         WHERE sale_id = ? 
           AND email_type = ? 
           AND DATE(sent_at) = ?
         LIMIT 1`,
        [saleId, emailType, today]
    );
    return result.rows.length > 0;
}

// ✅ Registrar envío
async function logEmail(
    saleId: string,
    emailType: string,
    recipient: string,
    status: string,
    errorMessage?: string
): Promise<void> {
    const id = Math.random().toString(36).substring(2, 15);
    await executeWithRetry(
        `INSERT INTO email_logs 
         (id, sale_id, email_type, recipient, status, error_message, sent_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            saleId,
            emailType,
            recipient,
            status,
            errorMessage || null,
            new Date().toISOString(),
        ]
    );
}

// ============================================
// ✅ CORREO DE CONFIRMACIÓN INMEDIATO
// Se envía justo cuando se crea una venta
// ============================================
export async function sendConfirmationEmail(saleId: string): Promise<void> {
    try {
        const emailService = container.resolve(EmailService);

        // Obtener la venta
        const saleResult = await executeWithRetry(
            `SELECT 
                s.id,
                s.sale_number,
                s.customer_id,
                s.customer_name_optional,
                s.total,
                s.total_paid,
                s.balance_due,
                s.next_payment_date,
                s.notification_days_before,
                c.name as customer_name,
                c.email as customer_email
             FROM sales s
             LEFT JOIN customers c ON s.customer_id = c.id
             WHERE s.id = ?`,
            [saleId]
        );

        if (saleResult.rows.length === 0) {
            console.log(`⚠️ Venta ${saleId} no encontrada`);
            return;
        }

        const sale = saleResult.rows[0] as unknown as SaleForEmail;

        // Solo enviamos si tiene email
        if (!sale.customer_email) {
            console.log(`⏭️  Venta ${sale.sale_number} sin email. No se envía confirmación.`);
            return;
        }

        // Verificar si ya se envió confirmación
        const alreadySent = await executeWithRetry(
            `SELECT id FROM email_logs 
             WHERE sale_id = ? AND email_type = 'CONFIRMACION'
             LIMIT 1`,
            [saleId]
        );

        if (alreadySent.rows.length > 0) {
            console.log(`⏭️  Confirmación ya enviada para ${sale.sale_number}`);
            return;
        }

        // Obtener items
        const itemsResult = await executeWithRetry(
            `SELECT product_name, quantity, unit_price, total
             FROM sale_items 
             WHERE sale_id = ?
             ORDER BY product_name ASC`,
            [saleId]
        );

        const items = itemsResult.rows.map((row: Record<string, unknown>) => ({
            name: String(row.product_name || "Producto"),
            quantity: Number(row.quantity) || 0,
            unitPrice: Number(row.unit_price) || 0,
            total: Number(row.total) || 0,
        }));

        const customerName = sale.customer_name || sale.customer_name_optional || "Cliente";
        const days = sale.next_payment_date ? daysUntil(sale.next_payment_date) : 0;

        const html = confirmationTemplate({
            customerName,
            saleNumber: sale.sale_number,
            total: Number(sale.total),
            totalPaid: Number(sale.total_paid),
            balanceDue: Number(sale.balance_due),
            nextPaymentDate: sale.next_payment_date || "Por definir",
            items,
            daysRemaining: days || 0,
        });

        const success = await emailService.sendEmail(
            sale.customer_email,
            `🎉 Confirmación de compra - ${sale.sale_number}`,
            html
        );

        await logEmail(
            sale.id,
            "CONFIRMACION",
            sale.customer_email,
            success ? "ENVIADO" : "FALLIDO"
        );

        if (success) {
            console.log(`✅ Confirmación enviada a ${sale.customer_email}`);
        }
    } catch (error) {
        console.error("❌ Error al enviar confirmación:", error);
    }
}

// ============================================
// ✅ PROCESO PRINCIPAL (RECORDATORIOS Y VENCIDOS)
// ============================================
export async function processEmailNotifications(): Promise<void> {
    try {
        const emailService = container.resolve(EmailService);

        const result = await executeWithRetry(
            `SELECT 
                s.id,
                s.sale_number,
                s.customer_id,
                s.customer_name_optional,
                s.total,
                s.total_paid,
                s.balance_due,
                s.next_payment_date,
                s.notification_days_before,
                c.name as customer_name,
                c.email as customer_email
             FROM sales s
             LEFT JOIN customers c ON s.customer_id = c.id
             WHERE s.balance_due > 0 
               AND s.status != 'CANCELADA'
               AND s.next_payment_date IS NOT NULL
               AND s.payment_status = 'PENDIENTE'`,
            []
        );

        const sales = result.rows as unknown as SaleForEmail[];

        if (sales.length === 0) {
            console.log("📭 No hay ventas pendientes para notificar");
            return;
        }

        console.log(`📧 Procesando ${sales.length} ventas pendientes...`);

        for (const sale of sales) {
            // Obtener productos de esta venta
            const itemsResult = await executeWithRetry(
                `SELECT product_name, quantity, unit_price, total
                 FROM sale_items 
                 WHERE sale_id = ?
                 ORDER BY product_name ASC`,
                [sale.id]
            );

            const items = itemsResult.rows.map((row: Record<string, unknown>) => ({
                name: String(row.product_name || "Producto"),
                quantity: Number(row.quantity) || 0,
                unitPrice: Number(row.unit_price) || 0,
                total: Number(row.total) || 0,
            }));

            if (!sale.customer_email) {
                continue;
            }

            const days = daysUntil(sale.next_payment_date);
            if (days === null) continue;

            const daysBefore = Number(sale.notification_days_before) || 3;
            const customerName = sale.customer_name || sale.customer_name_optional || "Cliente";

            // CASO 1: Próximo a vencer
            if (days >= 0 && days <= daysBefore) {
                const emailType = `RECORDATORIO_D${days}`;

                if (await alreadySentToday(sale.id, emailType)) {
                    console.log(`⏭️  Correo ya enviado hoy a ${sale.customer_email} para ${sale.sale_number}`);
                    continue;
                }

                const html = reminderTemplate({
                    customerName,
                    saleNumber: sale.sale_number,
                    total: Number(sale.total),
                    totalPaid: Number(sale.total_paid),
                    balanceDue: Number(sale.balance_due),
                    nextPaymentDate: sale.next_payment_date!,
                    items,
                    daysRemaining: days,
                });

                const success = await emailService.sendEmail(
                    sale.customer_email,
                    `📅 Recordatorio de pago - ${sale.sale_number}`,
                    html
                );

                await logEmail(
                    sale.id,
                    emailType,
                    sale.customer_email,
                    success ? "ENVIADO" : "FALLIDO"
                );
            }

            // CASO 2: Vencido
            if (days < 0) {
                const emailType = `VENCIDO`;

                if (await alreadySentToday(sale.id, emailType)) {
                    continue;
                }

                const html = overdueTemplate({
                    customerName,
                    saleNumber: sale.sale_number,
                    total: Number(sale.total),
                    totalPaid: Number(sale.total_paid),
                    balanceDue: Number(sale.balance_due),
                    nextPaymentDate: sale.next_payment_date!,
                    items,
                    daysRemaining: days,
                });

                const success = await emailService.sendEmail(
                    sale.customer_email,
                    `⚠️ Pago vencido - ${sale.sale_number}`,
                    html
                );

                await logEmail(
                    sale.id,
                    emailType,
                    sale.customer_email,
                    success ? "ENVIADO" : "FALLIDO"
                );
            }
        }

        console.log("✅ Proceso de notificaciones completado");
    } catch (error) {
        console.error("❌ Error en el scheduler de emails:", error);
    }
}

// ============================================
// ✅ ARRANCAR EL SCHEDULER
// ============================================
export function startEmailScheduler(): void {
    const emailService = container.resolve(EmailService);
    emailService.verifyConnection();

    // ✅ Intervalo dinámico según entorno
    const isProduction = process.env.NODE_ENV === "production";
    const INTERVAL_MS = isProduction
        ? 15 * 60 * 1000   // 15 minutos en producción
        : 60 * 1000;       // 1 minuto en desarrollo/demo

    const intervalLabel = isProduction ? "15 minutos" : "1 minuto";

    // Ejecutar al arrancar (después de 10 segundos)
    setTimeout(() => {
        console.log("🔍 Ejecutando verificación inicial de correos...");
        processEmailNotifications();
    }, 10000);

    // Ejecutar periódicamente
    setInterval(() => {
        console.log(`⏰ Ejecutando verificación (cada ${intervalLabel})...`);
        processEmailNotifications();
    }, INTERVAL_MS);

    console.log(`📧 Scheduler de emails activado (cada ${intervalLabel})`);
    console.log(`   🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
}