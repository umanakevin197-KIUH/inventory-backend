import { injectable } from "tsyringe";
import { ISuppliersRepository } from "../../Domain/repositories/suppliersRepository.interface";
import Suppliers from "../../Domain/entities/suppliers";
import { db } from "../database/initializeDatabase";

@injectable()
export class SuppliersRepository implements ISuppliersRepository {
    async findAll(page: number = 1, pageSize: number = 100): Promise<Suppliers[]> {
        const offset = (page - 1) * pageSize;
        const result = await db.execute({
            sql: "SELECT * FROM suppliers ORDER BY created_at DESC LIMIT ? OFFSET ?",
            args: [pageSize, offset],
        });
        return result.rows as unknown as Suppliers[];
    }

    async findById(id: string): Promise<Suppliers | null> {
        const result = await db.execute({
            sql: "SELECT * FROM suppliers WHERE id = ?",
            args: [id],
        });
        if (result.rows.length === 0) return null;
        return result.rows[0] as unknown as Suppliers;
    }

    async create(data: Suppliers): Promise<Suppliers> {
        await db.execute({
            sql: `INSERT INTO suppliers 
                  (id, name, ruc, phone, email, address, contact_name, rating, payment_terms, notes, status, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.id,
                data.name,
                data.ruc || null,
                data.phone || null,
                data.email || null,
                data.address || null,
                data.contact_name || null,
                data.rating || 5,
                data.payment_terms || null,
                data.notes || null,
                data.status ? 1 : 0,
                data.created_at,
            ],
        });
        return data;
    }

    async update(data: Suppliers): Promise<Suppliers> {
        await db.execute({
            sql: `UPDATE suppliers SET 
                    name = ?, ruc = ?, phone = ?, email = ?, 
                    address = ?, contact_name = ?, rating = ?, 
                    payment_terms = ?, notes = ?, status = ?, 
                    updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?`,
            args: [
                data.name,
                data.ruc || null,
                data.phone || null,
                data.email || null,
                data.address || null,
                data.contact_name || null,
                data.rating || 5,
                data.payment_terms || null,
                data.notes || null,
                data.status ? 1 : 0,
                data.id,
            ],
        });
        return data;
    }

    async delete(id: string): Promise<void> {
        await db.execute({
            sql: "DELETE FROM suppliers WHERE id = ?",
            args: [id],
        });
    }
}