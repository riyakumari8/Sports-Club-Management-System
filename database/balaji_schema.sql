-- =============================================================================
-- ClubSphere: Balaji's Modules — Schema Definition
-- File: balaji_schema.sql
-- Covers: Sports Shop, Inventory, E-Commerce, Counter Sales, Cafe & Bar
-- =============================================================================

-- =========================================================
-- SHARED TRIGGER FUNCTION: update_updated_at_column
-- Called by BEFORE UPDATE triggers on all tables with updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =============================================================================
-- SECTION 1: SPORTS SHOP
-- Tables: product_categories, products, product_images
-- =============================================================================

-- -----------------------------------------------
-- product_categories: Top-level groupings for shop products
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS product_categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------
-- products: Individual items available for purchase
-- selling_price is auto-computed from original_price and discount_percent
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id               BIGSERIAL PRIMARY KEY,
    category_id      BIGINT NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
    name             VARCHAR(200) NOT NULL,
    description      TEXT,
    image_url        TEXT,
    original_price   DECIMAL(10,2) NOT NULL CHECK (original_price >= 0),
    discount_percent DECIMAL(5,2)  NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    selling_price    DECIMAL(10,2) GENERATED ALWAYS AS
                        (ROUND(original_price * (1 - discount_percent / 100.0), 2)) STORED,
    is_active        BOOLEAN NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active   ON products(is_active);

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------
-- product_images: Additional images for a product
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
    id         BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url  TEXT   NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================================
-- SECTION 2: INVENTORY
-- Tables: inventory, stock_movements
-- =============================================================================

