import { inject, injectable } from "tsyringe";
import { ISuppliersService } from "../interfaces/suppliers.service.interface";
import { ISuppliersRepository } from "../../Domain/repositories/suppliersRepository.interface";
import { SuppliersDto } from "../dtos/suppliers.dto";
import Suppliers from "../../Domain/entities/suppliers";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class SuppliersService implements ISuppliersService {
    private readonly _suppliersRepository: ISuppliersRepository;

    constructor(@inject("ISuppliersRepository") repository: ISuppliersRepository) {
        this._suppliersRepository = repository;
    }

    async findAll(page: number = 1, pageSize: number = 100): Promise<Suppliers[]> {
        return await this._suppliersRepository.findAll(page, pageSize);
    }

    async findById(id: string): Promise<Suppliers | null> {
        return await this._suppliersRepository.findById(id);
    }

    async create(data: SuppliersDto): Promise<Suppliers> {
        const newData: Suppliers = {
            ...data,
            id: generateId(),
            status: data.status ?? true,
            rating: data.rating ?? 5,
            created_at: new Date().toISOString(),
        };
        await this._suppliersRepository.create(newData);
        return newData;
    }

    async update(id: string, data: SuppliersDto): Promise<Suppliers | null> {
        const existing = await this._suppliersRepository.findById(id);
        if (!existing) return null;

        const newData: Suppliers = {
            ...existing,
            ...data,
            id,
            updated_at: new Date().toISOString(),
        };
        await this._suppliersRepository.update(newData);
        return newData;
    }

    async delete(id: string): Promise<void> {
        const existing = await this._suppliersRepository.findById(id);
        if (!existing) return;
        return await this._suppliersRepository.delete(id);
    }
}