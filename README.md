# ClubSphere – Sports Club Management System
## Sports Shop, Inventory, E-Commerce & Cafe/Bar Modules (Balaji's Responsibility)

---

### 1. Project Overview & Architecture
This repository contains the complete full-stack implementation of the **Sports Shop, Inventory Management, E-Commerce & Counter Sales, and Cafe & Bar Management** subsystems for the **ClubSphere** Sports Club Management System.

Built strictly according to academic evaluation requirements:
- **Backend**: Java 21/23, Spring Boot 3.3.5, Spring Data JPA, Hibernate, Spring Security, Maven.
- **Frontend**: React 18, Vite, React Router v6, Axios, React-Toastify, jsPDF & jsPDF-AutoTable.
- **Database**: PostgreSQL 15+, pgAdmin 4.
- **Concurrency & Stock Safety**: Pessimistic write locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) prevents overselling across concurrent online and counter POS sales.

---

### 2. Directory Structure
```
model3/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/clubsphere/
│       ├── common/          # GlobalExceptionHandler, SecurityConfig, CorsConfig, ApiResponse
│       ├── shop/            # Module 1: Product, ProductCategory, ProductImage entities, services, controllers
│       ├── inventory/       # Module 2: Inventory, StockMovement entities, Pessimistic Locking service, controllers
│       ├── ecommerce/       # Module 3: Cart, ShopOrder, CounterSale entities, checkout & POS services, controllers
│       └── cafe/            # Module 4: Table, Menu, CafeOrder, Tab, BillSplit, Payment, DailySales services & controllers
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/             # Axios API service modules for all 4 subsystems
│       ├── components/      # Sidebar, Navbar, StatusBadge, LoadingSpinner, ConfirmModal, ProductCard, SearchBar
│       ├── pages/
│       │   ├── shop/        # ShopDashboard, ProductCatalogue, ProductDetails, AddProduct, EditProduct, ProductCategories
│       │   ├── inventory/   # InventoryDashboard, StockList, StockIn, StockAdjustment, StockMovementHistory, LowStockAlerts
│       │   ├── ecommerce/   # CustomerShop, ShoppingCart, Checkout, MyOrders, OrderDetails, AdminOrderManagement, CounterSales
│       │   └── cafe/        # CafeDashboard, MenuDisplay, MenuManagement, TableManagement, PlaceOrder, KitchenDashboard, CafeOrderManagement, CafeBilling, CustomerTabs, DailySales
│       ├── App.jsx          # Complete routing configuration
│       ├── main.jsx
│       └── App.css          # ClubSphere sports-themed UI stylesheet
└── database/
    ├── balaji_schema.sql    # 20+ relational PostgreSQL tables, constraints, indexes & foreign keys
    └── balaji_sample_data.sql # Pre-populated categories, 18 sports products, stock levels, 6 menu categories, 14 menu items, 8 tables
```

---

### 3. Database Setup (PostgreSQL)

1. Open **pgAdmin** or PostgreSQL CLI `psql`:
   ```sql
   CREATE DATABASE clubsphere_db;
   ```

2. Execute the schema script:
   ```bash
   psql -U postgres -d clubsphere_db -f database/balaji_schema.sql
   ```

3. Populate with verified sample seed data:
   ```bash
   psql -U postgres -d clubsphere_db -f database/balaji_sample_data.sql
   ```

---

### 4. Running the Spring Boot Backend

1. Verify Java 23/21 is active:
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
   ```

2. Build and verify all 119 source classes:
   ```bash
   mvn clean compile
   ```

3. Launch the Spring Boot application (port `8080`):
   ```bash
   mvn spring-boot:run
   ```

---

### 5. Running the React Frontend

1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Start the Vite development server (port `3000`):
   ```bash
   npm run dev
   ```

3. Production build (verified with 0 errors):
   ```bash
   npm run build
   ```

---

### 6. Academic Viva Highlights & Architectural Decisions

#### A. Shared Inventory & Concurrency Safety
- **The Core Problem**: A customer ordering a Yonex racket online and a counter staff selling the same racket at the club desk must never cause negative inventory.
- **The Solution**: In `InventoryRepository.java`:
  ```java
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT i FROM Inventory i WHERE i.productId = :productId")
  Optional<Inventory> findByProductIdWithLock(@Param("productId") Long productId);
  ```
  This places a PostgreSQL row-level `FOR UPDATE` lock inside the transactional boundary. Any competing thread waits until the lock releases, preventing race conditions.

#### B. Audit Ledger of Stock Movements
- Every stock change creates an immutable audit row in `stock_movements`:
  - `STOCK_IN`: Supplier intake / restocking purchases.
  - `STOCK_OUT`: E-commerce orders and POS counter sales.
  - `ADJUSTMENT`: Physical stock audit reconciliation.
  - `RETURN`: Inspected customer returns.

#### C. Cafe & Bar Split Billing Formula
- The system supports multi-person bill splits where the sum of individual split payments is strictly validated against the order's grand total before recording payment transactions in PostgreSQL.
- Includes full customer tab lifecycle for table sessions and Kitchen Order Display (KDS) live ticket states (`PENDING` -> `PREPARING` -> `READY` -> `SERVED` -> `COMPLETED`).

#### D. Teammate Integration Interfaces
- **Riya (Auth & Members)**: Member ID links dynamically into `carts`, `shop_orders`, `cafeteria_orders`, and `cafeteria_tabs`.
- **Swathi (Court Booking)**: Shop catalogue can be linked directly from court confirmation receipts.
- **Anish (Finance & Notifications)**: Low-stock events trigger alert payloads for finance journalizing and notifications.
