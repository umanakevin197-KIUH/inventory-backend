import { inject, injectable } from "tsyringe";
import { Iinventory_movementsService } from "../interfaces/inventory_movements.service.interface";
import { Iinventory_movementsRepository } from "../../Domain/repositories/inventory_movementsRepository.interface";
import { inventory_movementsDto } from "../dtos/inventory_movements.dto";
import inventory_movements from "../../Domain/entities/inventory_movements";
import { generateId } from "../../shared/utils/generateId";
import { IProductsRepository } from "../../Domain/repositories/productsRepository.interface";

@injectable()
export class inventory_movementsService implements Iinventory_movementsService {
  private readonly _inventory_movementsRepository: Iinventory_movementsRepository;
  private readonly _productsRepository: IProductsRepository;

  constructor(
    @inject("Iinventory_movementsRepository")
    repository: Iinventory_movementsRepository,

    @inject("IProductsRepository")
    productRepository: IProductsRepository
  ) {
    this._inventory_movementsRepository = repository;
    this._productsRepository = productRepository;
  }

  async findAll(page: number = 1, pageSize: number = 100): Promise<inventory_movements[]> {
    return await this._inventory_movementsRepository.findAll(page, pageSize);
  }

  async findById(id: string): Promise<inventory_movements | null> {
    return await this._inventory_movementsRepository.findById(id);
  }

  async findByProductId(productId: string): Promise<inventory_movements[]> {
    try {
      // Obtener todos los movimientos
      const allMovements = await this._inventory_movementsRepository.findAll(1, 1000);
      // Filtrar por product_id
      return allMovements.filter((m: inventory_movements) => m.product_id === productId);
    } catch (error) {
      console.error(`Error en findByProductId para ${productId}:`, error);
      return [];
    }
  }

  async create(
    data: inventory_movementsDto
  ): Promise<inventory_movements> {

    const product =

      await this._productsRepository.findById(

        data.product_id

      );

    if (!product) {

      throw new Error(

        "El producto no existe"

      );

    }

    const currentStock =

      Number(product.stock);

    let newStock = currentStock;

    if (

      data.movement_type === "entrada"

    ) {

      newStock += Number(data.quantity);

    }

    if (

      data.movement_type === "salida"

    ) {

      if (

        currentStock <

        Number(data.quantity)

      ) {

        throw new Error(

          "Stock insuficiente"

        );

      }

      newStock -= Number(data.quantity);

    }

    product.stock = newStock;

    await this._productsRepository.update(
      product
    );

    const newData: inventory_movements = {

      ...data,

      previous_stock: currentStock,

      new_stock: newStock,

      id: generateId(),

    };

    await this._inventory_movementsRepository.create(

      newData

    );

    return newData;

  }

  async update(id: string, data: inventory_movementsDto): Promise<inventory_movements | null> {
    const existing = await this._inventory_movementsRepository.findById(id);
    if (!existing) {
      return null;
    }

    const newData: inventory_movements = {
      ...data,
      id,
      previous_stock: existing.previous_stock,
      new_stock: existing.new_stock,
    }
    await this._inventory_movementsRepository.update(newData);
    return newData;
  }

  async delete(id: string): Promise<void> {
    const existing = await this._inventory_movementsRepository.findById(id);
    if (!existing) {
      return;
    }
    return await this._inventory_movementsRepository.delete(existing);
  }
}
