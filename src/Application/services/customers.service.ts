import { inject, injectable } from "tsyringe";
import { ICustomersService } from "../interfaces/customers.service.interface";
import { ICustomersRepository } from "../../Domain/repositories/customersRepository.interface";
import { CustomersDto } from "../dtos/customers.dto";
import Customers from "../../Domain/entities/customers";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class CustomersService implements ICustomersService {
    private readonly _customersRepository: ICustomersRepository;

    constructor(@inject("ICustomersRepository") repository: ICustomersRepository) {
        this._customersRepository = repository;
    }

    async findAll(page: number = 1, pageSize: number = 100): Promise<Customers[]> {
        return await this._customersRepository.findAll(page, pageSize);
    }

    async findById(id: string): Promise<Customers | null> {
        return await this._customersRepository.findById(id);
    }

    async create(data: CustomersDto): Promise<Customers> {
        const newData: Customers = {
            ...data,
            id: generateId(),
            status: data.status ?? true,
            created_at: new Date().toISOString(),
        };
        await this._customersRepository.create(newData);
        return newData;
    }

    async update(id: string, data: CustomersDto): Promise<Customers | null> {
        const existing = await this._customersRepository.findById(id);
        if (!existing) return null;

        const newData: Customers = {
            ...existing,
            ...data,
            id,
        };
        await this._customersRepository.update(newData);
        return newData;
    }

    async delete(id: string): Promise<void> {
        const existing = await this._customersRepository.findById(id);
        if (!existing) return;
        return await this._customersRepository.delete(id);
    }
}