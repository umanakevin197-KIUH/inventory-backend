import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ISuppliersService } from "../../Application/interfaces/suppliers.service.interface";

@injectable()
export class SuppliersController {
    private readonly _suppliersService: ISuppliersService;

    constructor(@inject("ISuppliersService") service: ISuppliersService) {
        this._suppliersService = service;
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 100;
            const result = await this._suppliersService.findAll(page, pageSize);
            res.json(result);
        } catch (error) {
            console.error("Error en getAll suppliers:", error);
            res.status(500).json({ error: "Error al obtener proveedores" });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this._suppliersService.findById(id);
            res.json(result);
        } catch (error) {
            console.error("Error en getById supplier:", error);
            res.status(500).json({ error: "Error al obtener proveedor" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const result = await this._suppliersService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error en create supplier:", error);
            res.status(500).json({ error: "Error al crear proveedor" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this._suppliersService.update(id, req.body);
            res.json(result);
        } catch (error) {
            console.error("Error en update supplier:", error);
            res.status(500).json({ error: "Error al actualizar proveedor" });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this._suppliersService.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error("Error en delete supplier:", error);
            res.status(500).json({ error: "Error al eliminar proveedor" });
        }
    };
}