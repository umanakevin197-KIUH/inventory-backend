import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IPurchasesService } from "../../Application/interfaces/purchases.service.interface";

@injectable()
export class PurchasesController {
    private readonly _purchasesService: IPurchasesService;

    constructor(@inject("IPurchasesService") service: IPurchasesService) {
        this._purchasesService = service;
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 100;
            const result = await this._purchasesService.findAll(page, pageSize);
            res.json(result);
        } catch (error) {
            console.error("Error en getAll purchases:", error);
            res.status(500).json({ error: "Error al obtener compras" });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this._purchasesService.findById(id);
            res.json(result);
        } catch (error) {
            console.error("Error en getById purchase:", error);
            res.status(500).json({ error: "Error al obtener compra" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const result = await this._purchasesService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error en create purchase:", error);
            res.status(500).json({ error: "Error al crear compra" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this._purchasesService.update(id, req.body);
            res.json(result);
        } catch (error) {
            console.error("Error en update purchase:", error);
            res.status(500).json({ error: "Error al actualizar compra" });
        }
    };

    receive = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this._purchasesService.receive(id);
            res.json(result);
        } catch (error) {
            console.error("Error en receive purchase:", error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Error al recibir compra" 
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this._purchasesService.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error("Error en delete purchase:", error);
            res.status(500).json({ error: "Error al eliminar compra" });
        }
    };
}