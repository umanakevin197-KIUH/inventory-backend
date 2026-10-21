import { container } from "tsyringe";
import { Iinventory_movementsRepository } from "./../../Domain/repositories/inventory_movementsRepository.interface";
import { inventory_movementsRepository } from "./../../Infrastructure/repositories/inventory_movements.repository";
import { Iinventory_movementsService } from "./../../Application/interfaces/inventory_movements.service.interface";
import { inventory_movementsService } from "./../../Application/services/inventory_movements.service";
import { inventory_movementsController } from "./../controllers/inventory_movements.controller";
import { IUsersRepository } from "./../../Domain/repositories/usersRepository.interface";
import { UsersRepository } from "./../../Infrastructure/repositories/users.repository";
import { IUsersService } from "./../../Application/interfaces/users.service.interface";
import { UsersService } from "./../../Application/services/users.service";
import { UsersController } from "./../controllers/users.controller";
import { IProductsRepository } from "./../../Domain/repositories/productsRepository.interface";
import { ProductsRepository } from "./../../Infrastructure/repositories/products.repository";
import { IProductsService } from "./../../Application/interfaces/products.service.interface";
import { ProductsService } from "./../../Application/services/products.service";
import { ProductsController } from "./../controllers/products.controller";
import { ISubcategoriesRepository } from "./../../Domain/repositories/subcategoriesRepository.interface";
import { SubcategoriesRepository } from "./../../Infrastructure/repositories/subcategories.repository";
import { ISubcategoriesService } from "./../../Application/interfaces/subcategories.service.interface";
import { SubcategoriesService } from "./../../Application/services/subcategories.service";
import { SubcategoriesController } from "./../controllers/subcategories.controller";
import { ICategoriesRepository } from "./../../Domain/repositories/categoriesRepository.interface";
import { CategoriesRepository } from "./../../Infrastructure/repositories/categories.repository";
import { ICategoriesService } from "./../../Application/interfaces/categories.service.interface";
import { CategoriesService } from "./../../Application/services/categories.service";
import { CategoriesController } from "./../controllers/categories.controller";
import { ISingletonSqlConnection } from '../../Infrastructure/interface/dbConnection.interface';
import { SingletonSqlConnection } from '../../Infrastructure/database/dbConnection';
import { ISqlCommandOperationBuilder } from "../../Infrastructure/interface/sqlCommandOperation.interface";
import { SqlCommandOperationBuilder } from "../../Infrastructure/builders/sqlCommandOperation.builder";
import { EntitiesService } from "../../Infrastructure/services/entities.service";
import { IEntitiesService } from "../../Infrastructure/interface/entitiesService.interface";
import { IAuthService } from "../../Application/interfaces/auth.service.interface";
import { AuthService } from "../../Application/services/auth.service";
import { IPredictiveService } from '../../Application/interfaces/predictive.service.interface';
import { PredictiveService } from '../../Application/services/predictive.service';
import { ISuppliersService } from '../../Application/interfaces/suppliers.service.interface';
import { SuppliersService } from '../../Application/services/suppliers.service';
import { ISuppliersRepository } from '../../Domain/repositories/suppliersRepository.interface';
import { SuppliersRepository } from '../../Infrastructure/repositories/suppliers.repository';
import { IPurchasesService } from '../../Application/interfaces/purchases.service.interface';
import { PurchasesService } from '../../Application/services/purchases.service';
import { IPurchasesRepository } from '../../Domain/repositories/purchasesRepository.interface';
import { PurchasesRepository } from '../../Infrastructure/repositories/purchases.repository';
import { ICustomersService } from '../../Application/interfaces/customers.service.interface';
import { CustomersService } from '../../Application/services/customers.service';
import { ICustomersRepository } from '../../Domain/repositories/customersRepository.interface';
import { CustomersRepository } from '../../Infrastructure/repositories/customers.repository';
import { ISalesService } from '../../Application/interfaces/sales.service.interface';
import { SalesService } from '../../Application/services/sales.service';
import { ISalesRepository } from '../../Domain/repositories/salesRepository.interface';
import { SalesRepository } from '../../Infrastructure/repositories/sales.repository';
import { IInvoicesService } from '../../Application/interfaces/invoices.service.interface';
import { IInvoicesRepository } from '../../Domain/repositories/invoicesRepository.interface';
import { InvoicesRepository } from '../../Infrastructure/repositories/invoices.repository';
import { InvoicesService } from '../../Application/services/invoices.service';
import { IEmployeesService } from '../../Application/interfaces/employees.service.interface';
import { EmployeesService } from '../../Application/services/employees.service';
import { IEmployeesRepository } from '../../Domain/repositories/employeesRepository.interface';
import { EmployeesRepository } from '../../Infrastructure/repositories/employees.repository';
import { IPayrollService } from '../../Application/interfaces/payroll.service.interface';
import { PayrollService } from '../../Application/services/payroll.service';
import { IPayrollRepository } from '../../Domain/repositories/payrollRepository.interface';
import { PayrollRepository } from '../../Infrastructure/repositories/payroll.repository';
import { IIntelligenceService } from '../../Application/interfaces/intelligence.service.interface';
import { IntelligenceService } from '../../Application/services/intelligence.service';
import { ICreditPaymentsService } from '../../Application/interfaces/credit_payments.service.interface';
import { CreditPaymentsService } from '../../Application/services/credit_payments.service';
import { ICreditPaymentsRepository } from '../../Domain/repositories/credit_paymentsRepository.interface';
import { CreditPaymentsRepository } from '../../Infrastructure/repositories/credit_payments.repository';

