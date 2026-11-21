-- ==============================================================================
-- ClubSphere – Comprehensive Evaluation & Viva Demonstration Mock Data
-- ==============================================================================
-- Run against database: clubsphere_db
-- Populates rich, realistic data across:
-- 1. Users, Members & Multi-Tier Subscriptions (Gold, Silver, Junior, Expired)
-- 2. Staff Directory across 5 Departments, Duty Shifts & Allocations
-- 3. Membership Payment & Financial Transactions
-- 4. Daily Attendance Punch Logs (Today & Past 7 Days)
-- 5. Leave Approval Workflow (Pending, Approved, Rejected)
-- 6. Monthly Payroll & Salary Records (Oct & Nov 2026)
-- 7. Court Bookings across Championship Courts (Confirmed, Checked-In, Completed)
-- 8. Booking Waitlist & Court Maintenance
-- 9. Visitor Enquiries & Lead CRM Pipeline with Follow-up History
-- 10. Coaching Trial Sessions & Social Play Rosters
-- ==============================================================================

-- 1. INSERT ADDITIONAL REALISTIC USERS (Password for all: Staff@123 for staff, Member@123 for members)
-- Hash for Staff@123: $2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm
-- Hash for Member@123: $2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm

-- Staff Users
INSERT INTO users (email, password_hash, full_name, phone, address, date_of_birth, gender, status)
VALUES 
('sunita.rao@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Sunita Rao', '+91 9822334455', 'B-12 Defence Colony, New Delhi', '1993-04-12', 'Female', 'ACTIVE'),
('vikram.d@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Vikram Deshmukh', '+91 9833445566', '45 Hiranandani Estate, Thane', '1990-11-25', 'Male', 'ACTIVE'),
('meera.j@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Meera Joshi', '+91 9844556677', 'Sector 14, Chandigarh', '1994-08-19', 'Female', 'ACTIVE'),
('rajesh.k@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Rajesh Kumar', '+91 9855667788', 'Plot 88, Okhla Phase 3, New Delhi', '1988-02-14', 'Male', 'ACTIVE'),
('amit.b@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Amit Bansal', '+91 9866778899', 'Tower 4, Golf Course Ext Road, Gurugram', '1992-12-05', 'Male', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Member Users
INSERT INTO users (email, password_hash, full_name, phone, address, date_of_birth, gender, status)
VALUES 
('neha.sharma@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Neha Sharma', '+91 9722334455', 'Flat 302, Palm Springs, Gurugram', '1995-07-18', 'Female', 'ACTIVE'),
('rohit.kapoor@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Rohit Kapoor', '+91 9733445566', 'A-49 Greater Kailash 1, New Delhi', '1989-03-22', 'Male', 'ACTIVE'),
('priya.nair@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Priya Nair', '+91 9744556677', 'Villa 12, Sobha City, Bengaluru', '1996-09-30', 'Female', 'ACTIVE'),
('ananya.iyer@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Ananya Iyer', '+91 9755667788', '77 Indira Nagar, Bengaluru', '2012-05-14', 'Female', 'ACTIVE'),
('arjun.patel@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Arjun Patel', '+91 9766778899', '204 Satellite Road, Ahmedabad', '1991-10-08', 'Male', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- 2. ASSIGN USER ROLES
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email IN ('sunita.rao@clubsphere.com', 'vikram.d@clubsphere.com', 'meera.j@clubsphere.com', 'rajesh.k@clubsphere.com', 'amit.b@clubsphere.com')
AND r.name = 'ROLE_STAFF'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email IN ('neha.sharma@example.com', 'rohit.kapoor@example.com', 'priya.nair@example.com', 'ananya.iyer@example.com', 'arjun.patel@example.com')
AND r.name = 'ROLE_MEMBER'
ON CONFLICT DO NOTHING;

-- 3. INSERT EMPLOYEES ACROSS DEPARTMENTS
INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'CS-EMP-002', 3, 'Court Operations Supervisor', '2023-05-15', 'ACTIVE', 'FULL_TIME', 38000.00
FROM users u WHERE u.email = 'sunita.rao@clubsphere.com'
ON CONFLICT (employee_code) DO NOTHING;

INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'CS-EMP-003', 2, 'Chief Strength & Conditioning Coach', '2023-08-01', 'ACTIVE', 'FULL_TIME', 42000.00
FROM users u WHERE u.email = 'vikram.d@clubsphere.com'
ON CONFLICT (employee_code) DO NOTHING;

INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'CS-EMP-004', 4, 'Sports Cafe & Nutrition Manager', '2024-01-10', 'ACTIVE', 'FULL_TIME', 35000.00
FROM users u WHERE u.email = 'meera.j@clubsphere.com'
ON CONFLICT (employee_code) DO NOTHING;

INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'CS-EMP-005', 5, 'Facility & Turf Maintenance Lead', '2022-11-20', 'ACTIVE', 'FULL_TIME', 32000.00
FROM users u WHERE u.email = 'rajesh.k@clubsphere.com'
ON CONFLICT (employee_code) DO NOTHING;

INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'CS-EMP-006', 1, 'Accounts & Membership Coordinator', '2023-02-01', 'ACTIVE', 'FULL_TIME', 40000.00
FROM users u WHERE u.email = 'amit.b@clubsphere.com'
ON CONFLICT (employee_code) DO NOTHING;

-- 4. INSERT MEMBERS & SUBSCRIPTIONS
INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0003', 'Rajesh Sharma', '+91 9722334400', 'A+', 'ACTIVE'
FROM users u WHERE u.email = 'neha.sharma@example.com'
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0004', 'Kavita Kapoor', '+91 9733445500', 'O-', 'ACTIVE'
FROM users u WHERE u.email = 'rohit.kapoor@example.com'
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0005', 'Gopal Nair', '+91 9744556600', 'B+', 'ACTIVE'
FROM users u WHERE u.email = 'priya.nair@example.com'
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0006', 'Meenakshi Iyer (Mother)', '+91 9755667700', 'AB+', 'ACTIVE'
FROM users u WHERE u.email = 'ananya.iyer@example.com'
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0007', 'Sneha Patel', '+91 9766778800', 'O+', 'EXPIRED'
FROM users u WHERE u.email = 'arjun.patel@example.com'
ON CONFLICT (member_code) DO NOTHING;

-- Subscriptions & Memberships
-- Neha Sharma (Silver Plan)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 2, 'CS-MEM-2026-00103', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '120 days', 'ACTIVE', 'CS-QR-NEHA-SHARMA-9901', true
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'neha.sharma@example.com'
ON CONFLICT (membership_number) DO NOTHING;

-- Rohit Kapoor (Gold Plan)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 1, 'CS-MEM-2026-00104', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', 'ACTIVE', 'CS-QR-ROHIT-KAPOOR-9902', true
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'rohit.kapoor@example.com'
ON CONFLICT (membership_number) DO NOTHING;

-- Priya Nair (Gold Plan)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 1, 'CS-MEM-2026-00105', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '355 days', 'ACTIVE', 'CS-QR-PRIYA-NAIR-9903', true
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'priya.nair@example.com'
ON CONFLICT (membership_number) DO NOTHING;

-- Ananya Iyer (Junior Plan, 14 yrs)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 3, 'CS-MEM-2026-00106', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '320 days', 'ACTIVE', 'CS-QR-ANANYA-IYER-9904', false
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'ananya.iyer@example.com'
ON CONFLICT (membership_number) DO NOTHING;

-- Arjun Patel (Silver Plan - Recently EXPIRED for renewal demo!)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 2, 'CS-MEM-2026-00107', CURRENT_DATE - INTERVAL '185 days', CURRENT_DATE - INTERVAL '5 days', 'EXPIRED', 'CS-QR-ARJUN-PATEL-9905', false
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'arjun.patel@example.com'
ON CONFLICT (membership_number) DO NOTHING;

-- 5. MEMBERSHIP FINANCIAL TRANSACTIONS
INSERT INTO membership_transactions (membership_id, member_id, transaction_type, amount, payment_method, payment_status, transaction_reference, paid_at)
SELECT m.id, m.member_id, 'NEW_REGISTRATION', 8000.00, 'UPI', 'PAID', 'TXN-EVAL-001', CURRENT_TIMESTAMP - INTERVAL '60 days'
FROM memberships m JOIN members mem ON m.member_id = mem.id JOIN users u ON mem.user_id = u.id WHERE u.email = 'neha.sharma@example.com'
ON CONFLICT (transaction_reference) DO NOTHING;

INSERT INTO membership_transactions (membership_id, member_id, transaction_type, amount, payment_method, payment_status, transaction_reference, paid_at)
SELECT m.id, m.member_id, 'NEW_REGISTRATION', 15000.00, 'CREDIT_CARD', 'PAID', 'TXN-EVAL-002', CURRENT_TIMESTAMP - INTERVAL '90 days'
FROM memberships m JOIN members mem ON m.member_id = mem.id JOIN users u ON mem.user_id = u.id WHERE u.email = 'rohit.kapoor@example.com'
ON CONFLICT (transaction_reference) DO NOTHING;

INSERT INTO membership_transactions (membership_id, member_id, transaction_type, amount, payment_method, payment_status, transaction_reference, paid_at)
SELECT m.id, m.member_id, 'NEW_REGISTRATION', 15000.00, 'UPI', 'PAID', 'TXN-EVAL-003', CURRENT_TIMESTAMP - INTERVAL '10 days'
FROM memberships m JOIN members mem ON m.member_id = mem.id JOIN users u ON mem.user_id = u.id WHERE u.email = 'priya.nair@example.com'
ON CONFLICT (transaction_reference) DO NOTHING;

INSERT INTO membership_transactions (membership_id, member_id, transaction_type, amount, payment_method, payment_status, transaction_reference, paid_at)
SELECT m.id, m.member_id, 'NEW_REGISTRATION', 5000.00, 'NET_BANKING', 'PAID', 'TXN-EVAL-004', CURRENT_TIMESTAMP - INTERVAL '45 days'
FROM memberships m JOIN members mem ON m.member_id = mem.id JOIN users u ON mem.user_id = u.id WHERE u.email = 'ananya.iyer@example.com'
ON CONFLICT (transaction_reference) DO NOTHING;

INSERT INTO membership_transactions (membership_id, member_id, transaction_type, amount, payment_method, payment_status, transaction_reference, paid_at)
SELECT m.id, m.member_id, 'NEW_REGISTRATION', 8000.00, 'DEBIT_CARD', 'PAID', 'TXN-EVAL-005', CURRENT_TIMESTAMP - INTERVAL '185 days'
FROM memberships m JOIN members mem ON m.member_id = mem.id JOIN users u ON mem.user_id = u.id WHERE u.email = 'arjun.patel@example.com'
ON CONFLICT (transaction_reference) DO NOTHING;

-- 6. DAILY ATTENDANCE RECORDS (Past 7 Days + Today for All Employees)
INSERT INTO attendance (employee_id, attendance_date, status, check_in_time, check_out_time, remarks)
SELECT e.id, d.dt,
  CASE 
    WHEN EXTRACT(DOW FROM d.dt) = 0 THEN 'ON_LEAVE'
    WHEN e.employee_code = 'CS-EMP-003' AND d.dt = CURRENT_DATE - INTERVAL '2 days' THEN 'HALF_DAY'
    WHEN e.employee_code = 'CS-EMP-006' AND d.dt = CURRENT_DATE THEN 'ON_LEAVE'
    ELSE 'PRESENT'
  END,
  '08:45:00',
  '17:45:00',
  'Biometric gate verify'
FROM employees e
CROSS JOIN (
  SELECT (CURRENT_DATE - i)::date AS dt
  FROM generate_series(0, 6) AS i
) d
ON CONFLICT (employee_id, attendance_date) DO NOTHING;

-- 7. SHIFT SCHEDULES FOR EMPLOYEES
INSERT INTO employee_shift_schedules (employee_id, shift_id, schedule_date, status)
SELECT e.id, 
  CASE 
    WHEN e.employee_code IN ('CS-EMP-001', 'CS-EMP-002') THEN 1 -- Morning Shift (06:00 - 14:00)
    WHEN e.employee_code IN ('CS-EMP-003', 'CS-EMP-004') THEN 2 -- Evening Shift (14:00 - 22:00)
    ELSE 3 -- General Shift (09:00 - 18:00)
  END,
  CURRENT_DATE,
  'SCHEDULED'
FROM employees e;

INSERT INTO employee_shift_schedules (employee_id, shift_id, schedule_date, status)
SELECT e.id, 
  CASE 
    WHEN e.employee_code IN ('CS-EMP-001', 'CS-EMP-002') THEN 1
    WHEN e.employee_code IN ('CS-EMP-003', 'CS-EMP-004') THEN 2
    ELSE 3
  END,
  CURRENT_DATE + INTERVAL '1 day',
  'SCHEDULED'
FROM employees e;

-- 8. REALISTIC LEAVE REQUESTS
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason, status, admin_remarks, reviewed_by, reviewed_at)
SELECT e.id, 'CASUAL', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 3,
  'Attending National Tennis Coaching Masterclass in Pune', 'APPROVED',
  'Approved. Please arrange court cover with Coach Vikram.', (SELECT id FROM users WHERE email = 'admin@clubsphere.com'), CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM employees e WHERE e.employee_code = 'CS-EMP-001'
AND NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee_id = e.id AND reason LIKE 'Attending National Tennis%');

INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason, status, admin_remarks, reviewed_by, reviewed_at)
SELECT e.id, 'SICK', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days', 2,
  'Severe seasonal viral fever and throat infection', 'APPROVED',
  'Approved on medical grounds. Take care.', (SELECT id FROM users WHERE email = 'admin@clubsphere.com'), CURRENT_TIMESTAMP - INTERVAL '4 days'
FROM employees e WHERE e.employee_code = 'CS-EMP-002'
AND NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee_id = e.id AND reason LIKE 'Severe seasonal viral%');

INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason, status, admin_remarks)
SELECT e.id, 'ANNUAL', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '14 days', 5,
  'Family pilgrimage and annual leave to Tirupati', 'PENDING', NULL
FROM employees e WHERE e.employee_code = 'CS-EMP-003'
AND NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee_id = e.id AND reason LIKE 'Family pilgrimage%');

INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason, status, admin_remarks, reviewed_by, reviewed_at)
SELECT e.id, 'CASUAL', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', 1,
  'Personal errand and bank work', 'REJECTED',
  'Regret, major Inter-Club Cricket Tournament is hosted on this date.', (SELECT id FROM users WHERE email = 'admin@clubsphere.com'), CURRENT_TIMESTAMP - INTERVAL '2 hours'
