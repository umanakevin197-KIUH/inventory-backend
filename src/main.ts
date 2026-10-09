import "reflect-metadata";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { initializeDatabase } from "./Infrastructure/database/initializeDatabase";
import "./WebApi/container/dependencyContainer";

// ROUTES
import inventory_movementsRoutes from "./WebApi/routes/inventory_movements.routes";
import usersRoutes from "./WebApi/routes/users.routes";
import productsRoutes from "./WebApi/routes/products.routes";
import subcategoriesRoutes from "./WebApi/routes/subcategories.routes";
import categoriesRoutes from "./WebApi/routes/categories.routes";
import authRoutes from "./WebApi/routes/auth.routes";
import { apiReference } from "@scalar/express-api-reference";
import { OpenApiSpecification } from "./WebApi/docs/openapi";
import predictiveRoutes from './WebApi/routes/predictive.routes';
import suppliersRoutes from "./WebApi/routes/suppliers.routes";
import purchasesRoutes from "./WebApi/routes/purchases.routes";
import customersRoutes from "./WebApi/routes/customers.routes";
import salesRoutes from "./WebApi/routes/sales.routes";
import invoicesRoutes from "./WebApi/routes/invoices.routes";
import employeesRoutes from "./WebApi/routes/employees.routes";
import payrollRoutes from "./WebApi/routes/payroll.routes";
import intelligenceRoutes from "./WebApi/routes/intelligence.routes";

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        process.env.FRONTEND_URL || "",
        /\.vercel\.app$/,
        /\.railway\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// OPENAPI
app.use(
    "/api-docs",
    apiReference({
        content: OpenApiSpecification,
    })
);

// ROUTES
app.use("/api/inventory_movements", inventory_movementsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/subcategories", subcategoriesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/auth", authRoutes);
app.use('/api', predictiveRoutes);
app.use("/api/purchases", purchasesRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/intelligence", intelligenceRoutes);

async function startServer() {
    await initializeDatabase();

    app.listen(PORT, () => {
        console.log("");
        console.log("╔═══════════════════════════════════════════════════════╗");
        console.log("║                                                       ║");
        console.log("║       ⚡  INVENTORYX - SISTEMA DE GESTIÓN ⚡          ║");
        console.log("║                                                       ║");
        console.log("║       Sistema Inteligente de Gestión Comercial       ║");
        console.log("║              con Inteligencia de Negocios            ║");
        console.log("║                                                       ║");
        console.log("╚═══════════════════════════════════════════════════════╝");
        console.log("");
        console.log(`  🚀 Servidor:       http://localhost:${PORT}`);
        console.log(`  📚 API Docs:       http://localhost:${PORT}/api-docs`);
        console.log(`  🔗 API Base:       http://localhost:${PORT}/api`);
        console.log(`  🌐 Entorno:        ${process.env.NODE_ENV || "development"}`);
        console.log("");
        console.log("  ✅ Sistema listo para usar");
        console.log("");
    });
}

startServer();