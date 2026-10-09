import Product_variants from '../entities/product_variants';

export interface IProduct_variantsRepository {
  findAll(page: number, pageSize: number): Promise<Product_variants[]>;
  findById(id: string): Promise<Product_variants | null>;
  create(data: Product_variants): Promise<void>;
  update(data: Product_variants): Promise<void>;
  delete(data: Product_variants): Promise<void>;
}
