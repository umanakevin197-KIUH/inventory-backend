import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { Iinventory_movementsService } from './../../Application/interfaces/inventory_movements.service.interface';

@injectable()
export class inventory_movementsController {

  private readonly _inventory_movementsService: Iinventory_movementsService;

  constructor(@inject("Iinventory_movementsService") service: Iinventory_movementsService) {
    this._inventory_movementsService = service;
  }

  getAll= async (req: Request, res: Response)=> {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 100;
    const result = await this._inventory_movementsService.findAll(page, pageSize);
    res.json(result);
  }

  create= async (req: Request, res: Response)=> {
    const result = await this._inventory_movementsService.create(req.body);
    res.status(201).json(result);
  }

  getById= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._inventory_movementsService.findById(id);
    res.json(result);
  }

  update= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._inventory_movementsService.update(id, req.body);
    res.json(result);
  }

  delete= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    await this._inventory_movementsService.delete(id);
    res.status(204).send();
  }
}
