import { inject, injectable } from "tsyringe";
import { ISubcategoriesService } from "../interfaces/subcategories.service.interface";
import { ISubcategoriesRepository } from "../../Domain/repositories/subcategoriesRepository.interface";
import { SubcategoriesDto } from "../dtos/subcategories.dto";
import Subcategories from "../../Domain/entities/subcategories";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class SubcategoriesService implements ISubcategoriesService {
  private readonly _subcategoriesRepository: ISubcategoriesRepository;

  constructor(@inject("ISubcategoriesRepository") repository: ISubcategoriesRepository) {
    this._subcategoriesRepository = repository;
  }
  
  async findAll(page: number = 1, pageSize: number = 100): Promise<Subcategories[]> {
    return await this._subcategoriesRepository.findAll(page, pageSize);
  }
  
  async findById(id: string) : Promise<Subcategories | null> {
    return await this._subcategoriesRepository.findById(id);
  }


  
  async create(data: SubcategoriesDto): Promise<Subcategories> {
    const newData: Subcategories = {
      ...data,
      status: true,
      id: generateId(), 
    }
    await this._subcategoriesRepository.create(newData);
    return newData;
  }

  async update(id: string, data: SubcategoriesDto): Promise<Subcategories | null> {
    const existing = await this._subcategoriesRepository.findById(id);
    if (!existing) {
      return null;
    }

    const updatedSubcategory: Subcategories = {
      ...existing,
      ...data,
      id: existing.id,
    }
    await this._subcategoriesRepository.update(updatedSubcategory);
    return updatedSubcategory;
  }

  async delete(id: string) : Promise<void> {
    const existing = await this._subcategoriesRepository.findById(id);
    if (!existing) {
      return ;
    }
    return await this._subcategoriesRepository.delete(existing);
  }

  findByCategory = async (
    categoryId: string
    ) => {

      return await this
      ._subcategoriesRepository
      .findByCategory(categoryId);
    };
}
