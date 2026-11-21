-- ============================================================================
-- ClubSphere - Sports Club Management System
-- Database Schema (PostgreSQL)
-- Modules: Authentication & User Management, Membership, Staff Management
-- ============================================================================

-- Drop existing tables if re-running (in reverse dependency order)
DROP TABLE IF EXISTS salary_records CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employee_shift_schedules CASCADE;
DROP TABLE IF EXISTS employee_shifts CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS membership_transactions CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS membership_plans CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ============================================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- ROLE_ADMIN, ROLE_STAFF, ROLE_MEMBER
    description VARCHAR(255)
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- ============================================================================
-- 2. MEMBERSHIP MANAGEMENT
-- ============================================================================

CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    member_code VARCHAR(50) NOT NULL UNIQUE, -- e.g. CS-MB-2026-0001
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    blood_group VARCHAR(10),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership_plans (
    id SERIAL PRIMARY KEY,
    plan_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. GOLD-YR, SILVER-MN, JUNIOR-YR
    name VARCHAR(100) NOT NULL,            -- Gold Membership, Silver Membership, Junior Membership
    category VARCHAR(30) NOT NULL,         -- GOLD, SILVER, JUNIOR
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,         -- Configurable by Admin
    duration_days INT NOT NULL,            -- e.g. 30, 90, 365
    min_age INT,                           -- Minimum age allowed
    max_age INT,                           -- Maximum age (e.g. 17 for Junior)
    benefits TEXT,                         -- JSON or formatted list of benefits
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE memberships (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    plan_id INT NOT NULL REFERENCES membership_plans(id) ON DELETE RESTRICT,
    membership_number VARCHAR(50) NOT NULL UNIQUE, -- e.g. CS-MEM-2026-00101
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, EXPIRED, PENDING_PAYMENT, SUSPENDED, CANCELLED
    qr_code_token VARCHAR(255) NOT NULL UNIQUE,   -- Secure random verification token
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership_transactions (
    id BIGSERIAL PRIMARY KEY,
    membership_id BIGINT NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    transaction_type VARCHAR(30) NOT NULL,       -- NEW_REGISTRATION, RENEWAL, UPGRADE
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,         -- CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, CASH
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PAID', -- PAID, PENDING, FAILED, REFUNDED
    transaction_reference VARCHAR(100) UNIQUE,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_code ON members(member_code);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_end_date ON memberships(end_date);
CREATE INDEX idx_memberships_qr_token ON memberships(qr_code_token);

-- ============================================================================
-- 3. STAFF MANAGEMENT
-- ============================================================================

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Administration, Sports Coaching, Court Operations, Cafe & Bar, Facility & Maintenance
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) NOT NULL UNIQUE, -- e.g. CS-EMP-001
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    designation VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL,
    employment_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, ON_LEAVE, TERMINATED
    employment_type VARCHAR(30) NOT NULL DEFAULT 'FULL_TIME', -- FULL_TIME, PART_TIME, CONTRACT
    base_salary NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_shifts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- Morning Shift, Evening Shift, General Shift
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT
);

CREATE TABLE employee_shift_schedules (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    shift_id INT NOT NULL REFERENCES employee_shifts(id) ON DELETE RESTRICT,
    schedule_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- PRESENT, ABSENT, HALF_DAY, ON_LEAVE
    check_in_time TIME,
    check_out_time TIME,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_employee_attendance_date UNIQUE (employee_id, attendance_date)
);

CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(30) NOT NULL, -- CASUAL, SICK, ANNUAL, UNPAID
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CANCELLED
    admin_remarks TEXT,
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salary_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    pay_period_month INT NOT NULL, -- 1 to 12
    pay_period_year INT NOT NULL,  -- e.g. 2026
    base_salary NUMERIC(12, 2) NOT NULL,
    allowances NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    deductions NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    net_salary NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, PAID
    payment_date DATE,
    payment_reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_employee_pay_period UNIQUE (employee_id, pay_period_month, pay_period_year)
);

CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_attendance_emp_date ON attendance(employee_id, attendance_date);
CREATE INDEX idx_leaves_status ON leave_requests(status);
CREATE INDEX idx_salary_period ON salary_records(pay_period_year, pay_period_month);
