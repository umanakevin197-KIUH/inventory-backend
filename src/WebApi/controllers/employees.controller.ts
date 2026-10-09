import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IEmployeesService } from "../../Application/interfaces/employees.service.interface";

@injectable()
export class EmployeesController {
    constructor(@inject("IEmployeesService") private service: IEmployeesService) {}

    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 100;
            const result = await this.service.findAll(page, pageSize);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener empleados" });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.service.findById(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener empleado" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const result = await this.service.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al crear empleado" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.service.update(id, req.body);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar empleado" });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar empleado" });
        }
    };
}