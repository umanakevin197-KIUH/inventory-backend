import { inventory_movementsSchemas } from "./schemas/inventory_movements.schema";
import { inventory_movementsPaths } from "./paths/inventory_movements.path";
import { UsersSchemas } from "./schemas/users.schema";
import { UsersPaths } from "./paths/users.path";
import { AuthPaths } from "./paths/auth.path";
import { ProductsSchemas } from "./schemas/products.schema";
import { ProductsPaths } from "./paths/products.path";
import { SubcategoriesSchemas } from "./schemas/subcategories.schema";
import { SubcategoriesPaths } from "./paths/subcategories.path";
import { CategoriesSchemas } from "./schemas/categories.schema";
import { CategoriesPaths } from "./paths/categories.path";

export const OpenApiSpecification = {
    openapi: "3.0.0",
    info: {
        title: "InventoryX API",
        version: "1.0.0",
        description: "Auto-generated API documentation"
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local server"
        }
    ],
    paths: {
        ...AuthPaths,
        ...inventory_movementsPaths,
        ...UsersPaths,
        ...ProductsPaths,
        ...SubcategoriesPaths,
        ...CategoriesPaths,
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            ...inventory_movementsSchemas,
            ...UsersSchemas,
            ...ProductsSchemas,
            ...SubcategoriesSchemas,
            ...CategoriesSchemas,
        }
    }
};