FROM employees e WHERE e.employee_code = 'CS-EMP-005'
AND NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee_id = e.id AND reason LIKE 'Personal errand%');

-- 9. MONTHLY SALARY RECORDS (October 2026 and November 2026)
INSERT INTO salary_records (employee_id, pay_period_month, pay_period_year, base_salary, allowances, deductions, net_salary, payment_status, payment_date, payment_reference)
SELECT e.id, 10, 2026, e.base_salary, 2500.00, 1200.00, (e.base_salary + 2500.00 - 1200.00), 'PAID', '2026-10-31', 'NEFT-HDFC-OCT-' || e.employee_code
FROM employees e
ON CONFLICT (employee_id, pay_period_month, pay_period_year) DO NOTHING;

INSERT INTO salary_records (employee_id, pay_period_month, pay_period_year, base_salary, allowances, deductions, net_salary, payment_status, payment_date, payment_reference)
SELECT e.id, 11, 2026, e.base_salary, 2500.00, 1200.00, (e.base_salary + 2500.00 - 1200.00), 'PAID', '2026-11-20', 'NEFT-HDFC-NOV-' || e.employee_code
FROM employees e
ON CONFLICT (employee_id, pay_period_month, pay_period_year) DO NOTHING;

-- 10. COURT BOOKINGS ACROSS COURTS
-- Booking 1: Centre Court 1 today morning (Checked in)
INSERT INTO court_bookings (
  booking_reference, court_id, member_id, guest_name, guest_email, guest_phone,
  booking_date, start_time, end_time, slot_start_utc, slot_end_utc,
  base_amount, discount_amount, final_amount, booking_status, payment_status, payment_reference, checked_in_at
)
VALUES (
  'CS-BK-2026-00101', 1, 1, 'Vikram Singh', 'vikram.singh@example.com', '+91 9711223344',
  CURRENT_DATE, '08:00:00', '09:00:00', CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours',
  600.00, 600.00, 0.00, 'CHECKED_IN', 'PAID', 'MEM-QUOTA-001', CURRENT_TIMESTAMP - INTERVAL '4 hours'
)
ON CONFLICT (booking_reference) DO NOTHING;

