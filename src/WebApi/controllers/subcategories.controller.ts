import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ISubcategoriesService } from './../../Application/interfaces/subcategories.service.interface';

@injectable()
export class SubcategoriesController {

  private readonly _subcategoriesService: ISubcategoriesService;

  constructor(@inject("ISubcategoriesService") service: ISubcategoriesService) {
    this._subcategoriesService = service;
  }

  getAll= async (req: Request, res: Response)=> {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 100;
    const result = await this._subcategoriesService.findAll(page, pageSize);
    res.json(result);
  }

  getByCategory = async (
    req: Request,
    res: Response
    ) => {
      const categoryId =
      req.params.id as string;

      const result =
        await this._subcategoriesService
         .findByCategory(categoryId);

      res.json(result);
    };

  create= async (req: Request, res: Response)=> {
    const result = await this._subcategoriesService.create(req.body);
    res.status(201).json(result);
  }

  getById= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._subcategoriesService.findById(id);
    res.json(result);
  }

  update= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._subcategoriesService.update(id, req.body);
    res.json(result);
  }

  delete= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    await this._subcategoriesService.delete(id);
    res.status(204).send();
  }
}
