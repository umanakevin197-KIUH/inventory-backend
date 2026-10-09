import { inject, injectable } from "tsyringe";
import { IProduct_variantsService } from "../interfaces/product_variants.service.interface";
import { IProduct_variantsRepository } from "../../Domain/repositories/product_variantsRepository.interface";
import { Product_variantsDto } from "../dtos/product_variants.dto";
import Product_variants from "../../Domain/entities/product_variants";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class Product_variantsService implements IProduct_variantsService {
  private readonly _product_variantsRepository: IProduct_variantsRepository;

  constructor(@inject("IProduct_variantsRepository") repository: IProduct_variantsRepository) {
    this._product_variantsRepository = repository;
  }
  
  async findAll(page: number = 1, pageSize: number = 100): Promise<Product_variants[]> {
    return await this._product_variantsRepository.findAll(page, pageSize);
  }
  
  async findById(id: string) : Promise<Product_variants | null> {
    return await this._product_variantsRepository.findById(id);
  }
  
  async create(data: Product_variantsDto): Promise<Product_variants> {
    const newData: Product_variants = {
      ...data,
      id: generateId(), 
    }
    await this._product_variantsRepository.create(newData);
    return newData;
  }

  async update(id: string, data: Product_variantsDto): Promise<Product_variants | null> {
    const existing = await this._product_variantsRepository.findById(id);
    if (!existing) {
      return null;
    }

    const newData: Product_variants = {
      ...data,
      id,
    }
    await this._product_variantsRepository.update(newData);
    return newData;
  }

  async delete(id: string) : Promise<void> {
    const existing = await this._product_variantsRepository.findById(id);
    if (!existing) {
      return ;
    }
    return await this._product_variantsRepository.delete(existing);
  }
}
