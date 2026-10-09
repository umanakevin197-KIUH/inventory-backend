import Categories from '../entities/categories';

export interface ICategoriesRepository {
  findAll(page: number, pageSize: number): Promise<Categories[]>;
  findById(id: string): Promise<Categories | null>;
  create(data: Categories): Promise<void>;
  update(data: Categories): Promise<void>;
  delete(data: Categories): Promise<void>;
}
