interface EmailItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface EmailData {
    customerName: string;
    saleNumber: string;
    total: number;
    totalPaid: number;
    balanceDue: number;
    nextPaymentDate: string;
    items: EmailItem[];
    daysRemaining: number;
}

// ✅ Función para renderizar los productos
function renderItems(items: EmailItem[]): string {
    if (!items || items.length === 0) {
        return `<p style="color: #a0a0a0; font-size: 13px; text-align: center;">Sin productos registrados</p>`;
    }

    return items
        .map(
            (item) => `
        <div class="item-row">
            <div class="item-name">
                <strong>${item.name}</strong>
                <span class="item-detail">${item.quantity} × C$ ${item.unitPrice.toFixed(2)}</span>
            </div>
            <div class="item-total">C$ ${item.total.toFixed(2)}</div>
        </div>
    `
        )
        .join("");
}

// ✅ Plantilla: Confirmación de compra (INMEDIATO al crear la venta)
export function confirmationTemplate(data: EmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background: #0f0f1a; color: #fff; padding: 20px; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 20px; padding: 30px; border: 2px solid rgba(59,130,246,0.3); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 48px; margin-bottom: 10px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #3B82F6; }
            .subtitle { color: #a0a0a0; font-size: 14px; }
            .success { color: #3B82F6; font-size: 16px; font-weight: bold; text-align: center; padding: 20px; background: rgba(59,130,246,0.1); border-radius: 12px; margin: 20px 0; border: 1px solid rgba(59,130,246,0.3); }
            .card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .row:last-child { border-bottom: none; }
            .label { color: #a0a0a0; font-size: 14px; }
            .value { color: #fff; font-weight: bold; font-size: 14px; }
            .section-title { color: #3B82F6; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-top: 20px; }
            .item-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px; border-left: 3px solid #3B82F6; }
            .item-name { display: flex; flex-direction: column; gap: 3px; }
            .item-name strong { color: #fff; font-size: 14px; }
            .item-detail { color: #a0a0a0; font-size: 12px; }
            .item-total { color: #22C55E; font-weight: bold; font-size: 14px; white-space: nowrap; margin-left: 12px; }
            .highlight { color: #FBBF24; font-size: 16px; font-weight: bold; text-align: center; padding: 15px; background: rgba(251,191,36,0.1); border-radius: 12px; margin: 20px 0; border: 1px solid rgba(251,191,36,0.3); }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎉</div>
                <div class="title">¡Compra Registrada!</div>
                <div class="subtitle">Jesús es mi Pastor</div>
            </div>

            <p>Hola <strong>${data.customerName}</strong>,</p>

            <div class="success">
                ✅ Tu compra ha sido registrada exitosamente
            </div>

            <p>Gracias por tu preferencia. Aquí está el resumen de tu compra:</p>

            <div class="section-title">📦 Productos Adquiridos</div>
            ${renderItems(data.items)}

            <div class="card" style="margin-top: 20px;">
                <div class="row">
                    <span class="label">Número de venta</span>
                    <span class="value">${data.saleNumber}</span>
                </div>
                <div class="row">
                    <span class="label">Total de la compra</span>
                    <span class="value">C$ ${data.total.toFixed(2)}</span>
                </div>
                <div class="row">
                    <span class="label">Total abonado</span>
                    <span class="value" style="color: #22C55E;">C$ ${data.totalPaid.toFixed(2)}</span>
                </div>
                <div class="row">
                    <span class="label">Saldo pendiente</span>
                    <span class="value" style="color: #FBBF24; font-size: 16px;">C$ ${data.balanceDue.toFixed(2)}</span>
                </div>
            </div>

            <div class="highlight">
                📅 Próximo pago: ${data.nextPaymentDate}
            </div>

            <p style="color: #a0a0a0; font-size: 13px; text-align: center;">
                Te enviaremos un recordatorio cuando se acerque la fecha de tu pago.
            </p>

            <div class="footer">
                <p><strong>Jesús es mi Pastor</strong></p>
                <p>Este es un mensaje automático, por favor no responder.</p>
                <p>Powered by InventoryX</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// ✅ Plantilla: Recordatorio (faltan X días)
export function reminderTemplate(data: EmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background: #0f0f1a; color: #fff; padding: 20px; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 20px; padding: 30px; border: 1px solid rgba(255,255,255,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #3B82F6; margin-bottom: 10px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: #a0a0a0; font-size: 14px; }
            .card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .row:last-child { border-bottom: none; }
            .label { color: #a0a0a0; font-size: 14px; }
            .value { color: #fff; font-weight: bold; font-size: 14px; }
            .highlight { color: #FBBF24; font-size: 18px; font-weight: bold; text-align: center; padding: 15px; background: rgba(251,191,36,0.1); border-radius: 12px; margin: 20px 0; }
            .section-title { color: #3B82F6; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-top: 20px; }
            .item-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px; border-left: 3px solid #3B82F6; }
            .item-name { display: flex; flex-direction: column; gap: 3px; }
            .item-name strong { color: #fff; font-size: 14px; }
            .item-detail { color: #a0a0a0; font-size: 12px; }
            .item-total { color: #22C55E; font-weight: bold; font-size: 14px; white-space: nowrap; margin-left: 12px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🛒 InventoryX</div>
                <div class="title">Recordatorio de Pago</div>
                <div class="subtitle">Jesús es mi Pastor</div>
            </div>

            <p>Hola <strong>${data.customerName}</strong>,</p>

            <p>Te recordamos que se acerca la fecha de tu próximo abono:</p>

            <div class="highlight">
                📅 ${data.nextPaymentDate}
            </div>

            <div class="section-title">📦 Productos Adquiridos</div>
            ${renderItems(data.items)}

            <div class="card" style="margin-top: 20px;">
                <div class="row">
                    <span class="label">Número de venta</span>
                    <span class="value">${data.saleNumber}</span>
                </div>
                <div class="row">
                    <span class="label">Total de la compra</span>
                    <span class="value">C$ ${data.total.toFixed(2)}</span>
                </div>
                <div class="row">
                    <span class="label">Total abonado</span>
                    <span class="value" style="color: #22C55E;">C$ ${data.totalPaid.toFixed(2)}</span>
                </div>
                <div class="row">
                    <span class="label">Saldo pendiente</span>
                    <span class="value" style="color: #FBBF24; font-size: 16px;">C$ ${data.balanceDue.toFixed(2)}</span>
                </div>
            </div>

            <p style="color: #a0a0a0; font-size: 14px;">
                ${data.daysRemaining === 0
                    ? "⏰ <strong>Tu pago vence HOY</strong>"
                    : `⏰ Faltan <strong>${data.daysRemaining} días</strong> para tu pago`
                }
            </p>

            <p style="color: #a0a0a0; font-size: 12px; margin-top: 20px;">
                Por favor acércate a la tienda para realizar tu abono.
            </p>

            <div class="footer">
                <p><strong>Jesús es mi Pastor</strong></p>
                <p>Este es un mensaje automático, por favor no responder.</p>
                <p>Powered by InventoryX</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// ✅ Plantilla: Vencido
export function overdueTemplate(data: EmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background: #0f0f1a; color: #fff; padding: 20px; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 20px; padding: 30px; border: 2px solid rgba(239,68,68,0.3); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #EF4444; margin-bottom: 10px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #EF4444; }
            .card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .row:last-child { border-bottom: none; }
            .label { color: #a0a0a0; font-size: 14px; }
            .value { color: #fff; font-weight: bold; font-size: 14px; }
            .alert { color: #EF4444; font-size: 18px; font-weight: bold; text-align: center; padding: 15px; background: rgba(239,68,68,0.1); border-radius: 12px; margin: 20px 0; border: 1px solid rgba(239,68,68,0.3); }
            .section-title { color: #EF4444; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-top: 20px; }
            .item-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px; border-left: 3px solid #EF4444; }
            .item-name { display: flex; flex-direction: column; gap: 3px; }
            .item-name strong { color: #fff; font-size: 14px; }
            .item-detail { color: #a0a0a0; font-size: 12px; }
            .item-total { color: #22C55E; font-weight: bold; font-size: 14px; white-space: nowrap; margin-left: 12px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">⚠️</div>
                <div class="title">Pago Vencido</div>
                <div style="color: #a0a0a0;">Jesús es mi Pastor</div>
            </div>

            <p>Hola <strong>${data.customerName}</strong>,</p>

            <div class="alert">
                ⚠️ Tu pago está VENCIDO hace ${Math.abs(data.daysRemaining)} días
            </div>

            <p>Te recordamos que tienes un saldo pendiente con nosotros:</p>

            <div class="section-title">📦 Productos Adquiridos</div>
            ${renderItems(data.items)}

            <div class="card" style="margin-top: 20px;">
                <div class="row">
                    <span class="label">Número de venta</span>
                    <span class="value">${data.saleNumber}</span>
                </div>
                <div class="row">
                    <span class="label">Fecha de vencimiento</span>
                    <span class="value" style="color: #EF4444;">${data.nextPaymentDate}</span>
                </div>
                <div class="row">
                    <span class="label">Total de la compra</span>
                    <span class="value">C$ ${data.total.toFixed(2)}</span>
                </div>
                <div class="row">
                    <span class="label">Total abonado</span>
                    <span class="value" style="color: #22C55E;">C$ ${data.totalPaid.toFixed(2)}</span>
                </div>
                <div class="row">
                    <span class="label">Saldo pendiente</span>
                    <span class="value" style="color: #EF4444; font-size: 16px;">C$ ${data.balanceDue.toFixed(2)}</span>
                </div>
            </div>

            <p style="color: #a0a0a0; font-size: 14px;">
                Por favor acércate a la tienda lo antes posible para regularizar tu pago.
            </p>

            <div class="footer">
                <p><strong>Jesús es mi Pastor</strong></p>
                <p>Este es un mensaje automático, por favor no responder.</p>
                <p>Powered by InventoryX</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// ✅ Plantilla: Pago completado
export function completedTemplate(data: EmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background: #0f0f1a; color: #fff; padding: 20px; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 20px; padding: 30px; border: 2px solid rgba(34,197,94,0.3); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 48px; margin-bottom: 10px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #22C55E; }
            .card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; }
            .label { color: #a0a0a0; font-size: 14px; }
            .value { color: #fff; font-weight: bold; font-size: 14px; }
            .success { color: #22C55E; font-size: 18px; font-weight: bold; text-align: center; padding: 20px; background: rgba(34,197,94,0.1); border-radius: 12px; margin: 20px 0; border: 1px solid rgba(34,197,94,0.3); }
            .section-title { color: #22C55E; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-top: 20px; }
            .item-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px; border-left: 3px solid #22C55E; }
            .item-name { display: flex; flex-direction: column; gap: 3px; }
            .item-name strong { color: #fff; font-size: 14px; }
            .item-detail { color: #a0a0a0; font-size: 12px; }
            .item-total { color: #22C55E; font-weight: bold; font-size: 14px; white-space: nowrap; margin-left: 12px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">✅</div>
                <div class="title">¡Pago Completado!</div>
                <div style="color: #a0a0a0;">Jesús es mi Pastor</div>
            </div>

            <p>Hola <strong>${data.customerName}</strong>,</p>

            <div class="success">
                🎉 Tu pago ha sido completado exitosamente
            </div>

            <p>Gracias por tu preferencia. Aquí está el resumen:</p>

            <div class="section-title">📦 Productos Adquiridos</div>
            ${renderItems(data.items)}

            <div class="card" style="margin-top: 20px;">
                <div class="row">
                    <span class="label">Número de venta</span>
                    <span class="value">${data.saleNumber}</span>
                </div>
                <div class="row">
                    <span class="label">Total de la compra</span>
                    <span class="value">C$ ${data.total.toFixed(2)}</span>
                </div>
                <div class="row">
                    <span class="label">Total pagado</span>
                    <span class="value" style="color: #22C55E;">C$ ${data.totalPaid.toFixed(2)}</span>
                </div>
                <div class="row">
                    <span class="label">Saldo pendiente</span>
                    <span class="value" style="color: #22C55E; font-size: 16px;">C$ 0.00</span>
                </div>
            </div>

            <p style="color: #a0a0a0; font-size: 14px; text-align: center;">
                ¡Esperamos verte pronto! 🌟
            </p>

            <div class="footer">
                <p><strong>Jesús es mi Pastor</strong></p>
                <p>Este es un mensaje automático, por favor no responder.</p>
                <p>Powered by InventoryX</p>
            </div>
        </div>
    </body>
    </html>
    `;
}