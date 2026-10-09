import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IInvoicesService } from "../../Application/interfaces/invoices.service.interface";

@injectable()
export class InvoicesController {
    constructor(@inject("IInvoicesService") private service: IInvoicesService) {}

    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 100;
            const result = await this.service.findAll(page, pageSize);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener facturas" });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.service.findById(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener factura" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const result = await this.service.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error en create invoice:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Error al crear factura"
            });
        }
    };

    cancel = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const { reason } = req.body;
            const result = await this.service.cancel(id, reason || "Sin motivo especificado");
            res.json(result);
        } catch (error) {
            console.error("Error en cancel invoice:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Error al anular factura"
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar factura" });
        }
    };
}