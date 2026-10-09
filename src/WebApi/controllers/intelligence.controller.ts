import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IIntelligenceService } from "../../Application/interfaces/intelligence.service.interface";

@injectable()
export class IntelligenceController {
    constructor(@inject("IIntelligenceService") private service: IIntelligenceService) {}

    getABC = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getABCAnalysis();
            res.json(result);
        } catch (error) {
            console.error("Error en getABC:", error);
            res.status(500).json({ error: "Error al generar análisis ABC" });
        }
    };

    getEOQ = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getEOQAnalysis();
            res.json(result);
        } catch (error) {
            console.error("Error en getEOQ:", error);
            res.status(500).json({ error: "Error al generar análisis EOQ" });
        }
    };

    getProfitability = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getProfitability();
            res.json(result);
        } catch (error) {
            console.error("Error en getProfitability:", error);
            res.status(500).json({ error: "Error al generar análisis de rentabilidad" });
        }
    };
}