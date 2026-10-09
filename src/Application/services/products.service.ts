import { inject, injectable } from "tsyringe";
import { IProductsService } from "../interfaces/products.service.interface";
import { IProductsRepository } from "../../Domain/repositories/productsRepository.interface";
import { ProductsDto } from "../dtos/products.dto";
import Products from "../../Domain/entities/products";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class ProductsService implements IProductsService {
  private readonly _productsRepository: IProductsRepository;

  constructor(@inject("IProductsRepository") repository: IProductsRepository) {
    this._productsRepository = repository;
  }
  
  async findAll(page: number = 1, pageSize: number = 100): Promise<Products[]> {
    return await this._productsRepository.findAll(page, pageSize);
  }
  
  async findById(id: string) : Promise<Products | null> {
    return await this._productsRepository.findById(id);
  }
  
  async create(data: ProductsDto): Promise<Products> {
    const newData: Products = {
      ...data,
      id: generateId(), 
    }
    await this._productsRepository.create(newData);
    return newData;
  }

  async update(id: string, data: ProductsDto): Promise<Products | null> {
    const existing = await this._productsRepository.findById(id);
    if (!existing) {
      return null;
    }

    const newData: Products = {
      ...data,
      id,
    }
    await this._productsRepository.update(newData);
    return newData;
  }

  async delete(id: string) : Promise<void> {
    const existing = await this._productsRepository.findById(id);
    if (!existing) {
      return ;
    }
    return await this._productsRepository.delete(existing);
  }
}
