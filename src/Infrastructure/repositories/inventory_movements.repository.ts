/* AUTO-GENERATED-IMPORTS START */
import { injectable, inject } from "tsyringe";
import { Iinventory_movementsRepository } from "../../Domain/repositories/inventory_movementsRepository.interface";
import inventory_movements  from "../../Domain/entities/inventory_movements";
import { EntityType } from "../utils/entityTypes";
import { SqlReadOperation, SqlWriteOperation } from "../builders/sqlOperations.enum";
import { ISqlCommandOperationBuilder } from "../interface/sqlCommandOperation.interface";
import { ISingletonSqlConnection } from "../interface/dbConnection.interface";
/* AUTO-GENERATED-IMPORTS END */

@injectable()
export class inventory_movementsRepository implements Iinventory_movementsRepository {

  /* AUTO-GENERATED-PROPERTIES START */
  private readonly _operationBuilder: ISqlCommandOperationBuilder;
  private readonly _connection: ISingletonSqlConnection;
  /* AUTO-GENERATED-PROPERTIES END */

  /* AUTO-GENERATED-CONSTRUCTOR START */
   constructor(
    @inject("IOperationBuilder") operationBuilder: ISqlCommandOperationBuilder,
    @inject("ISingletonSqlConnection") connection: ISingletonSqlConnection
  ) {
    this._operationBuilder = operationBuilder;
    this._connection = connection;
  }
  /* AUTO-GENERATED-CONSTRUCTOR END */

  /* AUTO-GENERATED-METHODS START */
  async findAll(page: number = 1, pageSize: number = 100): Promise<inventory_movements[]> {
    const offset = (page - 1) * pageSize;

    const readCommand = this._operationBuilder
      .Initialize(EntityType.Inventorymovements)
      .WithOperation(SqlReadOperation.Select)
      .WithPagination(pageSize, offset)
      .BuildReader();

      const rows = await this._connection.executeQuery(readCommand);

    return rows.map(
      (row) =>
        ({
          id: row["ID"],
          product_id: row["PRODUCT_ID"],
          movement_type: row["MOVEMENT_TYPE"],
          quantity: row["QUANTITY"],
          previous_stock: row["PREVIOUS_STOCK"],
          new_stock: row["NEW_STOCK"],
          reason: row["REASON"],
          created_by: row["CREATED_BY"],
          created_at: row["CREATED_AT"],
        } as inventory_movements)
    );
  }

  async findById(id: string): Promise<inventory_movements | null> {
    const readCommand = this._operationBuilder
      .Initialize(EntityType.Inventorymovements)
      .WithOperation(SqlReadOperation.SelectById)
      .WithId(id)
      .BuildReader();

    const row = await this._connection.executeScalar(readCommand);

    if (!row) return null;

     return {
      id: row["ID"],
      product_id: row["PRODUCT_ID"],
      movement_type: row["MOVEMENT_TYPE"],
      quantity: row["QUANTITY"],
      previous_stock: row["PREVIOUS_STOCK"],
      new_stock: row["NEW_STOCK"],
      reason: row["REASON"],
      created_by: row["CREATED_BY"],
      created_at: row["CREATED_AT"],
    } as inventory_movements;
  }

  async create(entity: inventory_movements) : Promise<void>{
    const writeCommand = this._operationBuilder
      .From(EntityType.Inventorymovements, entity)
      .WithOperation(SqlWriteOperation.Create)
      .BuildWritter();

        await this._connection.executeNonQuery(writeCommand);
  }


  async update(entity: inventory_movements): Promise<void> {
     const writeCommand = this._operationBuilder
      .From(EntityType.Inventorymovements, entity)
      .WithOperation(SqlWriteOperation.Update)
      .BuildWritter();

    await this._connection.executeNonQuery(writeCommand);
  }

  async delete(entity: inventory_movements): Promise<void> {
    const writeCommand = this._operationBuilder
      .From(EntityType.Inventorymovements, entity)
      .WithOperation(SqlWriteOperation.Delete)
      .BuildWritter();

    await this._connection.executeNonQuery(writeCommand);
  }
  /* AUTO-GENERATED-METHODS END */
}
