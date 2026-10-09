import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IProduct_variantsService } from './../../Application/interfaces/product_variants.service.interface';

@injectable()
export class Product_variantsController {

  private readonly _product_variantsService: IProduct_variantsService;

  constructor(@inject("IProduct_variantsService") service: IProduct_variantsService) {
    this._product_variantsService = service;
  }

  getAll= async (req: Request, res: Response)=> {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 100;
    const result = await this._product_variantsService.findAll(page, pageSize);
    res.json(result);
  }

  create= async (req: Request, res: Response)=> {
    const result = await this._product_variantsService.create(req.body);
    res.status(201).json(result);
  }

  getById= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._product_variantsService.findById(id);
    res.json(result);
  }

  update= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    const result = await this._product_variantsService.update(id, req.body);
    res.json(result);
  }

  delete= async (req: Request, res: Response)=> {
    const id = req.params.id as string;
    await this._product_variantsService.delete(id);
    res.status(204).send();
  }
}
