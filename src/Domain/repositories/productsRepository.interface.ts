import Products from '../entities/products';

export interface IProductsRepository {
  findAll(page: number, pageSize: number): Promise<Products[]>;
  findById(id: string): Promise<Products | null>;
  create(data: Products): Promise<void>;
  update(data: Products): Promise<void>;
  delete(data: Products): Promise<void>;
}
