/* AUTO-GENERATED-IMPORTS START */
        import { injectable, inject } from "tsyringe";
        import { ISubcategoriesRepository } from "../../Domain/repositories/subcategoriesRepository.interface";
        import Subcategories from "../../Domain/entities/subcategories";
        import { EntityType } from "../utils/entityTypes";
import { SqlReadOperation, SqlWriteOperation } from "../builders/sqlOperations.enum";
import { ISqlCommandOperationBuilder } from "../interface/sqlCommandOperation.interface";
import { ISingletonSqlConnection } from "../interface/dbConnection.interface";
        /* AUTO-GENERATED-IMPORTS END */

@injectable()
export class SubcategoriesRepository implements ISubcategoriesRepository {

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
        async findAll(page: number = 1, pageSize: number = 100): Promise<Subcategories[]> {
  const offset = (page - 1) * pageSize;

  const readCommand = this._operationBuilder
    .Initialize(EntityType.Subcategories)
    .WithOperation(SqlReadOperation.Select)
    .WithPagination(pageSize, offset)
    .BuildReader();

  const rows = await this._connection.executeQuery(readCommand);
  return rows.map(
  (row) =>
    ({
      id: row["ID"],
      category_id: row["CATEGORY_ID"],
name: row["NAME"],
status: Boolean(row["STATUS"]),
created_at: row["CREATED_AT"],
    } as Subcategories)
);
}

async findById(id: string): Promise<Subcategories | null> {
  const readCommand = this._operationBuilder
    .Initialize(EntityType.Subcategories)
    .WithOperation(SqlReadOperation.SelectById)
    .WithId(id)
    .BuildReader();

  const row = await this._connection.executeScalar(readCommand);
  if (!row) return null;

  return {
  id: row["ID"],
      category_id: row["CATEGORY_ID"],
name: row["NAME"],
status: Boolean(row["STATUS"]),
created_at: row["CREATED_AT"],
  } as Subcategories;
}

async findByCategory(categoryId: string): Promise<Subcategories[]> {
  const readCommand = this._operationBuilder
  .Initialize(EntityType.Subcategories)
  .WithOperation(SqlReadOperation.Select)
  .BuildReader();

  const rows =await this._connection.executeQuery(readCommand);
  
  return rows.filter((row) => {
    console.log(
      row["CATEGORY_ID"],
      categoryId 
    );
    return row["CATEGORY_ID"] === categoryId;
  }
)
.map(
  (row) =>
    ({
      id: row["ID"],
      category_id: row["CATEGORY_ID"],
      name: row["NAME"],
      created_at: row["CREATED_AT"],
      } as Subcategories)
    );
  }

async create(entity: Subcategories): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Subcategories, entity)
    .WithOperation(SqlWriteOperation.Create)
    .BuildWritter();

  await this._connection.executeNonQuery(writeCommand);
}

async update(entity: Subcategories): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Subcategories, entity)
    .WithOperation(SqlWriteOperation.Update)
    .BuildWritter();

  await this._connection.executeNonQuery(writeCommand);
}

async delete(entity: Subcategories): Promise<void> {
  const writeCommand = this._operationBuilder
    .From(EntityType.Subcategories, entity)
    .WithOperation(SqlWriteOperation.Delete)
    .BuildWritter();

  await this._connection.executeNonQuery(writeCommand);
}
        /* AUTO-GENERATED-METHODS END */
}
