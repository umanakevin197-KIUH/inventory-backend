/* AUTO-GENERATED-IMPORTS START */
import { injectable, inject } from "tsyringe";
import { IProduct_variantsRepository } from "../../Domain/repositories/product_variantsRepository.interface";
import Product_variants from "../../Domain/entities/product_variants";
import { EntityType } from "../utils/entityTypes";
import { SqlReadOperation, SqlWriteOperation } from "../builders/sqlOperations.enum";
import { ISqlCommandOperationBuilder } from "../interface/sqlCommandOperation.interface";
import { ISingletonSqlConnection } from "../interface/dbConnection.interface";
        /* AUTO-GENERATED-IMPORTS END */

@injectable()
export class Product_variantsRepository implements IProduct_variantsRepository {

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
        async findAll(page: number = 1, pageSize: number = 100): Promise<Product_variants[]> {
  const offset = (page - 1) * pageSize;

  const readCommand = this._operationBuilder
    .Initialize(EntityType.Product_variants)
    .WithOperation(SqlReadOperation.Select)
    .WithPagination(pageSize, offset)
    .BuildReader();

  const rows = await this._connection.executeQuery(readCommand);
  return rows.map(
  (row) =>
    ({
      id: row["ID"],
      product_id: row["PRODUCT_ID"],
sku: row["SKU"],
size: row["SIZE"],
color: row["COLOR"],
brand: row["BRAND"],
stock: row["STOCK"],
price: row["PRICE"],
created_at: row["CREATED_AT"],
    } as Product_variants)
);
}

async findById(id: string): Promise<Product_variants | null> {
  const readCommand = this._operationBuilder
    .Initialize(EntityType.Product_variants)
    .WithOperation(SqlReadOperation.SelectById)
    .WithId(id)
    .BuildReader();

  const row = await this._connection.executeScalar(readCommand);
  if (!row) return null;

  return {
  id: row["ID"],
      product_id: row["PRODUCT_ID"],
sku: row["SKU"],
size: row["SIZE"],
color: row["COLOR"],
brand: row["BRAND"],
stock: row["STOCK"],
price: row["PRICE"],
created_at: row["CREATED_AT"],
  } as Product_variants;
}

async create(entity: Product_variants): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Product_variants, entity)
    .WithOperation(SqlWriteOperation.Create)
    .BuildWritter();

  await this._connection.executeNonQuery(writeCommand);
}

async update(entity: Product_variants): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Product_variants, entity)
    .WithOperation(SqlWriteOperation.Update)
    .BuildWritter();

  await this._connection.executeNonQuery(writeCommand);
}

async delete(entity: Product_variants): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Product_variants, entity)
    .WithOperation(SqlWriteOperation.Delete)
    .BuildWritter();

  await this._connection.executeNonQuery(writeCommand);
}
        /* AUTO-GENERATED-METHODS END */
}
