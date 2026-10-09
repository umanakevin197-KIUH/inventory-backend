import Products from "../../Domain/entities/products";
import { ProductsDto } from './../dtos/products.dto';

export interface IProductsService {
  findAll(page: number, pageSize: number): Promise<Products[]>;
  findById(id: string): Promise<Products | null>;
  create(data: ProductsDto): Promise<Products>;
  update(id: string, data: ProductsDto): Promise<Products | null>;
  delete(id: string): Promise<void>;
}
