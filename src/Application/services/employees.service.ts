import { inject, injectable } from "tsyringe";
import { IEmployeesService } from "../interfaces/employees.service.interface";
import { IEmployeesRepository } from "../../Domain/repositories/employeesRepository.interface";
import { EmployeesDto } from "../dtos/employees.dto";
import Employees from "../../Domain/entities/employees";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class EmployeesService implements IEmployeesService {
    private readonly _employeesRepository: IEmployeesRepository;

    constructor(@inject("IEmployeesRepository") repository: IEmployeesRepository) {
        this._employeesRepository = repository;
    }

    async findAll(page: number = 1, pageSize: number = 100): Promise<Employees[]> {
        return await this._employeesRepository.findAll(page, pageSize);
    }

    async findById(id: string): Promise<Employees | null> {
        return await this._employeesRepository.findById(id);
    }

    async create(data: EmployeesDto): Promise<Employees> {
        const newData: Employees = {
            ...data,
            id: generateId(),
            status: data.status ?? true,
            salary: Number(data.salary) || 0,
            created_at: new Date().toISOString(),
        };
        await this._employeesRepository.create(newData);
        return newData;
    }

    async update(id: string, data: EmployeesDto): Promise<Employees | null> {
        const existing = await this._employeesRepository.findById(id);
        if (!existing) return null;

        const newData: Employees = {
            ...existing,
            ...data,
            id,
            salary: Number(data.salary) || 0,
        };
        await this._employeesRepository.update(newData);
        return newData;
    }

    async delete(id: string): Promise<void> {
        const existing = await this._employeesRepository.findById(id);
        if (!existing) return;
        return await this._employeesRepository.delete(id);
    }
}