// Builder, database connection and entity service
container.registerSingleton<ISingletonSqlConnection>('ISingletonSqlConnection', SingletonSqlConnection);
container.register<ISqlCommandOperationBuilder>('IOperationBuilder', { useClass: SqlCommandOperationBuilder });
container.registerSingleton<IEntitiesService>('IEntityService', EntitiesService);

// AUTO-GENERATED MODULE REGISTRATIONS
// inventory_movements
container.register<Iinventory_movementsRepository>("Iinventory_movementsRepository", { useClass: inventory_movementsRepository });
container.register("Iinventory_movementsService", { useClass: inventory_movementsService });
container.register<inventory_movementsController>("inventory_movementsController", { useClass: inventory_movementsController });

// Users
container.register<IUsersRepository>("IUsersRepository", { useClass: UsersRepository });
container.register<IUsersService>("IUsersService", { useClass: UsersService });
container.register<UsersController>("UsersController", { useClass: UsersController });

// Products
container.register<IProductsRepository>("IProductsRepository", { useClass: ProductsRepository });
container.register<IProductsService>("IProductsService", { useClass: ProductsService });
container.register<ProductsController>("ProductsController", { useClass: ProductsController });

// Subcategories
container.register<ISubcategoriesRepository>("ISubcategoriesRepository", { useClass: SubcategoriesRepository });
container.register<ISubcategoriesService>("ISubcategoriesService", { useClass: SubcategoriesService });
container.register<SubcategoriesController>("SubcategoriesController", { useClass: SubcategoriesController });

// Categories
container.register<ICategoriesRepository>("ICategoriesRepository", { useClass: CategoriesRepository });
container.register<ICategoriesService>("ICategoriesService", { useClass: CategoriesService });
container.register<CategoriesController>("CategoriesController", { useClass: CategoriesController });

// Auth
container.register<IAuthService>("IAuthService", AuthService);
container.register<IPredictiveService>('IPredictiveService', { useClass: PredictiveService });

// Proveedores
container.register<ISuppliersRepository>('ISuppliersRepository', { useClass: SuppliersRepository });
container.register<ISuppliersService>('ISuppliersService', { useClass: SuppliersService });

// Compras
container.register<IPurchasesRepository>('IPurchasesRepository', { useClass: PurchasesRepository });
container.register<IPurchasesService>('IPurchasesService', { useClass: PurchasesService });

// Clientes
container.register<ICustomersRepository>('ICustomersRepository', { useClass: CustomersRepository });
container.register<ICustomersService>('ICustomersService', { useClass: CustomersService });

// Ventas
container.register<ISalesRepository>('ISalesRepository', { useClass: SalesRepository });
container.register<ISalesService>('ISalesService', { useClass: SalesService });

// Facturación
container.register<IInvoicesRepository>('IInvoicesRepository', { useClass: InvoicesRepository });
container.register<IInvoicesService>('IInvoicesService', { useClass: InvoicesService });

// Empleados
container.register<IEmployeesRepository>('IEmployeesRepository', { useClass: EmployeesRepository });
container.register<IEmployeesService>('IEmployeesService', { useClass: EmployeesService });

// Planilla
container.register<IPayrollRepository>('IPayrollRepository', { useClass: PayrollRepository });
container.register<IPayrollService>('IPayrollService', { useClass: PayrollService });

// Inteligencia de Negocios
container.register<IIntelligenceService>('IIntelligenceService', { useClass: IntelligenceService });

// Abonos / Créditos
container.register<ICreditPaymentsRepository>('ICreditPaymentsRepository', { useClass: CreditPaymentsRepository });
container.register<ICreditPaymentsService>('ICreditPaymentsService', { useClass: CreditPaymentsService });

export { container };