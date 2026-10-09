import Subcategories from "../../Domain/entities/subcategories";
import { SubcategoriesDto } from './../dtos/subcategories.dto';

export interface ISubcategoriesService {
  findAll(page: number, pageSize: number): Promise<Subcategories[]>;
  findById(id: string): Promise<Subcategories | null>;
  create(data: SubcategoriesDto): Promise<Subcategories>;
  update(id: string, data: SubcategoriesDto): Promise<Subcategories | null>;
  delete(id: string): Promise<void>;
  findByCategory(categoryId: string): Promise<any>;
}
