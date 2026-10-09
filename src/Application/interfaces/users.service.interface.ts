import Users from "../../Domain/entities/users";
import { UsersDto } from './../dtos/users.dto';

export interface IUsersService {
  findAll(page: number, pageSize: number): Promise<Users[]>;
  findById(id: string): Promise<Users | null>;
  create(data: UsersDto): Promise<Users>;
  update(id: string, data: UsersDto): Promise<Users | null>;
  delete(id: string): Promise<void>;
  resetPassword(id: string): Promise<string>;
}
