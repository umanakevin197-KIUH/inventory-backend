import { inject, injectable } from "tsyringe";
import { IUsersService } from "../interfaces/users.service.interface";
import { IUsersRepository } from "../../Domain/repositories/usersRepository.interface";
import { UsersDto } from "../dtos/users.dto";
import Users from "../../Domain/entities/users";
import { generateId } from "../../shared/utils/generateId";
import bcrypt from "bcryptjs";

@injectable()
export class UsersService implements IUsersService {
  private readonly _usersRepository: IUsersRepository;

  constructor(@inject("IUsersRepository") repository: IUsersRepository) {
    this._usersRepository = repository;
  }

  async findAll(page: number = 1, pageSize: number = 100): Promise<Users[]> {
    return await this._usersRepository.findAll(page, pageSize);
  }

  async findById(id: string): Promise<Users | null> {
    return await this._usersRepository.findById(id);
  }

  async create(data: UsersDto): Promise<Users> {
    const newData: Users = {
      ...data,
      id: generateId(),
    }
    await this._usersRepository.create(newData);
    return newData;
  }

  async update(id: string, data: UsersDto): Promise<Users | null> {
    const existing = await this._usersRepository.findById(id);
    if (!existing) {
      return null;
    }

    const newData: Users = {
      ...data,
      id,
    }
    await this._usersRepository.update(newData);
    return newData;
  }

  async delete(id: string): Promise<void> {
    const existing = await this._usersRepository.findById(id);
    if (!existing) {
      return;
    }
    return await this._usersRepository.delete(existing);
  }

  async resetPassword(id: string): Promise<string> {

  const user =
    await this._usersRepository.findById(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const temporaryPassword = "Empleado123";

  const hashedPassword =
    await bcrypt.hash(
      temporaryPassword,
      10
    );

  const updatedUser = {
    ...user,
    password: hashedPassword,
  };

  await this._usersRepository.update(updatedUser);

  return temporaryPassword;

}
}
