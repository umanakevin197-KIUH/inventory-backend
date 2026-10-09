import { inject, injectable } from "tsyringe";
import { IInvoicesService } from "../interfaces/invoices.service.interface";
import { IInvoicesRepository } from "../../Domain/repositories/invoicesRepository.interface";
import { InvoicesDto } from "../dtos/invoices.dto";
import Invoices from "../../Domain/entities/invoices";
import { generateId } from "../../shared/utils/generateId";
import { db } from "../../Infrastructure/database/initializeDatabase";

@injectable()
export class InvoicesService implements IInvoicesService {
    private readonly _invoicesRepository: IInvoicesRepository;

    constructor(@inject("IInvoicesRepository") repository: IInvoicesRepository) {
        this._invoicesRepository = repository;
    }

    async findAll(page: number = 1, pageSize: number = 100): Promise<Invoices[]> {
        return await this._invoicesRepository.findAll(page, pageSize);
    }

    async findById(id: string): Promise<Invoices | null> {
        return await this._invoicesRepository.findById(id);
    }

    async create(data: InvoicesDto): Promise<Invoices> {
        // ✅ VERIFICAR QUE LA VENTA EXISTA
        const saleResult = await db.execute({
            sql: "SELECT * FROM sales WHERE id = ?",
            args: [data.sale_id],
        });

        if (saleResult.rows.length === 0) {
            throw new Error("La venta no existe");
        }

        const sale = saleResult.rows[0];

        // ✅ VERIFICAR QUE NO EXISTA FACTURA PREVIA
        const existing = await this._invoicesRepository.findBySaleId(data.sale_id);
        if (existing) {
            throw new Error("Esta venta ya tiene una factura emitida");
        }

        // ✅ GENERAR NÚMERO DE FACTURA (usando MAX en lugar de COUNT)
        const lastInvoiceResult = await db.execute(
            "SELECT invoice_number FROM invoices ORDER BY invoice_number DESC LIMIT 1"
        );

        let nextNumber = 1;

        if (lastInvoiceResult.rows.length > 0) {
            const lastNumber = lastInvoiceResult.rows[0].invoice_number as string;
            // Extraer el número de "FAC-000001" → 1
            const match = lastNumber.match(/\d+$/);
            if (match) {
                nextNumber = parseInt(match[0], 10) + 1;
            }
        }

        const invoiceNumber = `FAC-${String(nextNumber).padStart(6, "0")}`;

        console.log(`📄 Nuevo número de factura generado: ${invoiceNumber}`);

        const newInvoice: Invoices = {
            id: generateId(),
            invoice_number: invoiceNumber,
            sale_id: data.sale_id,
            customer_id: data.customer_id,
            type: data.type || "FACTURA",
            subtotal: Number(sale.subtotal) || 0,
            tax: Number(sale.tax) || 0,
            total: Number(sale.total) || 0,
            status: data.status || "EMITIDA",
            notes: data.notes,
            created_by: data.created_by,
            created_at: new Date().toISOString(),
        };

        await this._invoicesRepository.create(newInvoice);
        return newInvoice;
    }

    async cancel(id: string, reason: string): Promise<Invoices | null> {
        const invoice = await this._invoicesRepository.findById(id);
        if (!invoice) return null;

        if (invoice.status === "ANULADA") {
            throw new Error("Esta factura ya fue anulada");
        }

        await this._invoicesRepository.updateStatus(id, "ANULADA");

        // Actualizar notas con el motivo
        await db.execute({
            sql: "UPDATE invoices SET notes = ? WHERE id = ?",
            args: [`ANULADA: ${reason}`, id],
        });

        return await this._invoicesRepository.findById(id);
    }

    async delete(id: string): Promise<void> {
        const existing = await this._invoicesRepository.findById(id);
        if (!existing) return;
        return await this._invoicesRepository.delete(id);
    }
}