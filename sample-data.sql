-- ==============================================================================
-- ClubSphere – Comprehensive Evaluation Dummy Data & Seed Script (sample-data.sql)
-- ==============================================================================
-- Database: clubsphere_db
-- Populates:
-- 1. 2 Admin Accounts
-- 2. 5 Staff Accounts across 5 departments
-- 3. 20 Student Accounts with diverse states:
--    - 5 Active Members (Gold, Silver, Junior)
--    - 5 Active 7-Day Trial Users
--    - 3 Expired Members
--    - 3 Registered Students (No Membership)
--    - 2 Inactive Accounts
--    - 2 Additional Member/Student profiles
-- 4. 6 Sports Courts (Tennis, Cricket)
-- 5. 30 Sample Court Bookings
-- 6. 4 Friday Social Play Sessions with Participants
-- 7. 25 Pro Sports Accessory Products
-- 8. 15 Sports Cafe Food & Beverage Items
-- 9. 10 Club Promotions & Student Offers
-- 10. 30 Financial Membership & Booking Transactions
-- 11. 20 Centralized In-App Notifications
-- 12. Visitor Enquiries & Followups CRM
-- ==============================================================================

-- ==============================================================================
-- 1. USERS
-- ==============================================================================
-- Standard Passwords:
-- Admin: Admin@123 ($2a$10$X7hO4pDklw8pZqjR1hGjveqP1Bqu8fB4xIvh6Jq0vA5a.1vP2w1u2 or existing)
-- Staff: Staff@123 ($2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm)
-- Student / Member: Member@123 ($2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm)

