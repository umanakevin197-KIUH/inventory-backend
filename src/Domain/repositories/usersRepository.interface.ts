import Users from '../entities/users';

export interface IUsersRepository {
  findAll(page: number, pageSize: number): Promise<Users[]>;
  findById(id: string): Promise<Users | null>;
  create(data: Users): Promise<void>;
  update(data: Users): Promise<void>;
  delete(data: Users): Promise<void>;
}
