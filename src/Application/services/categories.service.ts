import { inject, injectable } from "tsyringe";
import { ICategoriesService } from "../interfaces/categories.service.interface";
import { ICategoriesRepository } from "../../Domain/repositories/categoriesRepository.interface";
import { CategoriesDto } from "../dtos/categories.dto";
import Categories from "../../Domain/entities/categories";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class CategoriesService implements ICategoriesService {
  private readonly _categoriesRepository: ICategoriesRepository;

  constructor(@inject("ICategoriesRepository") repository: ICategoriesRepository) {
    this._categoriesRepository = repository;
  }
  
  async findAll(page: number = 1, pageSize: number = 100): Promise<Categories[]> {
    return await this._categoriesRepository.findAll(page, pageSize);
  }
  
  async findById(id: string) : Promise<Categories | null> {
    return await this._categoriesRepository.findById(id);
  }
  
  async create(data: CategoriesDto): Promise<Categories> {
    const newData: Categories = {
      ...data,
      status: true,
      id: generateId(), 
    }
    await this._categoriesRepository.create(newData);
    return newData;
  }

  async update(id: string, data: CategoriesDto): Promise<Categories | null> {
    const existing = await this._categoriesRepository.findById(id);
    if (!existing) {
      return null;
    }

    const updatedCategory: Categories = {
      ...existing,
      ...data,
      id: existing.id,
    }
    await this._categoriesRepository.update(updatedCategory);
    return updatedCategory;
  }

  async delete(id: string) : Promise<void> {
    const existing = await this._categoriesRepository.findById(id);
    if (!existing) {
      return ;
    }
    return await this._categoriesRepository.delete(existing);
  }
}
