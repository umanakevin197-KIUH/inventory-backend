import Subcategories from '../entities/subcategories';

export interface ISubcategoriesRepository {
  findAll(page: number, pageSize: number): Promise<Subcategories[]>;
  findById(id: string): Promise<Subcategories | null>;
  findByCategory(categoryId: string): Promise<any>;
  create(data: Subcategories): Promise<void>;
  update(data: Subcategories): Promise<void>;
  delete(data: Subcategories): Promise<void>;
}
