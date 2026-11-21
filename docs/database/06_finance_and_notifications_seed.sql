-- =========================================================================
-- CLUBSPHERE: FINANCE, ACCOUNTING & NOTIFICATIONS SEED DATA
-- docs/database/06_finance_and_notifications_seed.sql
-- =========================================================================

-- Clear existing data in payments, expenses, audit_logs
TRUNCATE TABLE payments, expenses, audit_logs RESTART IDENTITY CASCADE;

-- 1. SEED UNIFIED PAYMENTS (40 Transactions)
-- Members: 1 (Vikram), 2 (Aarav), 3 (Neha), 4 (Rohit), 5 (Priya), 6 (Ananya), 7 (Arjun), 13 (Tanvi), 21 (Kavya), 23 (Kabir), 27 (Sahil), 28 (Isha)
-- Staff 6 (Amit Bansal - Accounts & Membership Coordinator) or 2 (Sunita Rao) for Cash receipts.
INSERT INTO payments (
    payment_reference, transaction_id, user_id, member_id, source_module, related_entity_id,
    amount, payment_method, payment_status, refund_amount, refund_reason,
    received_by_staff_id, payer_name, payer_email, notes, is_demo, payment_date
) VALUES
-- Membership Purchases & Renewals
('PAY-2026-00001', 'TXN-UPI-982101', 3, 1, 'MEMBERSHIP', 1, 15000.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Vikram Singh', 'vikram.singh@example.com', 'Annual Gold Membership subscription fee', true, '2026-01-15 10:30:00+05:30'),
('PAY-2026-00002', 'TXN-CARD-441202', 4, 2, 'MEMBERSHIP', 2, 15000.00, 'CARD', 'COMPLETED', 0.00, NULL, NULL, 'Aarav Mehta', 'aarav.mehta@example.com', 'Gold Membership subscription via HDFC Card', true, '2026-02-01 11:15:00+05:30'),
('PAY-2026-00003', 'TXN-UPI-883303', 10, 3, 'MEMBERSHIP', 3, 8000.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Neha Sharma', 'neha.sharma@example.com', 'Silver Membership subscription (6 Months)', true, '2026-02-10 14:20:00+05:30'),
('PAY-2026-00004', 'TXN-ONLINE-112204', 11, 4, 'MEMBERSHIP', 4, 8000.00, 'ONLINE', 'COMPLETED', 0.00, NULL, NULL, 'Rohit Kapoor', 'rohit.kapoor@example.com', 'Silver Membership semester subscription', true, '2026-02-15 09:45:00+05:30'),
('PAY-2026-00005', 'TXN-UPI-774405', 12, 5, 'MEMBERSHIP', 5, 5000.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Priya Nair', 'priya.nair@example.com', 'Junior Development Membership (< 18 yrs)', true, '2026-01-20 16:00:00+05:30'),
('PAY-2026-00006', 'TXN-UPI-556606', 3, 1, 'MEMBERSHIP_RENEWAL', 1, 15000.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Vikram Singh', 'vikram.singh@example.com', 'Annual Gold Membership auto-renewal', true, '2026-11-01 10:00:00+05:30'),
('PAY-2026-00007', 'TXN-CARD-332207', 10, 3, 'MEMBERSHIP_UPGRADE', 3, 7000.00, 'CARD', 'COMPLETED', 0.00, NULL, NULL, 'Neha Sharma', 'neha.sharma@example.com', 'Upgrade from Silver to Gold Tier', true, '2026-11-10 15:30:00+05:30'),
('PAY-2026-00008', 'TXN-CASH-998808', 13, 6, 'MEMBERSHIP', 6, 8000.00, 'CASH', 'COMPLETED', 0.00, NULL, 6, 'Ananya Iyer', 'ananya.iyer@example.com', 'Silver plan paid in cash at Front Desk', true, '2025-05-10 12:00:00+05:30'),

-- Court Bookings (Completed, Cash, UPI, Card, Pending, Refunded)
('PAY-2026-00009', 'TXN-UPI-445509', 10, 3, 'COURT_BOOKING', 1, 200.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Neha Sharma', 'neha.sharma@example.com', 'Court 1 Championship Tennis - 50% Silver discount', true, '2026-11-18 08:30:00+05:30'),
('PAY-2026-00010', 'TXN-UPI-667710', 11, 4, 'COURT_BOOKING', 2, 150.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Rohit Kapoor', 'rohit.kapoor@example.com', 'Court 3 Badminton Arena A - 50% Silver discount', true, '2026-11-19 17:00:00+05:30'),
('PAY-2026-00011', 'TXN-CASH-123411', 14, 7, 'COURT_BOOKING', 3, 350.00, 'CASH', 'COMPLETED', 0.00, NULL, 6, 'Arjun Patel', 'arjun.patel@example.com', 'Court 5 Glass-Back Squash - Front Desk cash collection', true, '2026-11-20 18:30:00+05:30'),
('PAY-2026-00012', 'TXN-CARD-889912', 4, 2, 'COURT_BOOKING', 4, 0.00, 'ONLINE', 'COMPLETED', 0.00, NULL, NULL, 'Aarav Mehta', 'aarav.mehta@example.com', 'Court 2 Tennis - 100% Free Gold quota booking', true, '2026-11-20 07:00:00+05:30'),
('PAY-2026-00013', 'TXN-UPI-223313', 3, 1, 'COURT_BOOKING', 5, 0.00, 'ONLINE', 'COMPLETED', 0.00, NULL, NULL, 'Vikram Singh', 'vikram.singh@example.com', 'Court 1 Tennis - 100% Free Gold quota booking', true, '2026-11-21 07:00:00+05:30'),
('PAY-2026-00014', 'TXN-UPI-994414', 12, 5, 'COURT_BOOKING', 6, 210.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Priya Nair', 'priya.nair@example.com', 'Court 4 Badminton Arena B - Junior 30% discount', true, '2026-11-21 16:00:00+05:30'),
('PAY-2026-00015', 'TXN-ONLINE-551115', 44, 21, 'COURT_BOOKING', 7, 400.00, 'ONLINE', 'REFUNDED', 400.00, 'Student cancelled court booking 24h prior due to lab exam', NULL, 'Kavya Nambiar', 'kavya.nambiar@student.edu', 'Full refund credited back to student UPI ID', true, '2026-11-15 09:00:00+05:30'),
('PAY-2026-00016', 'TXN-UPI-662216', 14, 7, 'COURT_BOOKING', 8, 450.00, 'UPI', 'FAILED', 0.00, 'Bank UPI timeout during payment verification', NULL, 'Arjun Patel', 'arjun.patel@example.com', 'Failed transaction - court slot released', true, '2026-11-16 11:15:00+05:30'),
('PAY-2026-00017', 'TXN-CASH-773317', 46, 28, 'COURT_BOOKING', 9, 300.00, 'CASH', 'PENDING', 0.00, NULL, 6, 'Isha Gupta', 'isha.gupta@student.edu', 'Court reserved - pay at front desk upon arrival', true, '2026-11-22 08:00:00+05:30'),
('PAY-2026-00018', 'TXN-CARD-118818', 10, 3, 'COURT_BOOKING', 10, 400.00, 'CARD', 'COMPLETED', 0.00, NULL, NULL, 'Neha Sharma', 'neha.sharma@example.com', 'Court 6 Clay Tennis Court booking', true, '2026-11-17 17:30:00+05:30'),

-- Sports Shop Equipment Purchases
('PAY-2026-00019', 'TXN-UPI-449919', 3, 1, 'SPORTS_SHOP', 1, 6374.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Vikram Singh', 'vikram.singh@example.com', 'Yonex Astrox 88D Pro Racket - 15% Gold discount', true, '2026-11-12 18:00:00+05:30'),
('PAY-2026-00020', 'TXN-CARD-223320', 4, 2, 'SPORTS_SHOP', 2, 552.00, 'CARD', 'COMPLETED', 0.00, NULL, NULL, 'Aarav Mehta', 'aarav.mehta@example.com', 'Wilson US Open Tennis Balls Can of 3 - 15% Gold discount', true, '2026-11-14 14:10:00+05:30'),
('PAY-2026-00021', 'TXN-CASH-665521', 11, 4, 'SPORTS_SHOP', 3, 10799.00, 'CASH', 'COMPLETED', 0.00, NULL, 6, 'Rohit Kapoor', 'rohit.kapoor@example.com', 'Asics Gel-Resolution 9 Clay Court Shoes - Cash purchase', true, '2026-11-16 19:20:00+05:30'),
('PAY-2026-00022', 'TXN-UPI-331122', 12, 5, 'SPORTS_SHOP', 4, 450.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Priya Nair', 'priya.nair@example.com', 'Yonex BG-65 Ti Badminton String + Stenciling', true, '2026-11-18 16:45:00+05:30'),
('PAY-2026-00023', 'TXN-ONLINE-778823', 44, 21, 'SPORTS_SHOP', 5, 3825.00, 'ONLINE', 'COMPLETED', 0.00, NULL, NULL, 'Kavya Nambiar', 'kavya.nambiar@student.edu', 'ClubSphere Tournament 6-Racket Thermo Kit Bag', true, '2026-11-19 12:30:00+05:30'),
('PAY-2026-00024', 'TXN-UPI-119924', 14, 7, 'SPORTS_SHOP', 6, 1200.00, 'UPI', 'REFUNDED', 1200.00, 'Incorrect shoe size returned unworn with tags', NULL, 'Arjun Patel', 'arjun.patel@example.com', 'Pro Shop return & instant refund', true, '2026-11-17 15:00:00+05:30'),
('PAY-2026-00025', 'TXN-UPI-884425', 25, 13, 'SPORTS_SHOP', 7, 2800.00, 'UPI', 'PENDING', 0.00, NULL, NULL, 'Tanvi Bansal', 'tanvi.bansal@student.edu', 'Head Speed MP Racket demo deposit', true, '2026-11-21 11:00:00+05:30'),
('PAY-2026-00026', 'TXN-CARD-552226', 38, 23, 'SPORTS_SHOP', 8, 499.00, 'CARD', 'COMPLETED', 0.00, NULL, NULL, 'Kabir Sharma', 'kabir.sharma@student.edu', 'Dunlop Pro Squash Balls Double Yellow Dot (Tube of 3)', true, '2026-11-15 16:30:00+05:30'),

-- Sports Cafe Food & Beverage Orders
('PAY-2026-00027', 'TXN-UPI-110027', 3, 1, 'FOOD_BEVERAGE', 1, 162.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Vikram Singh', 'vikram.singh@example.com', 'Hydration Electrolyte Whey Smoothie - 10% Gold discount', true, '2026-11-21 08:35:00+05:30'),
('PAY-2026-00028', 'TXN-UPI-220028', 4, 2, 'FOOD_BEVERAGE', 2, 198.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Aarav Mehta', 'aarav.mehta@example.com', 'Grilled Chicken Avocado High-Protein Wrap', true, '2026-11-21 13:00:00+05:30'),
('PAY-2026-00029', 'TXN-CASH-330029', 11, 4, 'FOOD_BEVERAGE', 3, 210.00, 'CASH', 'COMPLETED', 0.00, NULL, 6, 'Rohit Kapoor', 'rohit.kapoor@example.com', 'Wild Berry Acai Recovery Bowl - Cash payment at counter', true, '2026-11-20 18:15:00+05:30'),
('PAY-2026-00030', 'TXN-UPI-440030', 10, 3, 'FOOD_BEVERAGE', 4, 150.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Neha Sharma', 'neha.sharma@example.com', 'Double Shot Iced Americano + Energy Protein Bar', true, '2026-11-19 16:00:00+05:30'),
('PAY-2026-00031', 'TXN-UPI-550031', 44, 21, 'FOOD_BEVERAGE', 5, 180.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Kavya Nambiar', 'kavya.nambiar@student.edu', 'Peanut Butter Banana Muscle Shake', true, '2026-11-20 19:45:00+05:30'),
('PAY-2026-00032', 'TXN-CASH-660032', 12, 5, 'FOOD_BEVERAGE', 6, 120.00, 'CASH', 'COMPLETED', 0.00, NULL, 6, 'Priya Nair', 'priya.nair@example.com', 'Fresh Cold-Pressed Valencia Orange Juice', true, '2026-11-21 17:15:00+05:30'),
('PAY-2026-00033', 'TXN-ONLINE-770033', 25, 13, 'FOOD_BEVERAGE', 7, 340.00, 'ONLINE', 'COMPLETED', 0.00, NULL, NULL, 'Tanvi Bansal', 'tanvi.bansal@student.edu', 'Mediterranean Falafel Hummus Protein Bowl', true, '2026-11-18 12:45:00+05:30'),
('PAY-2026-00034', 'TXN-UPI-880034', 25, 13, 'FOOD_BEVERAGE', 8, 90.00, 'UPI', 'FAILED', 0.00, 'Declined by issuing bank', NULL, 'Tanvi Bansal', 'tanvi.bansal@student.edu', 'Cold brew latte - Failed transaction', true, '2026-11-19 10:15:00+05:30'),

-- Friday Social Play Mixer Fee
('PAY-2026-00035', 'TXN-UPI-990035', 10, 3, 'COURT_BOOKING', 11, 250.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Neha Sharma', 'neha.sharma@example.com', 'Friday Social Play mix-in entry fee + beverages', true, '2026-11-21 18:00:00+05:30'),
('PAY-2026-00036', 'TXN-CASH-100036', 42, 27, 'COURT_BOOKING', 12, 250.00, 'CASH', 'COMPLETED', 0.00, NULL, 6, 'Sahil Khurana', 'sahil.khurana@student.edu', 'Friday Social Play guest entry fee', true, '2026-11-21 18:15:00+05:30'),

-- Guest Passes & Miscellaneous
('PAY-2026-00037', 'TXN-UPI-111037', 10, 3, 'OTHER', 13, 150.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Neha Sharma', 'neha.sharma@example.com', 'Guest green fee for non-member partner', true, '2026-11-14 08:00:00+05:30'),
('PAY-2026-00038', 'TXN-UPI-222038', 11, 4, 'OTHER', 14, 150.00, 'UPI', 'COMPLETED', 0.00, NULL, NULL, 'Rohit Kapoor', 'rohit.kapoor@example.com', 'Guest green fee for doubles partner', true, '2026-11-16 17:30:00+05:30'),
('PAY-2026-00039', 'TXN-UPI-333039', 14, 7, 'MEMBERSHIP', 15, 8000.00, 'UPI', 'PENDING', 0.00, NULL, NULL, 'Arjun Patel', 'arjun.patel@example.com', 'Silver Membership pending bank NEFT verification', true, '2026-11-21 20:00:00+05:30'),
('PAY-2026-00040', 'TXN-ONLINE-444040', 44, 21, 'COURT_BOOKING', 16, 350.00, 'ONLINE', 'PARTIALLY_REFUNDED', 175.00, 'Rain interruption after 30 minutes of court play', NULL, 'Kavya Nambiar', 'kavya.nambiar@student.edu', '50% rain credit issued per club weather policy', true, '2026-11-13 18:00:00+05:30');


-- 2. SEED EXPENSES (25 Operational Expenses across all 7 categories)
INSERT INTO expenses (
    expense_reference, category, description, amount, expense_date, payment_method,
    vendor_name, receipt_url, recorded_by_user_id
) VALUES
-- Staff Salaries
('EXP-2026-001', 'STAFF_SALARY', 'Monthly Coaching Honorarium - Coach Rahul Verma (Senior Tennis Coach)', 45000.00, '2026-11-01', 'BANK_TRANSFER', 'Rahul Verma', 'SALARY-EMP001-NOV26.pdf', 1),
('EXP-2026-002', 'STAFF_SALARY', 'Monthly Salary - Sunita Rao (Court Operations & Turnstile Supervisor)', 32000.00, '2026-11-01', 'BANK_TRANSFER', 'Sunita Rao', 'SALARY-EMP002-NOV26.pdf', 1),
('EXP-2026-003', 'STAFF_SALARY', 'Monthly Honorarium - Vikram Deshmukh (Strength & Conditioning Lead)', 42000.00, '2026-11-01', 'BANK_TRANSFER', 'Vikram Deshmukh', 'SALARY-EMP003-NOV26.pdf', 1),
('EXP-2026-004', 'STAFF_SALARY', 'Monthly Salary - Meera Joshi (Sports Cafe Nutritionist & Chef)', 28000.00, '2026-11-01', 'BANK_TRANSFER', 'Meera Joshi', 'SALARY-EMP004-NOV26.pdf', 1),
('EXP-2026-005', 'STAFF_SALARY', 'Monthly Wages - Facility & Court Ground Maintenance Staff (3 Personnel)', 36000.00, '2026-11-01', 'BANK_TRANSFER', 'Ground Support Crew', 'SALARY-CREW-NOV26.pdf', 1),

-- Equipment Purchases
('EXP-2026-006', 'EQUIPMENT_PURCHASE', 'Purchase of 2 Spinshot Player Tennis Ball Machines for Academy Training', 185000.00, '2026-10-15', 'BANK_TRANSFER', 'Spinshot Sports India Pvt Ltd', 'INV-SPIN-2026-101.pdf', 1),
('EXP-2026-007', 'EQUIPMENT_PURCHASE', 'Yonex Precision 9.0 Electronic Racket Stringing Machine Calibration & Jaws', 18500.00, '2026-11-05', 'CARD', 'Sunrise Sports India', 'INV-SUN-8841.pdf', 1),
('EXP-2026-008', 'EQUIPMENT_PURCHASE', 'Replacement of 4 Heavy-Duty Badminton Court Net Posts & Regulated Braided Nets', 14200.00, '2026-11-08', 'UPI', 'Stag Sports Equipment Co.', 'INV-STAG-332.pdf', 1),
('EXP-2026-009', 'EQUIPMENT_PURCHASE', 'Water-Jet High-Pressure Court Squeegees & Roll-Dri Sponge Rollers (Set of 6)', 8900.00, '2026-11-12', 'UPI', 'SportMaster India Ltd', 'INV-SPM-9912.pdf', 1),

-- Court Maintenance & Upkeep
('EXP-2026-010', 'COURT_MAINTENANCE', 'Synthetic Hard Court Acrylic Surface Resurfacing & Line Stenciling (Court 1 & 2)', 65000.00, '2026-10-22', 'BANK_TRANSFER', 'Apex Court Infrastructure LLP', 'INV-APX-771.pdf', 1),
('EXP-2026-011', 'COURT_MAINTENANCE', 'Glass-Back Squash Court Wall Buffing & Wooden Floor Deep Sanding (Court 5)', 24000.00, '2026-11-04', 'BANK_TRANSFER', 'ASB Squash Surface Solutions', 'INV-ASB-441.pdf', 1),
('EXP-2026-012', 'COURT_MAINTENANCE', 'Weekly Red Clay Court Top-Dressing Calcium Chloride & Roller Fuel', 5400.00, '2026-11-10', 'CASH', 'Har-Tru Material Supplies', 'CASH-REC-1102.pdf', 1),
('EXP-2026-013', 'COURT_MAINTENANCE', 'LED High-Bay Stadium Floodlight Replacement Bulbs & Sensor Relays', 16800.00, '2026-11-14', 'CARD', 'Philips Lumileds Electricals', 'INV-PHL-552.pdf', 1),

-- Utilities & Electricity
('EXP-2026-014', 'UTILITIES_ELECTRICITY', 'Monthly Campus Power Utility Bill - 500 Lux Stadium LED Floodlighting', 38600.00, '2026-11-10', 'BANK_TRANSFER', 'State Electricity Distribution Co Ltd', 'EB-BILL-OCT26.pdf', 1),
('EXP-2026-015', 'UTILITIES_ELECTRICITY', 'Olympic Swimming Pool Gas Heat Pump & Continuous UV Filtration Power', 22400.00, '2026-11-10', 'BANK_TRANSFER', 'State Electricity Distribution Co Ltd', 'EB-BILL-POOL.pdf', 1),
('EXP-2026-016', 'UTILITIES_ELECTRICITY', 'RO Water Treatment Plant Consumables & Membrane Servicing', 6500.00, '2026-11-02', 'UPI', 'AquaPure Commercial Filtration', 'INV-AQUA-661.pdf', 1),

-- Shop Inventory Purchases
('EXP-2026-017', 'SHOP_INVENTORY', 'Wholesale Purchase of Wilson US Open Tennis Balls (40 Cans) & Grips', 22000.00, '2026-11-03', 'BANK_TRANSFER', 'Amer Sports India Private Ltd', 'INV-AMER-4491.pdf', 1),
('EXP-2026-018', 'SHOP_INVENTORY', 'Yonex Aerosensa 30 Feather Shuttlecocks (30 Tubes)', 36000.00, '2026-11-06', 'BANK_TRANSFER', 'Sunrise Sports Wholesale India', 'INV-SUN-1092.pdf', 1),
('EXP-2026-019', 'SHOP_INVENTORY', 'Sports Cafe Health Stock: Optimum Nutrition 100% Whey Isolate (10 Tubs)', 38000.00, '2026-11-08', 'CARD', 'Glanbia Performance Nutrition', 'INV-GLAN-771.pdf', 1),
('EXP-2026-020', 'SHOP_INVENTORY', 'Fresh Frozen Organic Acai Puree, Chia Seeds & Almond Milk Cartons', 12500.00, '2026-11-15', 'UPI', 'GreenLife Organic Wholesalers', 'INV-GL-4410.pdf', 1),

-- Event Expenses
('EXP-2026-021', 'EVENT_EXPENSE', 'Inter-Branch Badminton Championship Trophies, Medals & Certificates', 14000.00, '2026-11-14', 'UPI', 'Royal Trophy & Awards Emporium', 'INV-ROYAL-99.pdf', 1),
('EXP-2026-022', 'EVENT_EXPENSE', 'Weekly Friday Social Mix-In Refreshments, Electrolytes & Fruit Platters', 4500.00, '2026-11-15', 'CASH', 'Campus Fresh Mart', 'CASH-VOUCHER-01.pdf', 1),
('EXP-2026-023', 'EVENT_EXPENSE', 'Annual Club Tennis Open Banner Printing & Media Backdrop Boards', 6800.00, '2026-11-18', 'UPI', 'Speedy Print Signage Works', 'INV-PRN-881.pdf', 1),

-- Other Expenses
('EXP-2026-024', 'OTHER', 'Sports First-Aid & Physiotherapy Medic Room Replenishment (K-Tape, Ice Packs)', 5800.00, '2026-11-11', 'UPI', 'Apollo Healthcare Supplies', 'INV-APO-3391.pdf', 1),
('EXP-2026-025', 'OTHER', 'Turnstile Optical Barcode Scanner Spare Module for Gate 2 Kiosk', 9200.00, '2026-11-13', 'CARD', 'Zebra Technologies India', 'INV-ZEB-5521.pdf', 1);


-- 3. SEED AUDIT LOGS FOR FINANCIAL & OPERATIONS TRACEABILITY
INSERT INTO audit_logs (action, entity_name, entity_id, performed_by, details, ip_address) VALUES
('CREATE_MEMBERSHIP_PAYMENT', 'Payment', 1, 'admin@clubsphere.com', 'Recorded ₹15,000 Gold Membership payment for Vikram Singh', '127.0.0.1'),
('CREATE_MEMBERSHIP_PAYMENT', 'Payment', 3, 'admin@clubsphere.com', 'Recorded ₹8,000 Silver Membership payment for Neha Sharma', '127.0.0.1'),
('PROCESS_REFUND', 'Payment', 15, 'admin@clubsphere.com', 'Processed ₹400 full refund for cancelled Court Booking 7 by Kavya Nambiar', '127.0.0.1'),
('PROCESS_PARTIAL_REFUND', 'Payment', 40, 'admin@clubsphere.com', 'Issued 50% rain delay credit (₹175) for Court Booking 16', '127.0.0.1'),
('CREATE_EXPENSE', 'Expense', 1, 'admin@clubsphere.com', 'Recorded ₹45,000 monthly payroll expense for Coach Rahul Verma', '127.0.0.1'),
('CREATE_EXPENSE', 'Expense', 10, 'admin@clubsphere.com', 'Recorded ₹65,000 court resurfacing expense for Courts 1 & 2', '127.0.0.1'),
('CREATE_EXPENSE', 'Expense', 14, 'admin@clubsphere.com', 'Recorded ₹38,600 monthly utility power bill for floodlit courts', '127.0.0.1'),
('RECONCILE_PAYMENTS', 'Finance', 0, 'admin@clubsphere.com', 'Performed mid-month cash and online payments reconciliation. 4 cash receipts matched.', '127.0.0.1');


-- 4. SEED NOTIFICATIONS (Admin, Staff, and Student Role-Based Alerts)
INSERT INTO notifications (
    user_id, recipient_role, title, message, type, category, severity,
    related_entity_type, related_entity_id, action_url, is_read, created_at
) VALUES
-- Admin Alerts
(1, 'ROLE_ADMIN', 'New Student Member Registration', 'Aarav Mehta has registered for a Gold Membership.', 'REGISTRATION', 'MEMBERSHIP', 'LOW', 'Member', 2, '/admin/users', false, '2026-11-21 10:15:00+05:30'),
(1, 'ROLE_ADMIN', 'Monthly Revenue Target Achieved', 'ClubSphere reached ₹85,000 in monthly revenue, surpassing the November milestone!', 'FINANCE', 'FINANCE', 'HIGH', 'Finance', 1, '/admin/finance', false, '2026-11-20 18:00:00+05:30'),
(1, 'ROLE_ADMIN', 'Refund Request Processed', 'Full refund of ₹400 for Court Booking #7 (Kavya Nambiar) was completed.', 'REFUND', 'FINANCE', 'MEDIUM', 'Payment', 15, '/admin/finance/payments', true, '2026-11-15 09:30:00+05:30'),
(1, 'ROLE_ADMIN', 'Low Inventory Alert: Shuttlecocks', 'Yonex Aerosensa 30 shuttlecock tubes are down to 4 units at Pro Shop.', 'INVENTORY', 'INVENTORY', 'HIGH', 'ShopProduct', 3, '/shops', false, '2026-11-21 14:00:00+05:30'),
(1, 'ROLE_ADMIN', 'New Staff Leave Request', 'Coach Rahul Verma submitted a casual leave request for Nov 28, 2026.', 'LEAVE_REQUEST', 'STAFF_DUTY', 'MEDIUM', 'LeaveRequest', 1, '/admin/leaves', false, '2026-11-21 16:30:00+05:30'),
(1, 'ROLE_ADMIN', 'New Public Enquiry Received', 'Amit Patel submitted an enquiry regarding weekend junior badminton training.', 'ENQUIRY', 'ENQUIRY', 'LOW', 'Enquiry', 1, '/admin/enquiries', false, '2026-11-21 17:00:00+05:30'),
(1, 'ROLE_ADMIN', 'Unusual Expense Logged: Power Utility', 'Monthly power utility bill of ₹38,600 logged for November stadium illumination.', 'EXPENSE', 'FINANCE', 'MEDIUM', 'Expense', 14, '/admin/finance/expenses', false, '2026-11-10 11:00:00+05:30'),

-- Staff Alerts
(2, 'ROLE_STAFF', 'Shift Schedule Published: Week 47', 'Your upcoming coaching schedule for Court 1 & 2 is now finalized in the portal.', 'DUTY', 'STAFF_DUTY', 'INFO', 'EmployeeShift', 1, '/staff/shifts', false, '2026-11-20 09:00:00+05:30'),
(2, 'ROLE_STAFF', 'New Court Booking Assigned: Court 1', 'Court 1 reserved for singles tournament match tomorrow at 7:00 AM.', 'BOOKING', 'BOOKING', 'LOW', 'CourtBooking', 5, '/staff/bookings', false, '2026-11-21 15:00:00+05:30'),
(5, 'ROLE_STAFF', 'New Sports Shop Order #CS-ORD-9982', 'Rohit Kapoor ordered Asics Gel-Resolution 9 shoes for front desk pickup.', 'ORDER', 'INVENTORY', 'MEDIUM', 'ShopProduct', 3, '/shops', false, '2026-11-16 19:25:00+05:30'),
(5, 'ROLE_STAFF', 'Sports Cafe Order Ready for Pickup', 'Whey Protein Smoothie ordered by Vikram Singh is prepared at cafe window.', 'ORDER', 'INVENTORY', 'LOW', 'ShopProduct', 1, '/shops', true, '2026-11-21 08:40:00+05:30'),

-- Student Notifications (Vikram Singh - user 3)
(3, 'ROLE_MEMBER', 'Welcome to ClubSphere Sports Pavilion', 'Your student account is active. Explore Olympic-grade courts and coaching schedules.', 'WELCOME', 'SYSTEM', 'LOW', 'User', 3, '/student/dashboard', true, '2026-01-15 10:00:00+05:30'),
(3, 'ROLE_MEMBER', 'Gold Membership Purchase Confirmed', 'Payment of ₹15,000 received. Unlimited free court bookings unlocked!', 'MEMBERSHIP', 'FINANCE', 'HIGH', 'Payment', 1, '/member/my-membership', true, '2026-01-15 10:30:00+05:30'),
(3, 'ROLE_MEMBER', 'Court Booking Confirmed: Court 1', 'Your reservation for Championship Tennis on Nov 22 at 7:00 AM is confirmed.', 'BOOKING', 'BOOKING', 'MEDIUM', 'CourtBooking', 5, '/member/my-bookings', false, '2026-11-21 12:00:00+05:30'),
(3, 'ROLE_MEMBER', 'Friday Social Play Mixer RSVP Confirmed', 'You are registered for Friday Social Doubles (Badminton & Tennis) at 6:00 PM.', 'SOCIAL_PLAY', 'BOOKING', 'INFO', 'SocialPlaySession', 1, '/member/social-play', false, '2026-11-21 14:00:00+05:30'),

-- Student Notifications (Kavya Nambiar - user 44)
(44, 'ROLE_MEMBER', '7-Day Free Trial Activated!', 'Welcome to your trial. Enjoy full court bookings and member dining privileges for 7 days.', 'TRIAL', 'TRIAL', 'HIGH', 'User', 44, '/student/dashboard', true, '2026-11-15 08:00:00+05:30'),
(44, 'ROLE_MEMBER', 'Trial Expiry Reminder: 3 Days Left', 'Your 7-day trial ends in 3 days. Upgrade to Gold or Silver to keep your booking privileges.', 'TRIAL', 'TRIAL', 'HIGH', 'User', 44, '/member/plans', false, '2026-11-19 09:00:00+05:30'),
(44, 'ROLE_MEMBER', 'Refund Credited to UPI Account', 'Refund of ₹400 for cancelled booking #7 has been credited to your UPI ID.', 'REFUND', 'FINANCE', 'MEDIUM', 'Payment', 15, '/member/payments', true, '2026-11-15 10:00:00+05:30'),

-- Student Notifications (Ananya Iyer - user 13)
(13, 'ROLE_MEMBER', 'Membership Expiration Notice', 'Your Silver Membership expired. Renew today to restore your turnstile pass.', 'EXPIRY', 'MEMBERSHIP', 'CRITICAL', 'Membership', 6, '/member/my-membership', false, '2026-11-10 00:01:00+05:30');