-- Booking 2: Clay Court 2 today evening (Confirmed)
INSERT INTO court_bookings (
  booking_reference, court_id, member_id, guest_name, guest_email, guest_phone,
  booking_date, start_time, end_time, slot_start_utc, slot_end_utc,
  base_amount, discount_amount, final_amount, booking_status, payment_status, payment_reference
)
VALUES (
  'CS-BK-2026-00102', 2, 4, 'Rohit Kapoor', 'rohit.kapoor@example.com', '+91 9733445566',
  CURRENT_DATE, '18:00:00', '19:00:00', CURRENT_TIMESTAMP + INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '2 hours',
  700.00, 700.00, 0.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-002'
)
ON CONFLICT (booking_reference) DO NOTHING;

-- Booking 3: Indoor Cricket Nets Lane A tomorrow (Confirmed)
INSERT INTO court_bookings (
  booking_reference, court_id, member_id, guest_name, guest_email, guest_phone,
  booking_date, start_time, end_time, slot_start_utc, slot_end_utc,
  base_amount, discount_amount, final_amount, booking_status, payment_status, payment_reference
)
VALUES (
  'CS-BK-2026-00103', 5, 3, 'Neha Sharma', 'neha.sharma@example.com', '+91 9722334455',
  CURRENT_DATE + INTERVAL '1 day', '10:00:00', '11:00:00', CURRENT_TIMESTAMP + INTERVAL '15 hours', CURRENT_TIMESTAMP + INTERVAL '16 hours',
  500.00, 125.00, 375.00, 'CONFIRMED', 'PAID', 'UPI-TXN-5541'
)
ON CONFLICT (booking_reference) DO NOTHING;

