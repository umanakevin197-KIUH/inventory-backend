import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ICustomersService } from "../../Application/interfaces/customers.service.interface";

@injectable()
export class CustomersController {
    constructor(@inject("ICustomersService") private service: ICustomersService) {}

    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 100;
            const result = await this.service.findAll(page, pageSize);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener clientes" });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.service.findById(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener cliente" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const result = await this.service.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al crear cliente" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.service.update(id, req.body);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar cliente" });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar cliente" });
        }
    };
}