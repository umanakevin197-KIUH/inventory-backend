import Product_variants from "../../Domain/entities/product_variants";
import { Product_variantsDto } from './../dtos/product_variants.dto';

export interface IProduct_variantsService {
  findAll(page: number, pageSize: number): Promise<Product_variants[]>;
  findById(id: string): Promise<Product_variants | null>;
  create(data: Product_variantsDto): Promise<Product_variants>;
  update(id: string, data: Product_variantsDto): Promise<Product_variants | null>;
  delete(id: string): Promise<void>;
}