-- 1.1 Admin Accounts (2)
INSERT INTO users (email, password_hash, full_name, phone, address, status, student_id, is_email_verified, trial_status)
VALUES 
('admin@clubsphere.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Riya Administrator', '+91 9811001100', 'ClubSphere Pavilion, Gate 1', 'ACTIVE', 'CS-ADM-001', true, 'NOT_STARTED'),
('admin2@clubsphere.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'General Operations Admin', '+91 9811002200', 'Executive Suite 201', 'ACTIVE', 'CS-ADM-002', true, 'NOT_STARTED')
ON CONFLICT (email) DO NOTHING;

-- 1.2 Staff Accounts (5)
INSERT INTO users (email, password_hash, full_name, phone, address, status, student_id, is_email_verified, trial_status)
VALUES 
('sunita.rao@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Sunita Rao', '+91 9822334455', 'Defence Colony, New Delhi', 'ACTIVE', 'CS-STF-001', true, 'NOT_STARTED'),
('vikram.d@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Vikram Deshmukh', '+91 9833445566', 'Hiranandani Estate, Thane', 'ACTIVE', 'CS-STF-002', true, 'NOT_STARTED'),
('meera.j@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Meera Joshi', '+91 9844556677', 'Sector 14, Chandigarh', 'ACTIVE', 'CS-STF-003', true, 'NOT_STARTED'),
('rajesh.k@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Rajesh Kumar', '+91 9855667788', 'Okhla Phase 3, New Delhi', 'ACTIVE', 'CS-STF-004', true, 'NOT_STARTED'),
('amit.b@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Amit Bansal', '+91 9866778899', 'Golf Course Ext, Gurugram', 'ACTIVE', 'CS-STF-005', true, 'NOT_STARTED')
ON CONFLICT (email) DO NOTHING;

-- 1.3 20 Student Accounts with diverse states
INSERT INTO users (email, password_hash, full_name, phone, address, date_of_birth, gender, status, student_id, is_email_verified, trial_status, trial_start_date, trial_end_date)
VALUES 
-- 5 Active Members
('vikram.singh@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Vikram Singh', '+91 9711223344', 'Connaught Place, New Delhi', '1992-06-15', 'Male', 'ACTIVE', 'CS-STU-2026-0001', true, 'NOT_STARTED', NULL, NULL),
('rohit.kapoor@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Rohit Kapoor', '+91 9733445566', 'Greater Kailash 1, New Delhi', '1989-03-22', 'Male', 'ACTIVE', 'CS-STU-2026-0002', true, 'NOT_STARTED', NULL, NULL),
('priya.nair@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Priya Nair', '+91 9744556677', 'Sobha City, Bengaluru', '1996-09-30', 'Female', 'ACTIVE', 'CS-STU-2026-0003', true, 'NOT_STARTED', NULL, NULL),
('neha.sharma@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Neha Sharma', '+91 9722334455', 'Palm Springs, Gurugram', '1995-07-18', 'Female', 'ACTIVE', 'CS-STU-2026-0004', true, 'NOT_STARTED', NULL, NULL),
('ananya.iyer@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Ananya Iyer', '+91 9755667788', 'Indira Nagar, Bengaluru', '2010-05-14', 'Female', 'ACTIVE', 'CS-STU-2026-0005', true, 'NOT_STARTED', NULL, NULL),

-- 5 Active 7-Day Trial Users
('kabir.sharma@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Kabir Sharma', '+91 9811122233', 'Hostel Block 4, IIT Delhi', '2003-02-10', 'Male', 'ACTIVE', 'CS-STU-2026-1001', true, 'ACTIVE', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days'),
('rhea.chopra@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Rhea Chopra', '+91 9822233344', 'North Campus, Delhi University', '2004-08-19', 'Female', 'ACTIVE', 'CS-STU-2026-1002', true, 'ACTIVE', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '6 days'),
('manav.tandon@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Manav Tandon', '+91 9833344455', 'South Campus, Delhi University', '2002-11-05', 'Male', 'ACTIVE', 'CS-STU-2026-1003', true, 'ACTIVE', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days'),
('divya.mehra@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Divya Mehra', '+91 9844455566', 'Hostel B, BITS Pilani', '2003-04-12', 'Female', 'ACTIVE', 'CS-STU-2026-1004', true, 'ACTIVE', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days'),
('sahil.khurana@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Sahil Khurana', '+91 9855566677', 'Student Housing, DTU Delhi', '2004-01-28', 'Male', 'ACTIVE', 'CS-STU-2026-1005', true, 'ACTIVE', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days'),

-- 3 Expired Members
('arjun.patel@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Arjun Patel', '+91 9766778899', 'Satellite Road, Ahmedabad', '1991-10-08', 'Male', 'ACTIVE', 'CS-STU-2026-2001', true, 'EXPIRED', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '53 days'),
('kavya.nambiar@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Kavya Nambiar', '+91 9866677788', 'MG Road, Kochi', '2001-09-15', 'Female', 'ACTIVE', 'CS-STU-2026-2002', true, 'EXPIRED', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '33 days'),
('aditya.joshi@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Aditya Joshi', '+91 9877788899', 'Kothrud, Pune', '2008-03-25', 'Male', 'ACTIVE', 'CS-STU-2026-2003', true, 'EXPIRED', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE - INTERVAL '83 days'),

-- 3 Registered Students (No Membership Yet)
('isha.gupta@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Isha Gupta', '+91 9888899900', 'Alaknanda, New Delhi', '2004-12-02', 'Female', 'ACTIVE', 'CS-STU-2026-3001', true, 'NOT_STARTED', NULL, NULL),
('yash.singhal@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Yash Singhal', '+91 9899900011', 'Sector 62, Noida', '2003-07-14', 'Male', 'ACTIVE', 'CS-STU-2026-3002', true, 'NOT_STARTED', NULL, NULL),
('pranav.kulkarni@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Pranav Kulkarni', '+91 9812312344', 'Aundh, Pune', '2002-05-30', 'Male', 'ACTIVE', 'CS-STU-2026-3003', true, 'NOT_STARTED', NULL, NULL),

-- 2 Inactive Accounts
('siddharth.roy@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Siddharth Roy', '+91 9823423455', 'Salt Lake, Kolkata', '2002-10-18', 'Male', 'INACTIVE', 'CS-STU-2026-4001', true, 'NOT_STARTED', NULL, NULL),
('simran.kaur@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Simran Kaur', '+91 9834534566', 'Model Town, Ludhiana', '2003-06-20', 'Female', 'INACTIVE', 'CS-STU-2026-4002', false, 'NOT_STARTED', NULL, NULL),

-- 2 Additional Member/Student profiles
('aarav.mehta@example.com', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Aarav Mehta', '+91 9711002233', 'Vasant Vihar, New Delhi', '2011-04-18', 'Male', 'ACTIVE', 'CS-STU-2026-5001', true, 'NOT_STARTED', NULL, NULL),
('tanvi.bansal@student.edu', '$2a$10$7LWJvlzIdYh1AJiy4JEWMeY42CwIz5euw1jDjpfUIxOahBQSK51sm', 'Tanvi Bansal', '+91 9876543219', 'Sector 15, Gurugram', '2003-09-08', 'Female', 'ACTIVE', 'CS-STU-2026-5002', true, 'ACTIVE', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days')
ON CONFLICT (email) DO UPDATE SET 
    student_id = EXCLUDED.student_id,
    is_email_verified = EXCLUDED.is_email_verified,
    trial_status = EXCLUDED.trial_status,
    trial_start_date = EXCLUDED.trial_start_date,
    trial_end_date = EXCLUDED.trial_end_date;

-- ==============================================================================
-- 2. ROLES ASSIGNMENT
-- ==============================================================================
-- Admin roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email IN ('admin@clubsphere.com', 'admin2@clubsphere.com') AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- Staff roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email IN ('sunita.rao@clubsphere.com', 'vikram.d@clubsphere.com', 'meera.j@clubsphere.com', 'rajesh.k@clubsphere.com', 'amit.b@clubsphere.com')
AND r.name = 'ROLE_STAFF'
ON CONFLICT DO NOTHING;

-- Student / Member roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email LIKE '%@example.com' OR u.email LIKE '%@student.edu'
AND r.name = 'ROLE_MEMBER'
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 3. MEMBERS TABLE RECORDS
-- ==============================================================================
INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0001', 'Sunil Singh', '+91 9711223300', 'O+', 'ACTIVE'
FROM users u WHERE u.email = 'vikram.singh@example.com'
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0002', 'Mahesh Mehta', '+91 9711002200', 'B+', 'ACTIVE'
FROM users u WHERE u.email = 'aarav.mehta@example.com'
ON CONFLICT (member_code) DO NOTHING;

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
SELECT u.id, 'CS-MB-2026-0006', 'Meenakshi Iyer', '+91 9755667700', 'AB+', 'ACTIVE'
FROM users u WHERE u.email = 'ananya.iyer@example.com'
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0007', 'Sneha Patel', '+91 9766778800', 'O+', 'EXPIRED'
FROM users u WHERE u.email = 'arjun.patel@example.com'
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0008', 'Ravi Nambiar', '+91 9866677700', 'A-', 'EXPIRED'
FROM users u WHERE u.email = 'kavya.nambiar@student.edu'
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO members (user_id, member_code, emergency_contact_name, emergency_contact_phone, blood_group, status)
SELECT u.id, 'CS-MB-2026-0009', 'Suresh Joshi', '+91 9877788800', 'B-', 'EXPIRED'
FROM users u WHERE u.email = 'aditya.joshi@student.edu'
ON CONFLICT (member_code) DO NOTHING;

-- Members for Trial & Registered students
INSERT INTO members (user_id, member_code, status)
SELECT u.id, 'CS-MB-2026-' || LPAD(u.id::text, 4, '0'), 'ACTIVE'
FROM users u 
WHERE u.email IN (
    'kabir.sharma@student.edu', 'rhea.chopra@student.edu', 'manav.tandon@student.edu', 
    'divya.mehra@student.edu', 'sahil.khurana@student.edu', 'isha.gupta@student.edu', 
    'yash.singhal@student.edu', 'pranav.kulkarni@student.edu', 'tanvi.bansal@student.edu'
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 4. MEMBERSHIPS & SUBSCRIPTIONS (Strict 1 Active Rule)
-- ==============================================================================
-- Vikram Singh (Gold Plan - Active)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 1, 'CS-MEM-2026-00101', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days', 'ACTIVE', 'CS-QR-VIKRAM-SINGH-0001', true
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'vikram.singh@example.com'
ON CONFLICT (membership_number) DO UPDATE SET status = 'ACTIVE';

-- Rohit Kapoor (Gold Plan - Active)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 1, 'CS-MEM-2026-00104', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', 'ACTIVE', 'CS-QR-ROHIT-KAPOOR-9902', true
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'rohit.kapoor@example.com'
ON CONFLICT (membership_number) DO UPDATE SET status = 'ACTIVE';

-- Priya Nair (Gold Plan - Active)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 1, 'CS-MEM-2026-00105', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '355 days', 'ACTIVE', 'CS-QR-PRIYA-NAIR-9903', true
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'priya.nair@example.com'
ON CONFLICT (membership_number) DO UPDATE SET status = 'ACTIVE';

-- Neha Sharma (Silver Plan - Active)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 2, 'CS-MEM-2026-00103', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '120 days', 'ACTIVE', 'CS-QR-NEHA-SHARMA-9901', true
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'neha.sharma@example.com'
ON CONFLICT (membership_number) DO UPDATE SET status = 'ACTIVE';

-- Ananya Iyer (Junior Plan - Active)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 3, 'CS-MEM-2026-00106', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '320 days', 'ACTIVE', 'CS-QR-ANANYA-IYER-9904', false
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'ananya.iyer@example.com'
ON CONFLICT (membership_number) DO UPDATE SET status = 'ACTIVE';

-- Aarav Mehta (Junior Plan - Active)
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 3, 'CS-MEM-2026-00102', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '350 days', 'ACTIVE', 'CS-QR-AARAV-MEHTA-9900', false
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'aarav.mehta@example.com'
ON CONFLICT (membership_number) DO UPDATE SET status = 'ACTIVE';

-- 3 Expired Memberships
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 2, 'CS-MEM-2026-00107', CURRENT_DATE - INTERVAL '185 days', CURRENT_DATE - INTERVAL '5 days', 'EXPIRED', 'CS-QR-ARJUN-PATEL-9905', false
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'arjun.patel@example.com'
ON CONFLICT (membership_number) DO NOTHING;

INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 1, 'CS-MEM-2026-00108', CURRENT_DATE - INTERVAL '377 days', CURRENT_DATE - INTERVAL '12 days', 'EXPIRED', 'CS-QR-KAVYA-NAMBIAR-9906', false
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'kavya.nambiar@student.edu'
ON CONFLICT (membership_number) DO NOTHING;

INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, status, qr_code_token, auto_renew)
SELECT m.id, 3, 'CS-MEM-2026-00109', CURRENT_DATE - INTERVAL '395 days', CURRENT_DATE - INTERVAL '30 days', 'EXPIRED', 'CS-QR-ADITYA-JOSHI-9907', false
FROM members m JOIN users u ON m.user_id = u.id WHERE u.email = 'aditya.joshi@student.edu'
ON CONFLICT (membership_number) DO NOTHING;

-- ==============================================================================
-- 5. 10 ACTIVE & EXPIRED PROMOTIONS
-- ==============================================================================
INSERT INTO promotions (title, category, discount_text, description, coupon_code, valid_from, valid_until, status, terms, image_url)
VALUES 
('Varsity Student Welcome Pass', 'STUDENT', '25% OFF', 'Exclusive 25% discount for verified college students on Annual Gold & Silver Memberships with full court privileges.', 'STUDENT25', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '45 days', 'ACTIVE', 'Valid for students with active .edu email or valid college ID card. One redemption per student.', 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800'),
('New Court Season Kickoff', 'MEMBERSHIP', 'Flat ₹2000 OFF', 'Sign up for the Championship Gold Annual Tier and receive ₹2,000 off plus 2 complimentary racquet stringing services.', 'GOLD2000', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'ACTIVE', 'Applicable to new Gold registrations only. Non-transferable.', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800'),
('Yonex Pro Stringing & Gear Discount', 'SPORTS_SHOP', '15% OFF Gear', 'Get 15% instant discount across all Yonex and Wilson tennis rackets, balls, and grip accessories in the Pro Shop.', 'PROSHOP15', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'ACTIVE', 'Available at the on-site pro sports shop counter. Show your digital membership pass.', 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800'),
('Match Recovery Smoothie Combo', 'FOOD_SHOP', 'Buy 1 Get 1 Free', 'Purchase any post-workout protein smoothie at the Sports Cafe and receive a complimentary hydration energy cooler.', 'ENERGYBOGO', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '30 days', 'ACTIVE', 'Redeemable at Sports Cafe & Bar window from 07:00 AM to 09:00 PM.', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800'),
('Inter-College Cricket Cup Entry Waiver', 'TOURNAMENT', 'Free Registration', 'Waive full squad entry fee for the ClubSphere Autumn Invitational Cricket Tournament when registering with a junior team.', 'CRICFREE', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '14 days', 'ACTIVE', 'Team must comprise at least 8 verified university students.', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'),
('Friday Night Social Tennis Pass', 'STUDENT', '50% OFF Entry', 'Students receive 50% discount on the Friday Social Play mixer fee (standard ₹150 now ₹75).', 'SOCIAL50', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '60 days', 'ACTIVE', 'Applies exclusively to Friday Social play sessions.', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'),
('Off-Peak Morning Court Special', 'MEMBERSHIP', '30% Less Points', 'Book outdoor clay courts between 06:00 AM and 09:00 AM on weekdays with 30% reduction on court charges.', 'EARLYBIRD', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '40 days', 'ACTIVE', 'Valid Monday to Thursday early morning hours.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'),
('Junior Academy Summer Training Camp', 'STUDENT', '10% Early Bird', 'Enroll junior members under 18 in the intensive 4-week weekend cricket coaching camp with national mentors.', 'JUNIOR10', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE + INTERVAL '18 days', 'ACTIVE', 'Age group 10 to 17 years only. Includes kit bag.', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'),
('Summer Fitness Flash Sale', 'MEMBERSHIP', 'Flat ₹1500 OFF', 'Mid-year sports conditioning discount across all 6-month and 12-month memberships.', 'SUMMER1500', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '10 days', 'EXPIRED', 'Promotional period concluded.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800'),
('Monsoon Net Practice Bonus', 'SPORTS_SHOP', 'Free Grip Tape', 'Receive premium Babolat overgrip tape free with any indoor cricket or badminton stringing job.', 'MONSOON2026', CURRENT_DATE - INTERVAL '75 days', CURRENT_DATE - INTERVAL '15 days', 'EXPIRED', 'Campaign expired.', 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 6. 25 PRO SPORTS ACCESSORY PRODUCTS
-- ==============================================================================
INSERT INTO shop_products (shop_type, category, name, description, price, stock_quantity, in_stock, image_url, pickup_info, rating)
VALUES 
('SPORTS_ACCESSORY', 'RACKETS', 'Wilson Pro Staff 97 v14', 'Championship-grade precision tennis racquet engineered for pinpoint feel, braided graphite construction, 315g.', 18999.00, 12, true, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800', 'Pro Shop Counter, Pavilion A', 4.9),
('SPORTS_ACCESSORY', 'RACKETS', 'Babolat Pure Aero 2024', 'Ultimate spin-friendly power frame featuring Aeromodular 3 aerodynamics and NF2-Tech flax inserts, 300g.', 17499.00, 8, true, 'https://images.unsplash.com/photo-1617083934555-563d6b825227?w=800', 'Pro Shop Counter, Pavilion A', 4.8),
('SPORTS_ACCESSORY', 'RACKETS', 'Head Speed MP Legend', 'Novak Djokovic signature series racket offering optimal maneuverability and speed with Auxetic 2.0 technology.', 16999.00, 15, true, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800', 'Pro Shop Counter, Pavilion A', 4.7),
('SPORTS_ACCESSORY', 'RACKETS', 'Yonex Astrox 99 Pro Badminton Racquet', 'Rotational Generator system offensive badminton racket for steep, explosive smashes and pinpoint shuttle control.', 14200.00, 10, true, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', 'Pro Shop Counter, Pavilion A', 4.9),
('SPORTS_ACCESSORY', 'RACKETS', 'Li-Ning Windstorm 72 Racquet', 'Ultra-lightweight 72g aerodynamic badminton racquet optimized for lightning reflex defense and fast front-court net play.', 8500.00, 14, true, 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800', 'Pro Shop Counter, Pavilion A', 4.6),

('SPORTS_ACCESSORY', 'BALLS', 'Slazenger Wimbledon Tennis Balls (Can of 4)', 'Official championship tournament pressured felt tennis balls featuring Hydroguard water-repellent technology.', 650.00, 80, true, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800', 'Pro Shop & Court Desk', 4.8),
('SPORTS_ACCESSORY', 'BALLS', 'Dunlop Fort All Court (Can of 3)', 'Premium woven felt pressure balls engineered for consistent bounce on both Plexipave hard courts and natural turf.', 550.00, 100, true, 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800', 'Pro Shop & Court Desk', 4.7),
('SPORTS_ACCESSORY', 'BALLS', 'SG Club Leather Cricket Ball (Red 4-Piece)', 'Alum tanned high-grade English leather 4-piece cricket ball with cork center, 80-over match durability.', 950.00, 45, true, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 'Pavilion Desk & Turf Shed', 4.9),
('SPORTS_ACCESSORY', 'BALLS', 'Kookaburra Turf White Leather Ball', 'Official match specification white cricket ball with waterproofed finish for day/night floodlight fixtures.', 1450.00, 30, true, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800', 'Pavilion Desk & Turf Shed', 4.8),
('SPORTS_ACCESSORY', 'BALLS', 'Yonex Aerosensa 30 Feather Shuttlecocks (Doz)', 'Selected Portuguese goose feather tournament shuttlecocks for consistent trajectory and true rotation.', 2200.00, 40, true, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', 'Indoor Arena Counter', 4.9),

('SPORTS_ACCESSORY', 'SHOES', 'Asics Gel-Resolution 9 Hard Court Shoes', 'Dynawall midsole stability tennis footwear with Gel rearfoot cushioning for explosive baseline directional cuts.', 10999.00, 16, true, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Pro Shop Locker Section', 4.9),
('SPORTS_ACCESSORY', 'SHOES', 'Nike Court Air Zoom Vapor Pro 2', 'Low-to-the-court lightweight court shoe with herringbone traction and responsive forefoot Zoom Air unit.', 9995.00, 12, true, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', 'Pro Shop Locker Section', 4.8),
('SPORTS_ACCESSORY', 'SHOES', 'Adidas Vector Mid Spikes Cricket Shoes', 'BOOST energy return cricket bowling boots with 10-spike metal baseplate for pacer ankle support and traction.', 12999.00, 8, true, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800', 'Pro Shop Locker Section', 4.7),
('SPORTS_ACCESSORY', 'SHOES', 'Yonex Power Cushion 65 Z3 Wide', 'Seamless non-marking indoor court shoe absorbing 3x impact shock, designed for quick lunges and recovery.', 8990.00, 14, true, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800', 'Pro Shop Locker Section', 4.8),

('SPORTS_ACCESSORY', 'ACCESSORIES', 'Babolat Pro Tour Overgrip (3-Pack)', 'High-tack 0.6mm thickness micro-perforated absorbent grips for superior control under sweaty match conditions.', 380.00, 120, true, 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800', 'Pro Shop Counter', 4.8),
('SPORTS_ACCESSORY', 'ACCESSORIES', 'Wilson Shock FX Dampener Duo', 'Silicone vibration dampening core reducing string harshness and ping sound on impact.', 290.00, 75, true, 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800', 'Pro Shop Counter', 4.6),
('SPORTS_ACCESSORY', 'ACCESSORIES', 'SG Test Batting Gloves (Men LH/RH)', 'High-density foam pre-curved sausage finger gloves with sheep leather palms and thumb fiber inserts.', 2400.00, 18, true, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 'Cricket Equipment Kiosk', 4.9),
('SPORTS_ACCESSORY', 'ACCESSORIES', 'Kookaburra Kahuna Cricket Bat 1200', 'Grade 1 unbleached English willow blade with massive scalloped edges and clean straight grains, 2lb 8oz.', 18500.00, 6, true, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 'Cricket Equipment Kiosk', 5.0),
('SPORTS_ACCESSORY', 'ACCESSORIES', 'ClubSphere Pro Tennis Kit Bag (6-Racket)', 'Thermal-guarded dual compartment bag with shoe tunnel, moisture pocket, and padded backpack straps.', 3999.00, 20, true, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Pro Shop Counter', 4.7),
('SPORTS_ACCESSORY', 'ACCESSORIES', 'Hydro Flask 32oz Insulated Sports Bottle', 'Vacuum double-wall stainless steel sports bottle keeping electrolytes cold for 24 hours courtside.', 1850.00, 35, true, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800', 'Sports Cafe & Shop', 4.8),

('SPORTS_ACCESSORY', 'APPAREL', 'ClubSphere Official Match Polo', 'Dri-FIT breathable tournament emerald green and gold trim athletic polo with embroidered club insignia.', 1499.00, 50, true, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800', 'Pro Shop Apparel Racks', 4.8),
('SPORTS_ACCESSORY', 'APPAREL', 'ClubSphere Thermal Tracksuit Set', 'All-weather stretch fleece jacket and tapered bottoms tailored for morning warm-ups and court transit.', 3299.00, 25, true, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', 'Pro Shop Apparel Racks', 4.9),
('SPORTS_ACCESSORY', 'APPAREL', 'Nike Court Flex 9" Tennis Shorts', 'Four-way flex fabric shorts with extra deep tennis ball ball-pockets and laser ventilation slits.', 1899.00, 30, true, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800', 'Pro Shop Apparel Racks', 4.7),
('SPORTS_ACCESSORY', 'APPAREL', 'Castore Technical Gym Compression Tee', 'Graduated muscle stabilization short-sleeve compression baselayer with anti-odor silver ion threads.', 1650.00, 28, true, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', 'Pro Shop Apparel Racks', 4.6),
('SPORTS_ACCESSORY', 'APPAREL', 'Under Armour Performance Wristband (Pair)', 'Multi-channel moisture wicking terry cloth sweatbands with low-profile silicone grip.', 450.00, 60, true, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800', 'Pro Shop Counter', 4.7)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 7. 15 SPORTS CAFE FOOD & BEVERAGE ITEMS
-- ==============================================================================
INSERT INTO shop_products (shop_type, category, name, description, price, stock_quantity, in_stock, image_url, pickup_info, rating)
VALUES 
('FOOD_BEVERAGE', 'DRINKS', 'Electrolyte Citrus Booster', 'Fresh Valencia orange, cold-pressed lime, organic pink salt, and raw honey hydration blend (500ml).', 180.00, 60, true, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800', 'Cafe Pickup Counter Window 1', 4.9),
('FOOD_BEVERAGE', 'DRINKS', 'Whey Protein Super Shake', '30g grass-fed whey isolate, almond milk, peanut butter, chia seeds and frozen organic bananas (450ml).', 260.00, 45, true, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800', 'Cafe Pickup Counter Window 1', 4.8),
('FOOD_BEVERAGE', 'DRINKS', 'Matcha Recovery Green Tea', 'Ceremonial stone-ground Uji matcha, coconut water, mint and cucumber anti-inflammatory cooler.', 220.00, 35, true, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800', 'Cafe Pickup Counter Window 1', 4.7),
('FOOD_BEVERAGE', 'DRINKS', 'Double Shot Cold Brew Coffee', 'Single-origin Coorg arabica 18-hour cold steeped coffee over clear ice with oat milk float.', 190.00, 50, true, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800', 'Cafe Pickup Counter Window 1', 4.9),
('FOOD_BEVERAGE', 'DRINKS', 'Tender Fresh Coconut Water', 'Direct from Kerala coastal groves, served chilled with soft pulp.', 120.00, 80, true, 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800', 'Courtside Drink Cart', 5.0),

('FOOD_BEVERAGE', 'FOOD', 'Grilled Chicken & Quinoa Fuel Bowl', 'Herb-roasted chicken breast, tri-color quinoa, avocado mash, cherry tomatoes, and tahini lime dressing.', 380.00, 30, true, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', 'Hot Food Service Area', 4.9),
('FOOD_BEVERAGE', 'FOOD', 'Paneer Tikka Protein Wrap', 'Tandoor grilled cottage cheese, spiced bell peppers, crisp iceberg lettuce and Greek yogurt mint chutney in whole wheat tortilla.', 290.00, 40, true, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800', 'Hot Food Service Area', 4.8),
('FOOD_BEVERAGE', 'FOOD', 'Avocado & Sourdough Poached Egg Toast', 'Artisan fermented sourdough slice, smashed Hass avocado, free-range poached eggs, chili flakes, and microgreens.', 340.00, 25, true, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800', 'Hot Food Service Area', 4.9),
('FOOD_BEVERAGE', 'FOOD', 'Spiced Mediterranean Falafel Pita', 'Crispy chickpea falafel patties, pickled turnip, heirloom cucumber salad and creamy garlic hummus in warm pita.', 280.00, 30, true, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800', 'Hot Food Service Area', 4.7),
('FOOD_BEVERAGE', 'FOOD', 'Egg White & Smoked Turkey Omelette', 'Four egg whites, smoked turkey breast, baby spinach, button mushrooms, served with two multi-grain toast slices.', 310.00, 20, true, 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800', 'Hot Food Service Area', 4.8),

('FOOD_BEVERAGE', 'SNACKS', 'Artisan Granola & Greek Yogurt Parfait', 'House-baked rolled oats, toasted walnuts, wildflower honey, mixed forest berries and rich Greek yogurt.', 220.00, 35, true, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', 'Grab-and-Go Refrigerator', 4.8),
('FOOD_BEVERAGE', 'SNACKS', 'Almond Butter Protein Energy Balls (3-Pack)', 'Medjool dates, raw cacao, roasted California almonds, hemp protein, and rolled oats.', 160.00, 50, true, 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800', 'Grab-and-Go Counter', 4.9),
('FOOD_BEVERAGE', 'SNACKS', 'Roasted Salted Mixed Nuts & Berries Jar', 'Pistachios, cashews, almonds, and dried cranberries roasted in Himalayan pink salt (150g).', 240.00, 45, true, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800', 'Grab-and-Go Counter', 4.7),
('FOOD_BEVERAGE', 'SNACKS', 'Baked Herbed Sweet Potato Wedges', 'Crispy oven-roasted wedges seasoned with rosemary, garlic, and smoked paprika, served with yogurt dip.', 190.00, 25, true, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800', 'Hot Food Service Area', 4.6),
('FOOD_BEVERAGE', 'SNACKS', 'Dark Chocolate & Hazelnut Protein Bar', '20g protein bar sweetened with date syrup and 70% dark Belgian cocoa nibs.', 150.00, 70, true, 'https://images.unsplash.com/photo-1622484216805-4c06b2b73e51?w=800', 'Grab-and-Go Counter', 4.9)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 8. 4 FRIDAY SOCIAL PLAY SESSIONS & PARTICIPANTS
-- ==============================================================================
INSERT INTO social_play_sessions (court_id, title, session_date, start_time, end_time, max_participants, current_participants, entry_fee, session_status)
VALUES 
(1, 'Friday Night Tennis Mixer (Singles & Doubles)', CURRENT_DATE + INTERVAL '4 days', '18:00:00', '21:00:00', 16, 6, 150.00, 'OPEN'),
(2, 'Friday Sunset Clay Court Round Robin', CURRENT_DATE + INTERVAL '11 days', '17:00:00', '20:00:00', 12, 4, 150.00, 'OPEN'),
(5, 'Sunday Morning Cricket Knockout Net League', CURRENT_DATE + INTERVAL '6 days', '07:00:00', '10:00:00', 12, 5, 200.00, 'OPEN'),
(3, 'Under-18 Junior Friday Badminton & Tennis Funfest', CURRENT_DATE + INTERVAL '18 days', '16:00:00', '19:00:00', 16, 8, 100.00, 'OPEN')
ON CONFLICT DO NOTHING;

-- Social Play Participants for Session 1
INSERT INTO social_play_participants (session_id, member_id, participant_name, participant_email, payment_status)
SELECT s.session_id, m.id, 'Vikram Singh', 'vikram.singh@example.com', 'PAID'
FROM social_play_sessions s, members m JOIN users u ON m.user_id = u.id
WHERE s.title LIKE '%Friday Night Tennis Mixer%' AND u.email = 'vikram.singh@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO social_play_participants (session_id, member_id, participant_name, participant_email, payment_status)
SELECT s.session_id, m.id, 'Rohit Kapoor', 'rohit.kapoor@example.com', 'PAID'
FROM social_play_sessions s, members m JOIN users u ON m.user_id = u.id
WHERE s.title LIKE '%Friday Night Tennis Mixer%' AND u.email = 'rohit.kapoor@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO social_play_participants (session_id, member_id, participant_name, participant_email, payment_status)
SELECT s.session_id, m.id, 'Neha Sharma', 'neha.sharma@example.com', 'PAID'
FROM social_play_sessions s, members m JOIN users u ON m.user_id = u.id
WHERE s.title LIKE '%Friday Night Tennis Mixer%' AND u.email = 'neha.sharma@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO social_play_participants (session_id, member_id, participant_name, participant_email, payment_status)
SELECT s.session_id, NULL, 'Gaurav Sen (Guest Player)', 'gaurav.sen@external.com', 'PAID'
FROM social_play_sessions s
WHERE s.title LIKE '%Friday Night Tennis Mixer%'
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 9. 20 CENTRALIZED IN-APP NOTIFICATIONS
-- ==============================================================================
-- For Vikram Singh (User ID from email)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Championship Gold Membership Active', 'Your annual Gold tier subscription is active until October 2027. Enjoy unlimited court privileges, 15% pro shop discounts, and private lounge access.', 'MEMBERSHIP', false, CURRENT_TIMESTAMP - INTERVAL '1 hour'
FROM users u WHERE u.email = 'vikram.singh@example.com';

INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Court Booking Confirmed: CS-BK-2026-00101', 'Centre Court 1 is confirmed for your session. Please arrive 10 minutes prior for contactless QR check-in.', 'BOOKING', true, CURRENT_TIMESTAMP - INTERVAL '4 hours'
FROM users u WHERE u.email = 'vikram.singh@example.com';

INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Friday Social Play Session RSVP', 'You have successfully joined the Friday Night Tennis Mixer on Centre Court 1. Bring your racquet!', 'SYSTEM', false, CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM users u WHERE u.email = 'vikram.singh@example.com';

-- For Kabir Sharma (Trial Student)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, '7-Day Free Trial Active!', 'Welcome to ClubSphere! Your trial gives you preview access to championship court availability, club amenities, and event schedules. 5 days remaining.', 'TRIAL', false, CURRENT_TIMESTAMP - INTERVAL '2 hours'
FROM users u WHERE u.email = 'kabir.sharma@student.edu';

INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Special Student Discount Available', 'Use coupon code STUDENT25 to unlock 25% discount on full Gold or Silver memberships before your trial concludes.', 'PROMOTION', false, CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM users u WHERE u.email = 'kabir.sharma@student.edu';

-- For Rhea Chopra (Trial Student)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Welcome to Your 7-Day Free Trial', 'Explore our 6 championship courts, browse the Pro Shop gear catalog, and check out sports nutrition bowls at the cafe.', 'TRIAL', false, CURRENT_TIMESTAMP - INTERVAL '3 hours'
FROM users u WHERE u.email = 'rhea.chopra@student.edu';

-- For Divya Mehra (Trial Student expiring in 2 days)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Trial Expiring in 2 Days', 'Your 7-day free trial will end on ' || (CURRENT_DATE + INTERVAL '2 days')::text || '. Join today to keep your sports profile and enjoy priority booking.', 'TRIAL', false, CURRENT_TIMESTAMP - INTERVAL '1 hour'
FROM users u WHERE u.email = 'divya.mehra@student.edu';

-- For Rohit Kapoor (Gold Member)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Court Booking Confirmed: CS-BK-2026-00102', 'Clay Court 2 is reserved for your evening match today at 18:00. Floodlights are activated.', 'BOOKING', false, CURRENT_TIMESTAMP - INTERVAL '2 hours'
FROM users u WHERE u.email = 'rohit.kapoor@example.com';

-- For Neha Sharma (Silver Member)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Indoor Cricket Nets Lane A Confirmed', 'Your practice session tomorrow morning (10:00 - 11:00 AM) is confirmed. Bowling machine balls included.', 'BOOKING', false, CURRENT_TIMESTAMP - INTERVAL '6 hours'
FROM users u WHERE u.email = 'neha.sharma@example.com';

-- For Arjun Patel (Expired Member)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Membership Expired: Please Renew', 'Your Silver membership concluded 5 days ago. Renew now to restore booking privileges and access your digital QR gate pass.', 'MEMBERSHIP', false, CURRENT_TIMESTAMP - INTERVAL '5 days'
FROM users u WHERE u.email = 'arjun.patel@example.com';

-- For Ananya Iyer (Junior Member)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Junior Academy Coaching Session Reminder', 'Weekend junior tennis squad coaching starts Saturday at 09:00 AM on Court 3 with Head Coach Rahul Verma.', 'SYSTEM', false, CURRENT_TIMESTAMP - INTERVAL '8 hours'
FROM users u WHERE u.email = 'ananya.iyer@example.com';

-- For Isha Gupta (Registered Student, No Membership)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT u.id, 'Welcome to ClubSphere!', 'Start your 7-day free trial today with one click from your student dashboard, or explore membership tiers.', 'WELCOME', false, CURRENT_TIMESTAMP - INTERVAL '12 hours'
FROM users u WHERE u.email = 'isha.gupta@student.edu';

-- ==============================================================================
-- 10. 30 SAMPLE COURT BOOKINGS (Past, Today, and Upcoming)
-- ==============================================================================
-- Insert diverse bookings across courts 1 to 6
INSERT INTO court_bookings (
  booking_reference, court_id, member_id, guest_name, guest_email, guest_phone,
  booking_date, start_time, end_time, slot_start_utc, slot_end_utc,
  base_amount, discount_amount, final_amount, booking_status, payment_status, payment_reference, checked_in_at
)
VALUES 
-- Bookings for Centre Court 1
('CS-BK-2026-00001', 1, 1, 'Vikram Singh', 'vikram.singh@example.com', '+91 9711223344', CURRENT_DATE - INTERVAL '3 days', '07:00:00', '08:00:00', CURRENT_TIMESTAMP - INTERVAL '75 hours', CURRENT_TIMESTAMP - INTERVAL '74 hours', 600.00, 600.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-01', CURRENT_TIMESTAMP - INTERVAL '75 hours'),
('CS-BK-2026-00002', 1, 4, 'Rohit Kapoor', 'rohit.kapoor@example.com', '+91 9733445566', CURRENT_DATE - INTERVAL '2 days', '08:00:00', '09:00:00', CURRENT_TIMESTAMP - INTERVAL '51 hours', CURRENT_TIMESTAMP - INTERVAL '50 hours', 600.00, 600.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-02', CURRENT_TIMESTAMP - INTERVAL '51 hours'),
('CS-BK-2026-00003', 1, 5, 'Priya Nair', 'priya.nair@example.com', '+91 9744556677', CURRENT_DATE - INTERVAL '1 day', '09:00:00', '10:00:00', CURRENT_TIMESTAMP - INTERVAL '27 hours', CURRENT_TIMESTAMP - INTERVAL '26 hours', 600.00, 600.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-03', CURRENT_TIMESTAMP - INTERVAL '27 hours'),
('CS-BK-2026-00004', 1, 3, 'Neha Sharma', 'neha.sharma@example.com', '+91 9722334455', CURRENT_DATE, '11:00:00', '12:00:00', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP, 600.00, 150.00, 450.00, 'CHECKED_IN', 'PAID', 'UPI-TXN-101', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('CS-BK-2026-00005', 1, 1, 'Vikram Singh', 'vikram.singh@example.com', '+91 9711223344', CURRENT_DATE + INTERVAL '1 day', '08:00:00', '09:00:00', CURRENT_TIMESTAMP + INTERVAL '15 hours', CURRENT_TIMESTAMP + INTERVAL '16 hours', 600.00, 600.00, 0.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-04', NULL),
('CS-BK-2026-00006', 1, 4, 'Rohit Kapoor', 'rohit.kapoor@example.com', '+91 9733445566', CURRENT_DATE + INTERVAL '2 days', '18:00:00', '19:00:00', CURRENT_TIMESTAMP + INTERVAL '39 hours', CURRENT_TIMESTAMP + INTERVAL '40 hours', 600.00, 600.00, 0.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-05', NULL),

-- Bookings for Clay Court 2
('CS-BK-2026-00007', 2, 5, 'Priya Nair', 'priya.nair@example.com', '+91 9744556677', CURRENT_DATE - INTERVAL '4 days', '17:00:00', '18:00:00', CURRENT_TIMESTAMP - INTERVAL '99 hours', CURRENT_TIMESTAMP - INTERVAL '98 hours', 700.00, 700.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-06', CURRENT_TIMESTAMP - INTERVAL '99 hours'),
('CS-BK-2026-00008', 2, 1, 'Vikram Singh', 'vikram.singh@example.com', '+91 9711223344', CURRENT_DATE - INTERVAL '2 days', '16:00:00', '17:00:00', CURRENT_TIMESTAMP - INTERVAL '51 hours', CURRENT_TIMESTAMP - INTERVAL '50 hours', 700.00, 700.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-07', CURRENT_TIMESTAMP - INTERVAL '51 hours'),
('CS-BK-2026-00009', 2, 3, 'Neha Sharma', 'neha.sharma@example.com', '+91 9722334455', CURRENT_DATE, '16:00:00', '17:00:00', CURRENT_TIMESTAMP + INTERVAL '4 hours', CURRENT_TIMESTAMP + INTERVAL '5 hours', 700.00, 175.00, 525.00, 'CONFIRMED', 'PAID', 'UPI-TXN-102', NULL),
('CS-BK-2026-00010', 2, NULL, 'Suresh Raina Academy', 'coaching@rainasports.com', '+91 9811223388', CURRENT_DATE + INTERVAL '1 day', '07:00:00', '09:00:00', CURRENT_TIMESTAMP + INTERVAL '14 hours', CURRENT_TIMESTAMP + INTERVAL '16 hours', 1400.00, 0.00, 1400.00, 'CONFIRMED', 'PAID', 'RAZORPAY-8821', NULL),
('CS-BK-2026-00011', 2, 6, 'Ananya Iyer', 'ananya.iyer@example.com', '+91 9755667788', CURRENT_DATE + INTERVAL '3 days', '17:00:00', '18:00:00', CURRENT_TIMESTAMP + INTERVAL '63 hours', CURRENT_TIMESTAMP + INTERVAL '64 hours', 700.00, 350.00, 350.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-08', NULL),

-- Bookings for Indoor Grass Court 3
('CS-BK-2026-00012', 3, 4, 'Rohit Kapoor', 'rohit.kapoor@example.com', '+91 9733445566', CURRENT_DATE - INTERVAL '3 days', '10:00:00', '11:00:00', CURRENT_TIMESTAMP - INTERVAL '74 hours', CURRENT_TIMESTAMP - INTERVAL '73 hours', 800.00, 800.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-09', CURRENT_TIMESTAMP - INTERVAL '74 hours'),
('CS-BK-2026-00013', 3, 2, 'Aarav Mehta', 'aarav.mehta@example.com', '+91 9711002233', CURRENT_DATE - INTERVAL '1 day', '11:00:00', '12:00:00', CURRENT_TIMESTAMP - INTERVAL '26 hours', CURRENT_TIMESTAMP - INTERVAL '25 hours', 800.00, 400.00, 400.00, 'COMPLETED', 'PAID', 'UPI-TXN-103', CURRENT_TIMESTAMP - INTERVAL '26 hours'),
('CS-BK-2026-00014', 3, 1, 'Vikram Singh', 'vikram.singh@example.com', '+91 9711223344', CURRENT_DATE + INTERVAL '1 day', '14:00:00', '15:00:00', CURRENT_TIMESTAMP + INTERVAL '21 hours', CURRENT_TIMESTAMP + INTERVAL '22 hours', 800.00, 800.00, 0.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-10', NULL),
('CS-BK-2026-00015', 3, 5, 'Priya Nair', 'priya.nair@example.com', '+91 9744556677', CURRENT_DATE + INTERVAL '2 days', '10:00:00', '11:00:00', CURRENT_TIMESTAMP + INTERVAL '45 hours', CURRENT_TIMESTAMP + INTERVAL '46 hours', 800.00, 800.00, 0.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-11', NULL),

-- Bookings for Main Cricket Pitch 4
('CS-BK-2026-00016', 4, NULL, 'Tata Consultancy Services XI', 'sports.desk@tcs.com', '+91 9822003344', CURRENT_DATE - INTERVAL '5 days', '09:00:00', '13:00:00', CURRENT_TIMESTAMP - INTERVAL '123 hours', CURRENT_TIMESTAMP - INTERVAL '119 hours', 10000.00, 0.00, 10000.00, 'COMPLETED', 'PAID', 'NEFT-CORP-01', CURRENT_TIMESTAMP - INTERVAL '123 hours'),
('CS-BK-2026-00017', 4, NULL, 'Delhi Under-19 Friendly Match', 'delhicricket@dda.gov.in', '+91 9833004455', CURRENT_DATE - INTERVAL '2 days', '13:00:00', '17:00:00', CURRENT_TIMESTAMP - INTERVAL '52 hours', CURRENT_TIMESTAMP - INTERVAL '48 hours', 10000.00, 0.00, 10000.00, 'COMPLETED', 'PAID', 'NEFT-CORP-02', CURRENT_TIMESTAMP - INTERVAL '52 hours'),
('CS-BK-2026-00018', 4, NULL, 'HDFC Bank Corporate League Match', 'corporate.sports@hdfcbank.com', '+91 9844005566', CURRENT_DATE + INTERVAL '2 days', '08:00:00', '12:00:00', CURRENT_TIMESTAMP + INTERVAL '35 hours', CURRENT_TIMESTAMP + INTERVAL '39 hours', 10000.00, 0.00, 10000.00, 'CONFIRMED', 'PAID', 'NEFT-CORP-03', NULL),
('CS-BK-2026-00019', 4, NULL, 'Inter-College Cup Semifinal', 'sports.council@du.ac.in', '+91 9855006677', CURRENT_DATE + INTERVAL '4 days', '09:00:00', '14:00:00', CURRENT_TIMESTAMP + INTERVAL '83 hours', CURRENT_TIMESTAMP + INTERVAL '88 hours', 12500.00, 0.00, 12500.00, 'CONFIRMED', 'PAID', 'NEFT-CORP-04', NULL),

-- Bookings for Indoor Cricket Nets (Lane A) 5
('CS-BK-2026-00020', 5, 1, 'Vikram Singh', 'vikram.singh@example.com', '+91 9711223344', CURRENT_DATE - INTERVAL '4 days', '18:00:00', '19:00:00', CURRENT_TIMESTAMP - INTERVAL '98 hours', CURRENT_TIMESTAMP - INTERVAL '97 hours', 500.00, 500.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-12', CURRENT_TIMESTAMP - INTERVAL '98 hours'),
('CS-BK-2026-00021', 5, 4, 'Rohit Kapoor', 'rohit.kapoor@example.com', '+91 9733445566', CURRENT_DATE - INTERVAL '1 day', '19:00:00', '20:00:00', CURRENT_TIMESTAMP - INTERVAL '26 hours', CURRENT_TIMESTAMP - INTERVAL '25 hours', 500.00, 500.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-13', CURRENT_TIMESTAMP - INTERVAL '26 hours'),
('CS-BK-2026-00022', 5, 3, 'Neha Sharma', 'neha.sharma@example.com', '+91 9722334455', CURRENT_DATE, '19:00:00', '20:00:00', CURRENT_TIMESTAMP + INTERVAL '7 hours', CURRENT_TIMESTAMP + INTERVAL '8 hours', 500.00, 125.00, 375.00, 'CONFIRMED', 'PAID', 'UPI-TXN-104', NULL),
('CS-BK-2026-00023', 5, 2, 'Aarav Mehta', 'aarav.mehta@example.com', '+91 9711002233', CURRENT_DATE + INTERVAL '1 day', '17:00:00', '18:00:00', CURRENT_TIMESTAMP + INTERVAL '24 hours', CURRENT_TIMESTAMP + INTERVAL '25 hours', 500.00, 250.00, 250.00, 'CONFIRMED', 'PAID', 'UPI-TXN-105', NULL),
('CS-BK-2026-00024', 5, 6, 'Ananya Iyer', 'ananya.iyer@example.com', '+91 9755667788', CURRENT_DATE + INTERVAL '2 days', '16:00:00', '17:00:00', CURRENT_TIMESTAMP + INTERVAL '47 hours', CURRENT_TIMESTAMP + INTERVAL '48 hours', 500.00, 250.00, 250.00, 'CONFIRMED', 'PAID', 'UPI-TXN-106', NULL),

-- Bookings for Indoor Cricket Nets (Lane B) 6
('CS-BK-2026-00025', 6, 5, 'Priya Nair', 'priya.nair@example.com', '+91 9744556677', CURRENT_DATE - INTERVAL '3 days', '17:00:00', '18:00:00', CURRENT_TIMESTAMP - INTERVAL '74 hours', CURRENT_TIMESTAMP - INTERVAL '73 hours', 450.00, 450.00, 0.00, 'COMPLETED', 'PAID', 'MEM-QUOTA-14', CURRENT_TIMESTAMP - INTERVAL '74 hours'),
('CS-BK-2026-00026', 6, 1, 'Vikram Singh', 'vikram.singh@example.com', '+91 9711223344', CURRENT_DATE, '20:00:00', '21:00:00', CURRENT_TIMESTAMP + INTERVAL '8 hours', CURRENT_TIMESTAMP + INTERVAL '9 hours', 450.00, 450.00, 0.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-15', NULL),
('CS-BK-2026-00027', 6, NULL, 'Vivek Mehra (Guest)', 'vivek.m@gmail.com', '+91 9811998877', CURRENT_DATE + INTERVAL '1 day', '18:00:00', '19:00:00', CURRENT_TIMESTAMP + INTERVAL '25 hours', CURRENT_TIMESTAMP + INTERVAL '26 hours', 700.00, 0.00, 700.00, 'CONFIRMED', 'PAID', 'UPI-GUEST-01', NULL),
('CS-BK-2026-00028', 6, 4, 'Rohit Kapoor', 'rohit.kapoor@example.com', '+91 9733445566', CURRENT_DATE + INTERVAL '3 days', '08:00:00', '09:00:00', CURRENT_TIMESTAMP + INTERVAL '71 hours', CURRENT_TIMESTAMP + INTERVAL '72 hours', 450.00, 450.00, 0.00, 'CONFIRMED', 'PAID', 'MEM-QUOTA-16', NULL),
('CS-BK-2026-00029', 6, NULL, 'Devansh Sharma (Guest)', 'devansh@outlook.com', '+91 9822887766', CURRENT_DATE - INTERVAL '2 days', '14:00:00', '15:00:00', CURRENT_TIMESTAMP - INTERVAL '50 hours', CURRENT_TIMESTAMP - INTERVAL '49 hours', 700.00, 0.00, 700.00, 'CANCELLED', 'REFUNDED', 'UPI-REFUND-02', NULL),
('CS-BK-2026-00030', 2, NULL, 'Varun Dhawan (Guest)', 'varun.d@gmail.com', '+91 9833776655', CURRENT_DATE - INTERVAL '1 day', '15:00:00', '16:00:00', CURRENT_TIMESTAMP - INTERVAL '25 hours', CURRENT_TIMESTAMP - INTERVAL '24 hours', 1000.00, 0.00, 1000.00, 'CANCELLED', 'REFUNDED', 'UPI-REFUND-03', NULL)
ON CONFLICT (booking_reference) DO NOTHING;
