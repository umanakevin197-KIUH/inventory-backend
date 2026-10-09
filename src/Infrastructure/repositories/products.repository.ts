/* AUTO-GENERATED-IMPORTS START */
import { injectable, inject } from "tsyringe";
import { IProductsRepository } from "../../Domain/repositories/productsRepository.interface";
import Products from "../../Domain/entities/products";
import { EntityType } from "../utils/entityTypes";
import { SqlReadOperation, SqlWriteOperation } from "../builders/sqlOperations.enum";
import { ISqlCommandOperationBuilder } from "../interface/sqlCommandOperation.interface";
import { ISingletonSqlConnection } from "../interface/dbConnection.interface";
        /* AUTO-GENERATED-IMPORTS END */

@injectable()
export class ProductsRepository implements IProductsRepository {

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
        async findAll(page: number = 1, pageSize: number = 100): Promise<Products[]> {
  const offset = (page - 1) * pageSize;

  const readCommand = this._operationBuilder
    .Initialize(EntityType.Products)
    .WithOperation(SqlReadOperation.Select)
    .WithPagination(pageSize, offset)
    .BuildReader();

  const rows = await this._connection.executeQuery(readCommand);
  return rows.map(
  (row) =>
    ({
      id: row["ID"],
      category_id: row["CATEGORY_ID"],
     subcategory_id: row["SUBCATEGORY_ID"],
     name: row["NAME"],
     description: row["DESCRIPTION"],
     product_type: row["PRODUCT_TYPE"],
     status: row["STATUS"],
     created_at: row["CREATED_AT"],
     price: row["PRICE"],
     stock: row["STOCK"],
    } as Products)
);
}

async findById(id: string): Promise<Products | null> {
  const readCommand = this._operationBuilder
    .Initialize(EntityType.Products)
    .WithOperation(SqlReadOperation.SelectById)
    .WithId(id)
    .BuildReader();

  const row = await this._connection.executeScalar(readCommand);
  if (!row) return null;

  return {
  id: row["ID"],
      category_id: row["CATEGORY_ID"],
subcategory_id: row["SUBCATEGORY_ID"],
name: row["NAME"],
description: row["DESCRIPTION"],
product_type: row["PRODUCT_TYPE"],
status: row["STATUS"],
created_at: row["CREATED_AT"],

price: row["PRICE"],
stock: row["STOCK"],
  } as Products;
}

async create(entity: Products): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Products, entity)
    .WithOperation(SqlWriteOperation.Create)
    .BuildWritter();

    console.log(entity);
    console.log(writeCommand);

  await this._connection.executeNonQuery(writeCommand);
}

async update(entity: Products): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Products, entity)
    .WithOperation(SqlWriteOperation.Update)
    .BuildWritter();

  await this._connection.executeNonQuery(writeCommand);
}

async delete(entity: Products): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Products, entity)
    .WithOperation(SqlWriteOperation.Delete)
    .BuildWritter();

  await this._connection.executeNonQuery(writeCommand);
}
        /* AUTO-GENERATED-METHODS END */
}
