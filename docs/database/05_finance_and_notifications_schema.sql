-- =========================================================================
-- CLUBSPHERE: FINANCE, ACCOUNTING & CENTRALIZED NOTIFICATIONS SCHEMA
-- docs/database/05_finance_and_notifications_schema.sql
-- =========================================================================

-- 1. Enhance notifications table for multi-role audience and severity
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_role VARCHAR(30);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'SYSTEM';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS severity VARCHAR(20) DEFAULT 'INFO';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_entity_type VARCHAR(50);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_entity_id BIGINT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url VARCHAR(255);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Create indexes on notifications
CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(recipient_role);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 2. Create Unified Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    payment_reference VARCHAR(60) NOT NULL UNIQUE,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    member_id BIGINT REFERENCES members(id) ON DELETE SET NULL,
    source_module VARCHAR(40) NOT NULL, -- MEMBERSHIP, MEMBERSHIP_RENEWAL, MEMBERSHIP_UPGRADE, COURT_BOOKING, SPORTS_SHOP, FOOD_BEVERAGE, OTHER
    related_entity_id BIGINT,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- UPI, CASH, CARD, ONLINE, NET_BANKING
    payment_status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, PENDING, FAILED, REFUNDED, PARTIALLY_REFUNDED
    refund_amount NUMERIC(12, 2) DEFAULT 0.00,
    refund_reason TEXT,
    received_by_staff_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    payer_name VARCHAR(120),
    payer_email VARCHAR(120),
    notes TEXT,
    is_demo BOOLEAN DEFAULT TRUE,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_source ON payments(source_module);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- 3. Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    expense_reference VARCHAR(60) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL, -- STAFF_SALARY, EQUIPMENT_PURCHASE, COURT_MAINTENANCE, UTILITIES_ELECTRICITY, SHOP_INVENTORY, EVENT_EXPENSE, OTHER
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'BANK_TRANSFER', -- UPI, CASH, BANK_TRANSFER, CARD
    vendor_name VARCHAR(150),
    receipt_url VARCHAR(255),
    recorded_by_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- 4. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(60) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    performed_by VARCHAR(120) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
