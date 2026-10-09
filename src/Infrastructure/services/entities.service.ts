import { EntityType } from "../utils/entityTypes";
import {
  SqlEntitySettings,
  SqlColumnSettings,
} from "../builders/sqlEntitySettings";
import { IEntitiesService } from "../interface/entitiesService.interface";
import { injectable } from "tsyringe";

@injectable()
export class EntitiesService implements IEntitiesService {
  private entities = new Map<EntityType, SqlEntitySettings>();

  constructor() {
    this.buildEntities();
  }

  GetSettings(type: EntityType): SqlEntitySettings {
    const settings = this.entities.get(type);
    if (!settings) {
      throw new Error(`Entidad no encontrada: ${type}`);
    }
    return settings;
  }

  private buildEntities(): void {
        this.entities.set(EntityType.Categories, this.getCategoriesSettings());
    this.entities.set(EntityType.Subcategories, this.getSubcategoriesSettings());
    this.entities.set(EntityType.Products, this.getProductsSettings());
    this.entities.set(EntityType.Product_variants, this.getProduct_variantsSettings());
    this.entities.set(EntityType.Inventorymovements, this.getInventorymovementsSettings());
    this.entities.set(EntityType.Users, this.getUsersSettings());
    this.entities.set(EntityType.Inventorymovements,this.getInventorymovementsSettings());
  }

  

    
  private getCategoriesSettings(): SqlEntitySettings {
    const columns: SqlColumnSettings[] = [
        new SqlColumnSettings("ID", "id", true),
            new SqlColumnSettings("NAME", "name", false),
            new SqlColumnSettings("DESCRIPTION", "description", false),
            new SqlColumnSettings("STATUS", "status", false),
            new SqlColumnSettings("CREATED_AT", "created_at", false),
        ];
    return new SqlEntitySettings("CATEGORIES", columns);
  }

  private getSubcategoriesSettings(): SqlEntitySettings {
    const columns: SqlColumnSettings[] = [
        new SqlColumnSettings("ID", "id", true),
            new SqlColumnSettings("CATEGORY_ID", "category_id", false),
            new SqlColumnSettings("NAME", "name", false),
            new SqlColumnSettings("STATUS", "status", false),
            new SqlColumnSettings("CREATED_AT", "created_at", false),
        ];
    return new SqlEntitySettings("SUBCATEGORIES", columns);
  }

  private getProductsSettings(): SqlEntitySettings {
    const columns: SqlColumnSettings[] = [
        new SqlColumnSettings("ID", "id", true),
            new SqlColumnSettings("CATEGORY_ID", "category_id", false),
            new SqlColumnSettings("SUBCATEGORY_ID", "subcategory_id", false),
            new SqlColumnSettings("NAME", "name", false),
            new SqlColumnSettings("DESCRIPTION", "description", false),
            new SqlColumnSettings("PRODUCT_TYPE", "product_type", false),
            new SqlColumnSettings("STATUS", "status", false),
            new SqlColumnSettings("CREATED_AT", "created_at", false),
            new SqlColumnSettings("PRICE", "price", false),
            new SqlColumnSettings("STOCK", "stock", false),
        ];
    return new SqlEntitySettings("PRODUCTS", columns);
  }

  private getProduct_variantsSettings(): SqlEntitySettings {
    const columns: SqlColumnSettings[] = [
        new SqlColumnSettings("ID", "id", true),
            new SqlColumnSettings("PRODUCT_ID", "product_id", false),
            new SqlColumnSettings("SKU", "sku", false),
            new SqlColumnSettings("SIZE", "size", false),
            new SqlColumnSettings("COLOR", "color", false),
            new SqlColumnSettings("BRAND", "brand", false),
            new SqlColumnSettings("STOCK", "stock", false),
            new SqlColumnSettings("PRICE", "price", false),
            new SqlColumnSettings("CREATED_AT", "created_at", false),
        ];
    return new SqlEntitySettings("PRODUCT_VARIANTS", columns);
  }

  private getInventorymovementsSettings(): SqlEntitySettings {
    const columns: SqlColumnSettings[] = [
        new SqlColumnSettings("ID", "id", true),
            new SqlColumnSettings("PRODUCT_ID", "product_id", false),
            new SqlColumnSettings("MOVEMENT_TYPE", "movement_type", false),
            new SqlColumnSettings("QUANTITY", "quantity", false),
            new SqlColumnSettings("PREVIOUS_STOCK", "previous_stock", false),
            new SqlColumnSettings("NEW_STOCK", "new_stock", false),
            new SqlColumnSettings("REASON", "reason", false),
            new SqlColumnSettings("CREATED_BY", "created_by", false),
            new SqlColumnSettings("CREATED_AT", "created_at", false),
        ];
    return new SqlEntitySettings("INVENTORY_MOVEMENTS", columns);
  }

  private getUsersSettings(): SqlEntitySettings {
    const columns: SqlColumnSettings[] = [
        new SqlColumnSettings("ID", "id", true),
            new SqlColumnSettings("NAME", "name", false),
            new SqlColumnSettings("EMAIL", "email", false),
            new SqlColumnSettings("PASSWORD", "password", false),
            new SqlColumnSettings("ROLE", "role", false),
            new SqlColumnSettings("CREATED_AT", "created_at", false),
        ];
    return new SqlEntitySettings("USERS", columns);
  }

}