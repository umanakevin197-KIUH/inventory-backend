import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ICategoriesService } from './../../Application/interfaces/categories.service.interface';

@injectable()
export class CategoriesController {

  private readonly _categoriesService: ICategoriesService;

  constructor(@inject("ICategoriesService") service: ICategoriesService) {
    this._categoriesService = service;
  }

  getAll= async (req: Request, res: Response)=> {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 100;
    const result = await this._categoriesService.findAll(page, pageSize);
    res.json(result);
  }

  create= async (req: Request, res: Response)=> {
    const result = await this._categoriesService.create(req.body);
    res.status(201).json(result);
  }

  getById= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._categoriesService.findById(id);
    res.json(result);
  }

  update= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._categoriesService.update(id, req.body);
    res.json(result);
  }

  delete= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    await this._categoriesService.delete(id);
    res.status(204).send();
  }
}
