// 📁 backend/src/Infrastructure/database/initializeDatabase.ts

import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.TURSO_DB_URL || "not-found";
const token = process.env.TURSO_DB_AUTH_TOKEN || "not-found";

// ✅ EXPORTAR la conexión FUERA de la función
export const db = createClient({ url: dbUrl, authToken: token });

// ✅ Exportar la función SIN cerrar la conexión
export async function initializeDatabase(): Promise<void> {
    try {
        // ============ CATEGORÍAS ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS CATEGORIES (
                ID TEXT PRIMARY KEY,
                NAME TEXT,
                DESCRIPTION TEXT,
                STATUS INTEGER DEFAULT 1,
                CREATED_AT TEXT
            );
        `);
        console.log("✔ Categories ready");

        // ============ SUBCATEGORÍAS ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS SUBCATEGORIES (
                ID TEXT PRIMARY KEY,
                CATEGORY_ID TEXT,
                NAME TEXT,
                STATUS INTEGER,
                CREATED_AT TEXT
            );
        `);
        console.log("✔ Subcategories ready");

        // ============ PRODUCTOS ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS PRODUCTS (
                ID TEXT PRIMARY KEY,
                CATEGORY_ID TEXT,
                SUBCATEGORY_ID TEXT,
                NAME TEXT,
                DESCRIPTION TEXT,
                PRODUCT_TYPE TEXT,
                STATUS INTEGER,
                CREATED_AT TEXT,
                PRICE REAL DEFAULT 0,
                STOCK INTEGER DEFAULT 0
            );
        `);
        console.log("✔ Products ready");

        // ============ MOVIMIENTOS ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS INVENTORY_MOVEMENTS (
                ID TEXT PRIMARY KEY,
                PRODUCT_ID TEXT,
                MOVEMENT_TYPE TEXT,
                QUANTITY INTEGER,
                PREVIOUS_STOCK INTEGER,
                NEW_STOCK INTEGER,
                REASON TEXT,
                CREATED_BY TEXT,
                CREATED_AT TEXT
            );
        `);
        console.log("✔ Inventory movements ready");

        // ============ USUARIOS ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS USERS (
                ID TEXT PRIMARY KEY,
                NAME TEXT,
                EMAIL TEXT UNIQUE,
                PASSWORD TEXT,
                ROLE TEXT,
                STATUS INTEGER DEFAULT 1,
                CREATED_AT TEXT
            );
        `);
        console.log("✔ Users ready");

        // ============ PROVEEDORES ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS SUPPLIERS (
                ID TEXT PRIMARY KEY,
                NAME TEXT NOT NULL,
                RUC TEXT,
                PHONE TEXT,
                EMAIL TEXT,
                ADDRESS TEXT,
                CONTACT_NAME TEXT,
                RATING INTEGER DEFAULT 5,
                PAYMENT_TERMS TEXT,
                NOTES TEXT,
                STATUS INTEGER DEFAULT 1,
                CREATED_AT TEXT,
                UPDATED_AT TEXT
            );
        `);
        console.log("✔ Suppliers ready");

        // ============ ÓRDENES DE COMPRA ============
await db.execute(`
    CREATE TABLE IF NOT EXISTS purchase_orders (
        id TEXT PRIMARY KEY,
        supplier_id TEXT NOT NULL,
        order_number TEXT UNIQUE,
        status TEXT DEFAULT 'PENDIENTE',
        subtotal DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) DEFAULT 0,
        notes TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        received_at DATETIME
    );
`);
console.log("✔ Purchase orders ready");

// ============ DETALLE DE ÓRDENES ============
await db.execute(`
    CREATE TABLE IF NOT EXISTS purchase_order_items (
        id TEXT PRIMARY KEY,
        purchase_order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) DEFAULT 0
    );
`);
console.log("✔ Purchase order items ready");

// ============ CLIENTES ============
await db.execute(`
    CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ruc TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);
console.log("✔ Customers ready");

// ============ VENTAS ============
await db.execute(`
    CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        sale_number TEXT UNIQUE,
        customer_id TEXT,
        subtotal DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) DEFAULT 0,
        payment_method TEXT,
        status TEXT DEFAULT 'COMPLETADA',
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);
console.log("✔ Sales ready");

// ============ DETALLE DE VENTAS ============
await db.execute(`
    CREATE TABLE IF NOT EXISTS sale_items (
        id TEXT PRIMARY KEY,
        sale_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) DEFAULT 0
    );
`);
console.log("✔ Sale items ready");

        // ============ FACTURAS ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS invoices (
                id TEXT PRIMARY KEY,
                invoice_number TEXT UNIQUE,
                sale_id TEXT,
                customer_id TEXT,
                type TEXT DEFAULT 'FACTURA',
                subtotal DECIMAL(10,2) DEFAULT 0,
                tax DECIMAL(10,2) DEFAULT 0,
                total DECIMAL(10,2) DEFAULT 0,
                status TEXT DEFAULT 'EMITIDA',
                notes TEXT,
                created_by TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ Invoices ready");

                // ============ EMPLEADOS ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS employees (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                position TEXT,
                salary REAL DEFAULT 0,
                hire_date TEXT,
                phone TEXT,
                email TEXT,
                address TEXT,
                status INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ Employees ready");

        // ============ PLANILLA ============
        await db.execute(`
            CREATE TABLE IF NOT EXISTS payroll (
                id TEXT PRIMARY KEY,
                employee_id TEXT NOT NULL,
                period TEXT,
                base_salary REAL DEFAULT 0,
                bonuses REAL DEFAULT 0,
                bonus_description TEXT,
                deductions REAL DEFAULT 0,
                deduction_description TEXT,
                net_salary REAL DEFAULT 0,
                payment_method TEXT DEFAULT 'EFECTIVO',
                status TEXT DEFAULT 'PAGADA',
                paid_at DATETIME,
                created_by TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ Payroll ready");

        console.log("✅ Database initialization complete");

    } catch (error) {
        console.error("❌ Database init error:", error);
        throw error;  // ✅ Propagar el error para detener el servidor
    }
    // ✅ NO cerrar la conexión
}