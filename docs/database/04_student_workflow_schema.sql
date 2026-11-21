-- ==============================================================================
-- ClubSphere – Student Workflow, 7-Day Trial, Shop, Promotions & Notifications Schema
-- ==============================================================================

-- 1. Enhance users table with student and trial fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_status VARCHAR(30) DEFAULT 'NOT_STARTED';
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_start_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_end_date DATE;

-- 2. Signup OTP Verification Table
CREATE TABLE IF NOT EXISTS signup_otps (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    plain_otp_for_dev VARCHAR(10),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_signup_otps_email ON signup_otps(email);

-- 3. Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    plain_token_for_dev VARCHAR(10),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_email ON password_reset_tokens(email);

-- 4. Centralized In-App Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- WELCOME, TRIAL, MEMBERSHIP, BOOKING, SYSTEM, PROMOTION
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- 5. Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- MEMBERSHIP, STUDENT, SPORTS_SHOP, FOOD_SHOP, TOURNAMENT
    discount_text VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    coupon_code VARCHAR(50),
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED
    terms TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Shop Products Table (Sports Accessory & Food/Beverage)
CREATE TABLE IF NOT EXISTS shop_products (
    id BIGSERIAL PRIMARY KEY,
    shop_type VARCHAR(50) NOT NULL, -- SPORTS_ACCESSORY, FOOD_BEVERAGE
    category VARCHAR(50) NOT NULL, -- RACKETS, BALLS, SHOES, ACCESSORIES, APPAREL, FOOD, DRINKS, SNACKS
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    pickup_info VARCHAR(255),
    rating NUMERIC(2,1) DEFAULT 4.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. One Active Membership constraint on memberships
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_membership ON memberships (member_id) WHERE status = 'ACTIVE';
