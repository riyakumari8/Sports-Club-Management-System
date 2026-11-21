-- ============================================================================
-- ClubSphere - Sports Club Management System
-- Seed Data Script (PostgreSQL)
-- ============================================================================

-- 1. ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Club Administrator with full privileges across all modules'),
(2, 'ROLE_STAFF', 'Club Staff with access to shifts, attendance, leaves, and member lookup'),
(3, 'ROLE_MEMBER', 'Registered club member with access to membership, cards, and bookings')
ON CONFLICT (id) DO NOTHING;

-- 2. DEPARTMENTS
INSERT INTO departments (id, name, description, is_active) VALUES
(1, 'Administration', 'Executive, HR, and general club management', true),
(2, 'Sports Coaching', 'Professional trainers for tennis, badminton, swimming, and gym', true),
(3, 'Court Operations', 'Court maintenance, scheduling, and gear assistance', true),
(4, 'Cafe & Bar', 'Hospitality, dining, and beverage services', true),
(5, 'Facility & Maintenance', 'Premises maintenance, security, and cleaning operations', true)
ON CONFLICT (id) DO NOTHING;

-- 3. EMPLOYEE SHIFTS
INSERT INTO employee_shifts (id, name, start_time, end_time, description) VALUES
(1, 'Morning Shift', '06:00:00', '14:00:00', 'Early morning court prep and coaching session'),
(2, 'Evening Shift', '14:00:00', '22:00:00', 'Peak evening matches, gym, and dining hours'),
(3, 'General Shift', '09:00:00', '18:00:00', 'Standard administrative and back-office operations')
ON CONFLICT (id) DO NOTHING;

-- 4. MEMBERSHIP PLANS
INSERT INTO membership_plans (id, plan_code, name, category, description, price, duration_days, min_age, max_age, benefits, is_active) VALUES
(1, 'GOLD-YR', 'Gold Membership', 'GOLD', 'Premium full club access with VIP privileges, free court bookings, and priority events', 15000.00, 365, NULL, NULL, '["Unlimited All-Court Access", "Priority 7-Day Advance Booking", "15% Sports Shop Discount", "10% Cafe & Bar Discount", "Complimentary Locker & Towel Service", "Free Guest Passes (4/year)"]', true),
(2, 'SILVER-HY', 'Silver Membership', 'SILVER', 'Standard membership with regular court access, fitness center privileges, and club discounts', 8000.00, 180, NULL, NULL, '["Standard Court Access (Mon-Fri Peak, All-Day Off-Peak)", "3-Day Advance Booking", "10% Sports Shop Discount", "5% Cafe & Bar Discount", "Fitness Center Access"]', true),
(3, 'JUNIOR-YR', 'Junior Membership', 'JUNIOR', 'Special discounted youth membership designed for young athletes under 18 years of age', 5000.00, 365, 5, 17, '["Access to Junior Coaching Clinics", "Discounted Academy Sessions", "Weekend Morning Court Access", "5% Sports Shop Discount", "Dedicated Youth Tournaments"]', true)
ON CONFLICT (id) DO NOTHING;

-- Reset sequences
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('employee_shifts_id_seq', (SELECT MAX(id) FROM employee_shifts));
SELECT setval('membership_plans_id_seq', (SELECT MAX(id) FROM membership_plans));
