-- ============================================================================
-- CLUBSPHERE – STAFF DASHBOARD, WORKFLOW, PERMISSIONS & DEPARTMENT ISOLATION SCHEMA
-- ============================================================================

-- 1. Ensure Department code column exists & standard codes are mapped
ALTER TABLE departments ADD COLUMN IF NOT EXISTS code VARCHAR(50) UNIQUE;

UPDATE departments SET code = 'ADMIN' WHERE id = 1 AND (code IS NULL OR code = '');
UPDATE departments SET code = 'COACHING' WHERE id = 2 AND (code IS NULL OR code = '');
UPDATE departments SET code = 'COURT_OPS' WHERE id = 3 AND (code IS NULL OR code = '');
UPDATE departments SET code = 'FOOD_SHOP', name = 'Food Shop & Sports Cafe' WHERE id = 4;
UPDATE departments SET code = 'FACILITY' WHERE id = 5 AND (code IS NULL OR code = '');

INSERT INTO departments (name, code, description, is_active)
SELECT 'Sports Accessories Shop', 'SPORTS_SHOP', 'Pro Sports Accessories & Equipment Store', TRUE
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE code = 'SPORTS_SHOP');

-- 2. Granular Permissions System
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(80) NOT NULL UNIQUE,
    department_code VARCHAR(50), -- SPORTS_SHOP, FOOD_SHOP, ALL
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_permissions (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_emp_perm UNIQUE (employee_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_staff_permissions_emp ON staff_permissions(employee_id);

-- 3. Operational Support Tickets (Staff to Admin / Operations)
CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    department_code VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL, -- LOGIN, ORDER, INVENTORY, PAYMENT, BILLING, ATTENDANCE, SHIFT, OTHER
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(30) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(30) DEFAULT 'OPEN',     -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_dept ON support_tickets(department_code);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- 4. Audit Logs (Department Isolation Violations & Operational Actions)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    employee_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    department_code VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================================
-- 5. SPORTS ACCESSORIES SHOP TABLES (SPORTS_SHOP ONLY)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sports_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS sports_products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id INT REFERENCES sports_categories(id) ON DELETE SET NULL,
    brand VARCHAR(100),
    sku VARCHAR(80) UNIQUE,
    barcode VARCHAR(80),
    description TEXT,
    purchase_price NUMERIC(10,2) DEFAULT 0.00,
    selling_price NUMERIC(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(255),
    rating NUMERIC(2,1) DEFAULT 4.8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sports_product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES sports_products(id) ON DELETE CASCADE,
    size VARCHAR(50),
    color VARCHAR(50),
    sku VARCHAR(80) UNIQUE,
    stock_quantity INT DEFAULT 0,
    additional_price NUMERIC(10,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS sports_inventory_movements (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES sports_products(id) ON DELETE CASCADE,
    variant_id BIGINT REFERENCES sports_product_variants(id) ON DELETE SET NULL,
    movement_type VARCHAR(50) NOT NULL, -- OPENING_STOCK, CUSTOMER_PURCHASE, SELLABLE_RETURN, DAMAGED_ITEM, RESTOCK, CORRECTION
    quantity INT NOT NULL,
    stock_before INT NOT NULL,
    stock_after INT NOT NULL,
    reason TEXT NOT NULL,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sports_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150),
    customer_phone VARCHAR(50),
    membership_tier VARCHAR(30) DEFAULT 'NON_MEMBER', -- GOLD, SILVER, JUNIOR, NON_MEMBER
    membership_discount_percent NUMERIC(5,2) DEFAULT 0.00,
    subtotal NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    tax_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- CASH, CARD, UPI, ONLINE
    payment_status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED', -- PENDING, COMPLETED, REFUNDED
    order_status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, ACCEPTED, PACKING, READY_FOR_PICKUP, DISPATCHED, COMPLETED, REJECTED, CANCELLED
    fulfilment_type VARCHAR(50) NOT NULL DEFAULT 'PICKUP', -- PICKUP, COUNTER, DELIVERY
    delivery_address TEXT,
    assigned_staff_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sports_order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES sports_orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES sports_products(id) ON DELETE CASCADE,
    variant_id BIGINT REFERENCES sports_product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(150) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS sports_order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES sports_orders(id) ON DELETE CASCADE,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    action_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sports_returns (
    id BIGSERIAL PRIMARY KEY,
    return_number VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT REFERENCES sports_orders(id) ON DELETE SET NULL,
    order_item_id BIGINT REFERENCES sports_order_items(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    reason TEXT NOT NULL,
    condition VARCHAR(50) NOT NULL DEFAULT 'SELLABLE', -- SELLABLE, DAMAGED, DEFECTIVE
    status VARCHAR(50) NOT NULL DEFAULT 'UNDER_REVIEW', -- REQUESTED, UNDER_REVIEW, APPROVED, REJECTED, RECEIVED, REFUNDED
    refund_amount NUMERIC(10,2) NOT NULL,
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sports_counter_sales (
    id BIGSERIAL PRIMARY KEY,
    sale_number VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT REFERENCES sports_orders(id) ON DELETE SET NULL,
    staff_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(100),
    receipt_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. FOOD SHOP / CAFE TABLES (FOOD_SHOP ONLY)
-- ============================================================================

CREATE TABLE IF NOT EXISTS food_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS food_menu_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id INT REFERENCES food_categories(id) ON DELETE SET NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    is_vegetarian BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    prep_time_minutes INT DEFAULT 15,
    image_url VARCHAR(255),
    calories INT,
    allergens VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_tables (
    id SERIAL PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL DEFAULT 4,
    section VARCHAR(50) DEFAULT 'MAIN_CAFE', -- MAIN_CAFE, PATIO, LOUNGE, BALCONY
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, OCCUPIED, RESERVED, CLEANING, OUT_OF_SERVICE
    current_order_id BIGINT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_ingredients (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- KG, LITERS, PIECES, GRAMS, PACKETS
    current_stock NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    reorder_threshold NUMERIC(10,2) NOT NULL DEFAULT 5.00,
    cost_per_unit NUMERIC(10,2) DEFAULT 0.00,
    expiry_date DATE,
    is_available BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_inventory_movements (
    id BIGSERIAL PRIMARY KEY,
    ingredient_id BIGINT NOT NULL REFERENCES food_ingredients(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- STOCK_RECEIVED, USAGE, WASTAGE, DAMAGED, EXPIRED, CORRECTION
    quantity NUMERIC(10,2) NOT NULL,
    stock_before NUMERIC(10,2) NOT NULL,
    stock_after NUMERIC(10,2) NOT NULL,
    reason TEXT NOT NULL,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150),
    customer_phone VARCHAR(50),
    order_type VARCHAR(50) NOT NULL DEFAULT 'COUNTER', -- COUNTER, TABLE, TAKEAWAY, ONLINE
    table_id INT REFERENCES food_tables(id) ON DELETE SET NULL,
    table_number VARCHAR(20),
    membership_tier VARCHAR(30) DEFAULT 'NON_MEMBER', -- GOLD, SILVER, JUNIOR, NON_MEMBER
    membership_discount_percent NUMERIC(5,2) DEFAULT 0.00,
    subtotal NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    tax_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'CASH', -- CASH, CARD, UPI, ONLINE
    payment_status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED', -- PENDING, COMPLETED, REFUNDED
    order_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, PREPARING, READY, COMPLETED, REJECTED, CANCELLED
    special_instructions TEXT,
    assigned_staff_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    preparing_at TIMESTAMP WITH TIME ZONE,
    ready_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES food_orders(id) ON DELETE CASCADE,
    menu_item_id BIGINT NOT NULL REFERENCES food_menu_items(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL,
    special_note VARCHAR(200),
    total_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS food_bills (
    id BIGSERIAL PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL REFERENCES food_orders(id) ON DELETE CASCADE,
    table_number VARCHAR(20),
    subtotal NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    tax_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    is_split BOOLEAN DEFAULT FALSE,
    split_parts INT DEFAULT 1,
    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'PAID', -- PAID, PARTIAL, UNPAID
    created_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & fast department filtering
CREATE INDEX IF NOT EXISTS idx_sports_orders_status ON sports_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_sports_orders_created ON sports_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_food_orders_status ON food_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_food_orders_created ON food_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_food_tables_status ON food_tables(status);
