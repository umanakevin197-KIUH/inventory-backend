import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ISalesService } from "../../Application/interfaces/sales.service.interface";

@injectable()
export class SalesController {
    constructor(@inject("ISalesService") private service: ISalesService) {}

    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 100;
            const result = await this.service.findAll(page, pageSize);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener ventas" });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.service.findById(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener venta" });
        }
    };

    getPendingCredits = async (req: Request, res: Response) => {
        try {
            const result = await this.service.findPendingCredits();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener créditos pendientes" });
        }
    };

    getOverdueCredits = async (req: Request, res: Response) => {
        try {
            const result = await this.service.findOverdueCredits();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener créditos vencidos" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const result = await this.service.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error en create sale:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Error al crear venta"
            });
        }
    };

    registerPayment = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.service.registerPayment(id);
            res.json(result);
        } catch (error) {
            console.error("Error en registerPayment:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Error al registrar pago"
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar venta" });
        }
    };
}