-- Booking 4: Main Cricket Pitch weekend corporate match (Confirmed)
INSERT INTO court_bookings (
  booking_reference, court_id, member_id, guest_name, guest_email, guest_phone,
  booking_date, start_time, end_time, slot_start_utc, slot_end_utc,
  base_amount, discount_amount, final_amount, booking_status, payment_status, payment_reference
)
VALUES (
  'CS-BK-2026-00104', 4, NULL, 'Aditya Birla Corporate XI', 'sports.desk@adityabirla.com', '+91 9911223344',
  CURRENT_DATE + INTERVAL '2 days', '14:00:00', '17:00:00', CURRENT_TIMESTAMP + INTERVAL '40 hours', CURRENT_TIMESTAMP + INTERVAL '43 hours',
  7500.00, 0.00, 7500.00, 'CONFIRMED', 'PAID', 'RAZORPAY-CORP-9921'
)
ON CONFLICT (booking_reference) DO NOTHING;

-- Booking 5: Centre Court 1 today afternoon (Confirmed - ready to test Front Desk Check-in button!)
INSERT INTO court_bookings (
  booking_reference, court_id, member_id, guest_name, guest_email, guest_phone,
  booking_date, start_time, end_time, slot_start_utc, slot_end_utc,
  base_amount, discount_amount, final_amount, booking_status, payment_status, payment_reference
)
VALUES (
  'CS-BK-2026-00105', 1, 1, 'Vikram Singh', 'vikram.singh@example.com', '+91 9711223344',
  CURRENT_DATE, '15:00:00', '16:00:00', CURRENT_TIMESTAMP + INTERVAL '30 minutes', CURRENT_TIMESTAMP + INTERVAL '90 minutes',
  600.00, 600.00, 0.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-003'
)
ON CONFLICT (booking_reference) DO NOTHING;

-- Booking 6: Clay Court 2 yesterday (Completed)
INSERT INTO court_bookings (
  booking_reference, court_id, member_id, guest_name, guest_email, guest_phone,
  booking_date, start_time, end_time, slot_start_utc, slot_end_utc,
  base_amount, discount_amount, final_amount, booking_status, payment_status, payment_reference, checked_in_at
)
VALUES (
  'CS-BK-2026-00106', 2, 5, 'Priya Nair', 'priya.nair@example.com', '+91 9744556677',
  CURRENT_DATE - INTERVAL '1 day', '17:00:00', '18:00:00', CURRENT_TIMESTAMP - INTERVAL '27 hours', CURRENT_TIMESTAMP - INTERVAL '26 hours',
  700.00, 700.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-004', CURRENT_TIMESTAMP - INTERVAL '27 hours'
)
ON CONFLICT (booking_reference) DO NOTHING;

