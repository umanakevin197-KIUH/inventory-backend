import Categories from "../../Domain/entities/categories";
import { CategoriesDto } from './../dtos/categories.dto';

export interface ICategoriesService {
  findAll(page: number, pageSize: number): Promise<Categories[]>;
  findById(id: string): Promise<Categories | null>;
  create(data: CategoriesDto): Promise<Categories>;
  update(id: string, data: CategoriesDto): Promise<Categories | null>;
  delete(id: string): Promise<void>;
}
