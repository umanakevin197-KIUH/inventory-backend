import inventory_movements from "../../Domain/entities/inventory_movements";
import { inventory_movementsDto } from './../dtos/inventory_movements.dto';

export interface Iinventory_movementsService {
  findAll(page: number, pageSize: number): Promise<inventory_movements[]>;
  findById(id: string): Promise<inventory_movements | null>;
  create(data: inventory_movementsDto): Promise<inventory_movements>;
  update(id: string, data: inventory_movementsDto): Promise<inventory_movements | null>;
  delete(id: string): Promise<void>;
   findByProductId(productId: string): Promise<any[]>;
}