-- -----------------------------------------------
-- inventory: Current stock levels per product (one row per product)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS inventory (
    id                       BIGSERIAL PRIMARY KEY,
    product_id               BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    quantity_in_stock        INT NOT NULL DEFAULT 0
                                CONSTRAINT chk_non_negative_stock CHECK (quantity_in_stock >= 0),
    minimum_stock_threshold  INT NOT NULL DEFAULT 5,
    stock_status             VARCHAR(20) NOT NULL DEFAULT 'OUT_OF_STOCK',
    last_updated             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_stock_status ON inventory(stock_status);

-- -----------------------------------------------
-- Trigger: automatically update stock_status when quantity_in_stock changes
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
    NEW.stock_status :=
        CASE
            WHEN NEW.quantity_in_stock = 0 THEN 'OUT_OF_STOCK'
            WHEN NEW.quantity_in_stock <= NEW.minimum_stock_threshold THEN 'LOW_STOCK'
            ELSE 'IN_STOCK'
        END;
    NEW.last_updated := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_inventory_status
    BEFORE UPDATE OF quantity_in_stock ON inventory
    FOR EACH ROW EXECUTE FUNCTION fn_update_inventory_status();


-- -----------------------------------------------
-- stock_movements: Audit log of every stock change
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS stock_movements (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    recorded_by     BIGINT,                        -- FK to employees (owned by teammate)
    movement_type   VARCHAR(30) NOT NULL,           -- e.g. 'PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT'
    quantity        INT NOT NULL,
    previous_stock  INT NOT NULL,
    updated_stock   INT NOT NULL,
    reason          TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================================
-- SECTION 3: E-COMMERCE
-- Tables: carts, cart_items, shop_orders, shop_order_items,
--         shop_order_status_history
-- =============================================================================

-- -----------------------------------------------
-- carts: Shopping carts for online customers
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS carts (
    id          BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,               -- FK to members (owned by teammate)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------
-- cart_items: Individual line items inside a cart
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cart_items (
    id         BIGSERIAL PRIMARY KEY,
    cart_id    BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity   INT NOT NULL CONSTRAINT chk_cart_qty CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- -----------------------------------------------
-- shop_orders: Online / delivery orders placed through the shop
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS shop_orders (
    id               BIGSERIAL PRIMARY KEY,
    order_number     VARCHAR(30) NOT NULL UNIQUE,
    customer_id      BIGINT NOT NULL,              -- FK to members (owned by teammate)
    order_type       VARCHAR(20) NOT NULL,          -- e.g. 'ONLINE', 'PICKUP'
    delivery_address TEXT,
    subtotal         DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount  DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount     DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method   VARCHAR(30),
    payment_status   VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    order_status     VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shop_orders_customer_id  ON shop_orders(customer_id);
CREATE INDEX idx_shop_orders_order_status ON shop_orders(order_status);
CREATE INDEX idx_shop_orders_created_at   ON shop_orders(created_at);

CREATE TRIGGER trg_shop_orders_updated_at
    BEFORE UPDATE ON shop_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------
-- shop_order_items: Line items for each shop order
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS shop_order_items (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
    product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity        INT NOT NULL CHECK (quantity > 0),
    unit_price      DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    line_total      DECIMAL(10,2) NOT NULL
);


-- -----------------------------------------------
-- shop_order_status_history: Full history of order status changes
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS shop_order_status_history (
    id         BIGSERIAL PRIMARY KEY,
    order_id   BIGINT NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
    status     VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100),
    notes      TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================================
-- SECTION 4: COUNTER SALES
-- Tables: counter_sales, counter_sale_items
-- =============================================================================

-- -----------------------------------------------
-- counter_sales: Walk-in / POS sales at the sports shop counter
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS counter_sales (
    id             BIGSERIAL PRIMARY KEY,
    receipt_number VARCHAR(30) NOT NULL UNIQUE,
    staff_id       BIGINT,                      -- FK to employees (owned by teammate)
    customer_name  VARCHAR(100),
    total_amount   DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(30),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    sale_time      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- -----------------------------------------------
-- counter_sale_items: Individual products sold in a counter sale
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS counter_sale_items (
    id               BIGSERIAL PRIMARY KEY,
    counter_sale_id  BIGINT NOT NULL REFERENCES counter_sales(id) ON DELETE CASCADE,
    product_id       BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity         INT NOT NULL CHECK (quantity > 0),
    unit_price       DECIMAL(10,2) NOT NULL,
    discount_amount  DECIMAL(10,2) NOT NULL DEFAULT 0,
    line_total       DECIMAL(10,2) NOT NULL
);


-- =============================================================================
-- SECTION 5: CAFE & BAR
-- Tables: menu_categories, menu_items, cafeteria_tables, cafeteria_tabs,
--         cafeteria_orders, cafeteria_order_items,
--         cafeteria_order_status_history, cafeteria_payments, bill_splits
-- =============================================================================

-- -----------------------------------------------
-- menu_categories: Top-level groupings for cafe menu items
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS menu_categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_menu_categories_updated_at
    BEFORE UPDATE ON menu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------
-- menu_items: Individual dishes / drinks on the cafe menu
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS menu_items (
    id               BIGSERIAL PRIMARY KEY,
    category_id      BIGINT NOT NULL REFERENCES menu_categories(id) ON DELETE RESTRICT,
    name             VARCHAR(200) NOT NULL,
    description      TEXT,
    image_url        TEXT,
    price            DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    discount_percent DECIMAL(5,2)  NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    is_available     BOOLEAN NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------
-- cafeteria_tables: Physical seating tables in the cafe / bar
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cafeteria_tables (
    id           BIGSERIAL PRIMARY KEY,
    table_number INT NOT NULL UNIQUE,
    capacity     INT NOT NULL CHECK (capacity > 0),
    status       VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',  -- AVAILABLE, OCCUPIED, RESERVED
    location     VARCHAR(100),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_cafeteria_tables_updated_at
    BEFORE UPDATE ON cafeteria_tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------
-- cafeteria_tabs: Running tab tied to a table (open/close billing)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cafeteria_tabs (
    id            BIGSERIAL PRIMARY KEY,
    table_id      BIGINT NOT NULL REFERENCES cafeteria_tables(id) ON DELETE RESTRICT,
    customer_id   BIGINT,                          -- FK to members (owned by teammate)
    running_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_open       BOOLEAN NOT NULL DEFAULT true,
    opened_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at     TIMESTAMPTZ
);


-- -----------------------------------------------
-- cafeteria_orders: Individual orders placed at the cafe
-- table_id and tab_id are both optional (takeaway has neither)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cafeteria_orders (
    id                   BIGSERIAL PRIMARY KEY,
    order_number         VARCHAR(30) NOT NULL UNIQUE,
    table_id             BIGINT REFERENCES cafeteria_tables(id) ON DELETE SET NULL,
    tab_id               BIGINT REFERENCES cafeteria_tabs(id) ON DELETE SET NULL,
    customer_id          BIGINT,
    order_type           VARCHAR(20) NOT NULL,       -- DINE_IN, TAKEAWAY, DELIVERY
    order_status         VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    subtotal             DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount      DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount           DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount         DECIMAL(10,2) NOT NULL DEFAULT 0,
    special_instructions TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cafeteria_orders_order_status ON cafeteria_orders(order_status);
CREATE INDEX idx_cafeteria_orders_table_id     ON cafeteria_orders(table_id);

CREATE TRIGGER trg_cafeteria_orders_updated_at
    BEFORE UPDATE ON cafeteria_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------
-- cafeteria_order_items: Line items within a cafeteria order
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cafeteria_order_items (
    id           BIGSERIAL PRIMARY KEY,
    order_id     BIGINT NOT NULL REFERENCES cafeteria_orders(id) ON DELETE CASCADE,
    menu_item_id BIGINT NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    quantity     INT NOT NULL CHECK (quantity > 0),
    unit_price   DECIMAL(10,2) NOT NULL,
    line_total   DECIMAL(10,2) NOT NULL,
    special_note TEXT
);


-- -----------------------------------------------
-- cafeteria_order_status_history: Audit trail of order status changes
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cafeteria_order_status_history (
    id         BIGSERIAL PRIMARY KEY,
    order_id   BIGINT NOT NULL REFERENCES cafeteria_orders(id) ON DELETE CASCADE,
    status     VARCHAR(20) NOT NULL,
    changed_by VARCHAR(100),
    notes      TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- -----------------------------------------------
-- cafeteria_payments: Payment records for cafeteria orders
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cafeteria_payments (
    id                    BIGSERIAL PRIMARY KEY,
    order_id              BIGINT NOT NULL REFERENCES cafeteria_orders(id) ON DELETE RESTRICT,
    amount_paid           DECIMAL(10,2) NOT NULL,
    payment_method        VARCHAR(30) NOT NULL,
    payment_status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_reference VARCHAR(100),
    paid_at               TIMESTAMPTZ
);


-- -----------------------------------------------
-- bill_splits: Per-person split of a cafeteria order bill
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS bill_splits (
    id             BIGSERIAL PRIMARY KEY,
    order_id       BIGINT NOT NULL REFERENCES cafeteria_orders(id) ON DELETE CASCADE,
    split_index    INT NOT NULL,
    payer_name     VARCHAR(100),
    amount         DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    paid_at        TIMESTAMPTZ
);


-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