-- Booking 7: Indoor Cricket Nets Lane B (Cancelled)
INSERT INTO court_bookings (
  booking_reference, court_id, member_id, guest_name, guest_email, guest_phone,
  booking_date, start_time, end_time, slot_start_utc, slot_end_utc,
  base_amount, discount_amount, final_amount, booking_status, payment_status, payment_reference, cancellation_reason
)
VALUES (
  'CS-BK-2026-00107', 6, NULL, 'Rohan Mehra (Guest)', 'rohan.mehra@gmail.com', '+91 9811223344',
  CURRENT_DATE - INTERVAL '2 days', '11:00:00', '12:00:00', CURRENT_TIMESTAMP - INTERVAL '51 hours', CURRENT_TIMESTAMP - INTERVAL '50 hours',
  500.00, 0.00, 500.00, 'CANCELLED', 'REFUNDED', 'UPI-REFUND-4412', 'Player requested cancellation due to heavy rain'
)
ON CONFLICT (booking_reference) DO NOTHING;

-- 11. BOOKING WAITLIST
INSERT INTO booking_waitlist (court_id, desired_date, desired_start_time, member_id, member_name, member_phone, queue_position, status)
VALUES 
(1, CURRENT_DATE + INTERVAL '1 day', '18:00:00', 1, 'Vikram Singh', '+91 9711223344', 1, 'WAITING'),
(2, CURRENT_DATE + INTERVAL '1 day', '19:00:00', 3, 'Neha Sharma', '+91 9722334455', 1, 'WAITING')
ON CONFLICT DO NOTHING;

-- 12. COURT MAINTENANCE LOGS
INSERT INTO court_maintenance (court_id, start_time, end_time, reason, created_by)
VALUES 
(3, CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '3 days 4 hours', 'Synthetic grass brushing and court net tension calibration', 'Rajesh Kumar (Facility Lead)'),
(4, CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '5 days 8 hours', 'Pitch roller compaction and crease re-marking', 'Rajesh Kumar (Facility Lead)')
ON CONFLICT DO NOTHING;

-- 13. VISITOR ENQUIRIES & LEADS CRM
INSERT INTO enquiries (full_name, email, phone, interested_sport, interested_plan, enquiry_message, preferred_contact_method, status, assigned_staff_name)
VALUES 
('Deepak Malhotra', 'deepak.malhotra@gmail.com', '+91 9810112233', 'TENNIS', 'Gold Membership', 'Inquiring about Annual Family Gold Membership for tennis coaching and fitness gym.', 'PHONE', 'NEW', 'Amit Bansal'),
('Shweta Agarwal', 'shweta.agarwal@outlook.com', '+91 9820223344', 'BADMINTON', 'Junior Membership', 'Looking for professional badminton coaching for my 12-year-old son on weekends.', 'PHONE', 'CONTACTED', 'Amit Bansal'),
('Karan Khanna', 'karan.khanna@deloitte.com', '+91 9830334455', 'CRICKET', 'Corporate Booking', 'Want to book the full cricket pitch and pavilion for our annual corporate sports fest.', 'EMAIL', 'CONTACTED', 'Sunita Rao'),
('Ritu Saxena', 'ritu.saxena@yahoo.co.in', '+91 9840445566', 'BADMINTON', 'Silver Membership', 'Interested in regular 6-month Silver membership for morning badminton practice.', 'EMAIL', 'CONVERTED', 'Amit Bansal'),
('Manish Choudhary', 'manish.ch@techcorp.com', '+91 9850556677', 'SQUASH', 'Gold Membership', 'Do you have squash glass courts available for late evening slots?', 'PHONE', 'LOST', 'Rahul Verma')
ON CONFLICT DO NOTHING;

