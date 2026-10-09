import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IPayrollService } from "../../Application/interfaces/payroll.service.interface";

@injectable()
export class PayrollController {
    constructor(@inject("IPayrollService") private service: IPayrollService) {}

    getAll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 100;
            const result = await this.service.findAll(page, pageSize);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener planilla" });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.service.findById(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener registro" });
        }
    };

    getByEmployeeId = async (req: Request, res: Response) => {
        try {
            const employeeId = req.params.employeeId as string;
            const result = await this.service.findByEmployeeId(employeeId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener historial" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const result = await this.service.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error en create payroll:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Error al crear planilla"
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar" });
        }
    };
}