import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IProductsService } from './../../Application/interfaces/products.service.interface';

@injectable()
export class ProductsController {

  private readonly _productsService: IProductsService;

  constructor(@inject("IProductsService") service: IProductsService) {
    this._productsService = service;
  }

  getAll= async (req: Request, res: Response)=> {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 100;
    const result = await this._productsService.findAll(page, pageSize);
    res.json(result);
  }

  create= async (req: Request, res: Response)=> {
    const result = await this._productsService.create(req.body);
    res.status(201).json(result);
  }

  getById= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._productsService.findById(id);
    res.json(result);
  }

  update= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._productsService.update(id, req.body);
    res.json(result);
  }

  delete= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    await this._productsService.delete(id);
    res.status(204).send();
  }
}