-- Enquiry Followup History
INSERT INTO enquiry_followups (enquiry_id, notes, contact_date, next_followup_date, created_by_staff)
SELECT enquiry_id, 'Called prospect. Explained the Junior development pathway and scheduled a complimentary trial court session for Saturday 10:00 AM.', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 'Amit Bansal (Admin)'
FROM enquiries WHERE email = 'shweta.agarwal@outlook.com'
AND NOT EXISTS (SELECT 1 FROM enquiry_followups WHERE enquiry_id = enquiries.enquiry_id AND notes LIKE 'Called prospect%');

INSERT INTO enquiry_followups (enquiry_id, notes, contact_date, next_followup_date, created_by_staff)
SELECT enquiry_id, 'Shared corporate pavilion booking brochure and weekend tournament quotation. Awaiting PO confirmation.', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_DATE + INTERVAL '1 day', 'Sunita Rao (Desk)'
FROM enquiries WHERE email = 'karan.khanna@deloitte.com'
AND NOT EXISTS (SELECT 1 FROM enquiry_followups WHERE enquiry_id = enquiries.enquiry_id AND notes LIKE 'Shared corporate%');

-- 14. TRIAL COACHING BOOKINGS
INSERT INTO trial_bookings (court_id, full_name, email, phone, preferred_sport, trial_date, start_time, end_time, status, staff_notes)
VALUES 
(1, 'Harsh Vardhan', 'harsh.v@gmail.com', '+91 9911991122', 'TENNIS', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '10:00:00', 'APPROVED', 'Assigned Coach Rahul Verma for baseline assessment.'),
(2, 'Sanya Mirza Jr', 'sanya.m@gmail.com', '+91 9922992233', 'TENNIS', CURRENT_DATE + INTERVAL '2 days', '17:00:00', '18:00:00', 'PENDING', 'Requested evening slot on clay court.'),
(5, 'Devendra Gupta', 'dev.gupta@gmail.com', '+91 9933993344', 'CRICKET', CURRENT_DATE - INTERVAL '1 day', '16:00:00', '17:00:00', 'COMPLETED', 'Trial completed in nets lane A. Interested in Junior Academy.')
ON CONFLICT DO NOTHING;

-- 15. SOCIAL PLAY SESSIONS & PARTICIPANTS
INSERT INTO social_play_sessions (court_id, title, session_date, start_time, end_time, max_participants, current_participants, entry_fee, session_status)
VALUES 
(1, 'Friday Night Tennis Mixer', CURRENT_DATE + INTERVAL '4 days', '18:00:00', '21:00:00', 16, 4, 150.00, 'OPEN'),
(5, 'Sunday Morning Cricket Knockout', CURRENT_DATE + INTERVAL '6 days', '07:00:00', '10:00:00', 12, 3, 200.00, 'OPEN')
ON CONFLICT DO NOTHING;

-- Participants for Friday Night Tennis Mixer
INSERT INTO social_play_participants (session_id, member_id, participant_name, participant_email, payment_status)
SELECT s.session_id, m.id, 'Vikram Singh', 'vikram.singh@example.com', 'PAID'
FROM social_play_sessions s, members m JOIN users u ON m.user_id = u.id
WHERE s.title = 'Friday Night Tennis Mixer' AND u.email = 'vikram.singh@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO social_play_participants (session_id, member_id, participant_name, participant_email, payment_status)
SELECT s.session_id, m.id, 'Rohit Kapoor', 'rohit.kapoor@example.com', 'PAID'
FROM social_play_sessions s, members m JOIN users u ON m.user_id = u.id
WHERE s.title = 'Friday Night Tennis Mixer' AND u.email = 'rohit.kapoor@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO social_play_participants (session_id, member_id, participant_name, participant_email, payment_status)
SELECT s.session_id, m.id, 'Neha Sharma', 'neha.sharma@example.com', 'PAID'
FROM social_play_sessions s, members m JOIN users u ON m.user_id = u.id
WHERE s.title = 'Friday Night Tennis Mixer' AND u.email = 'neha.sharma@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO social_play_participants (session_id, member_id, participant_name, participant_email, payment_status)
SELECT s.session_id, NULL, 'Gaurav Sen (Guest)', 'gaurav.sen@external.com', 'PAID'
FROM social_play_sessions s
WHERE s.title = 'Friday Night Tennis Mixer'
ON CONFLICT DO NOTHING;
