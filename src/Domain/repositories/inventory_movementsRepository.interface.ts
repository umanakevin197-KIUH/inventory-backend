import inventory_movements from '../entities/inventory_movements';

export interface Iinventory_movementsRepository {
  findAll(page: number, pageSize: number): Promise<inventory_movements[]>;
  findById(id: string): Promise<inventory_movements | null>;
  create(data: inventory_movements): Promise<void>;
  update(data: inventory_movements): Promise<void>;
  delete(data: inventory_movements): Promise<void>;
}
