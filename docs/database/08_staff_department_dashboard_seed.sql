-- ============================================================================
-- CLUBSPHERE – STAFF DASHBOARD, WORKFLOW, PERMISSIONS & DATA SEEDING
-- ============================================================================

-- 1. SEED PERMISSIONS
INSERT INTO permissions (code, department_code, description) VALUES
-- Sports Shop Permissions
('SPORTS_PRODUCT_VIEW', 'SPORTS_SHOP', 'View sports accessories and equipment catalog'),
('SPORTS_PRODUCT_UPDATE', 'SPORTS_SHOP', 'Update sports product details, status and descriptions'),
('SPORTS_INVENTORY_VIEW', 'SPORTS_SHOP', 'View sports inventory stock levels and movements'),
('SPORTS_INVENTORY_UPDATE', 'SPORTS_SHOP', 'Adjust sports inventory stock and record movements'),
('SPORTS_ORDER_VIEW', 'SPORTS_SHOP', 'View sports shop customer and pickup orders'),
('SPORTS_ORDER_ACCEPT', 'SPORTS_SHOP', 'Accept new incoming sports orders'),
('SPORTS_ORDER_STATUS_UPDATE', 'SPORTS_SHOP', 'Update sports order workflow status (packing, ready, dispatch, complete)'),
('SPORTS_RETURN_VIEW', 'SPORTS_SHOP', 'View customer return and exchange requests'),
('SPORTS_RETURN_REVIEW', 'SPORTS_SHOP', 'Review and process product returns and condition inspection'),
('SPORTS_COUNTER_SALE', 'SPORTS_SHOP', 'Process in-store counter POS sales with barcode lookup'),
('SPORTS_REPORT_VIEW', 'SPORTS_SHOP', 'View sports shop sales and inventory reports'),
('EQUIPMENT_RENTAL_MANAGE', 'SPORTS_SHOP', 'Manage sports equipment rental reservations and returns'),
('COURT_BOOKING_VIEW', 'SPORTS_SHOP', 'Read-only view of court bookings for equipment prep'),

-- Food Shop / Cafe Permissions
('FOOD_MENU_VIEW', 'FOOD_SHOP', 'View food and beverage menu items'),
('FOOD_MENU_AVAILABILITY_UPDATE', 'FOOD_SHOP', 'Toggle menu item availability and update prep times'),
('FOOD_ORDER_VIEW', 'FOOD_SHOP', 'View food orders from student portal, tables and counter'),
('FOOD_ORDER_ACCEPT', 'FOOD_SHOP', 'Accept pending food orders into kitchen queue'),
('FOOD_ORDER_STATUS_UPDATE', 'FOOD_SHOP', 'Update food order kitchen status (preparing, ready, served)'),
('FOOD_TABLE_VIEW', 'FOOD_SHOP', 'View cafe tables and seating status'),
('FOOD_TABLE_MANAGE', 'FOOD_SHOP', 'Manage table assignment, seating status and tabs'),
('FOOD_INVENTORY_VIEW', 'FOOD_SHOP', 'View cafe kitchen ingredients and stock levels'),
('FOOD_INVENTORY_UPDATE', 'FOOD_SHOP', 'Record ingredient usage, restock and wastage'),
('FOOD_BILL_CREATE', 'FOOD_SHOP', 'Generate cafe bills, split bills and table tabs'),
('FOOD_PAYMENT_RECORD_CASH', 'FOOD_SHOP', 'Record cash and counter payments for cafe bills'),
('FOOD_RETURN_REVIEW', 'FOOD_SHOP', 'Review food complaints, order cancellations and wastage'),
('FOOD_REPORT_VIEW', 'FOOD_SHOP', 'View cafe sales and kitchen preparation time reports')
ON CONFLICT (code) DO NOTHING;

-- 2. SEED STAFF USERS & EMPLOYEES
-- Password for all evaluation staff is Staff@123
-- Hash: $2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm

-- A. SP001 - Sports Shop Lead
INSERT INTO users (email, password_hash, full_name, phone, address, date_of_birth, gender, status, is_email_verified)
VALUES ('sports.staff@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Rajesh Kumar', '+91 98765 43230', 'Flat 402, Green Glen Layout, Bangalore', '1992-06-15', 'MALE', 'ACTIVE', TRUE)
ON CONFLICT (email) DO UPDATE SET full_name = 'Rajesh Kumar', status = 'ACTIVE';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, 2 FROM users u WHERE u.email = 'sports.staff@clubsphere.com'
ON CONFLICT DO NOTHING;

INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'SP001', d.id, 'Sports Shop Lead', '2023-01-15', 'ACTIVE', 'FULL_TIME', 42000.00
FROM users u, departments d
WHERE u.email = 'sports.staff@clubsphere.com' AND d.code = 'SPORTS_SHOP'
ON CONFLICT (employee_code) DO UPDATE SET department_id = EXCLUDED.department_id, designation = 'Sports Shop Lead';

-- B. FD001 - Cafe Manager
INSERT INTO users (email, password_hash, full_name, phone, address, date_of_birth, gender, status, is_email_verified)
VALUES ('cafe.staff@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Meera Joshi', '+91 98765 43231', '302 Lakeview Residency, Bangalore', '1994-08-20', 'FEMALE', 'ACTIVE', TRUE)
ON CONFLICT (email) DO UPDATE SET full_name = 'Meera Joshi', status = 'ACTIVE';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, 2 FROM users u WHERE u.email = 'cafe.staff@clubsphere.com'
ON CONFLICT DO NOTHING;

INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'FD001', d.id, 'Sports Cafe & Nutrition Manager', '2023-03-01', 'ACTIVE', 'FULL_TIME', 45000.00
FROM users u, departments d
WHERE u.email = 'cafe.staff@clubsphere.com' AND d.code = 'FOOD_SHOP'
ON CONFLICT (employee_code) DO UPDATE SET department_id = EXCLUDED.department_id, designation = 'Sports Cafe & Nutrition Manager';

-- C. SP002 - Sports Shop Assistant
INSERT INTO users (email, password_hash, full_name, phone, address, date_of_birth, gender, status, is_email_verified)
VALUES ('anita.sports@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Anita Sharma', '+91 98765 43232', '12 Indiranagar, Bangalore', '1996-11-10', 'FEMALE', 'ACTIVE', TRUE)
ON CONFLICT (email) DO UPDATE SET full_name = 'Anita Sharma', status = 'ACTIVE';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, 2 FROM users u WHERE u.email = 'anita.sports@clubsphere.com'
ON CONFLICT DO NOTHING;

INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'SP002', d.id, 'Sports Shop Associate', '2023-07-15', 'ACTIVE', 'FULL_TIME', 28000.00
FROM users u, departments d
WHERE u.email = 'anita.sports@clubsphere.com' AND d.code = 'SPORTS_SHOP'
ON CONFLICT (employee_code) DO UPDATE SET department_id = EXCLUDED.department_id, designation = 'Sports Shop Associate';

-- D. FD002 - Cafe Kitchen Chef
INSERT INTO users (email, password_hash, full_name, phone, address, date_of_birth, gender, status, is_email_verified)
VALUES ('vikas.cafe@clubsphere.com', '$2a$10$lQJpDkp2pTwrke/xKaUY9u4.euLe1BqdFyqAYtFZMkm7OOoA7TeZm', 'Vikas Patel', '+91 98765 43233', '88 Koramangala, Bangalore', '1995-02-14', 'MALE', 'ACTIVE', TRUE)
ON CONFLICT (email) DO UPDATE SET full_name = 'Vikas Patel', status = 'ACTIVE';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, 2 FROM users u WHERE u.email = 'vikas.cafe@clubsphere.com'
ON CONFLICT DO NOTHING;

INSERT INTO employees (user_id, employee_code, department_id, designation, joining_date, employment_status, employment_type, base_salary)
SELECT u.id, 'FD002', d.id, 'Head Cafe Chef', '2023-04-10', 'ACTIVE', 'FULL_TIME', 32000.00
FROM users u, departments d
WHERE u.email = 'vikas.cafe@clubsphere.com' AND d.code = 'FOOD_SHOP'
ON CONFLICT (employee_code) DO UPDATE SET department_id = EXCLUDED.department_id, designation = 'Head Cafe Chef';

-- 3. ASSIGN PERMISSIONS TO STAFF
-- Assign all sports permissions to SP001 and SP002
INSERT INTO staff_permissions (employee_id, permission_id)
SELECT e.id, p.id
FROM employees e, permissions p
WHERE e.employee_code IN ('SP001', 'SP002') AND p.department_code = 'SPORTS_SHOP'
ON CONFLICT DO NOTHING;

-- Assign all food permissions to FD001 and FD002
INSERT INTO staff_permissions (employee_id, permission_id)
SELECT e.id, p.id
FROM employees e, permissions p
WHERE e.employee_code IN ('FD001', 'FD002') AND p.department_code = 'FOOD_SHOP'
ON CONFLICT DO NOTHING;

-- 4. SEED SPORTS ACCESSORIES SHOP DATA
INSERT INTO sports_categories (name, code, icon, is_active) VALUES
('Rackets', 'RACKETS', 'FiCrosshair', TRUE),
('Tennis Balls', 'BALLS', 'FiCircle', TRUE),
('Footwear', 'FOOTWEAR', 'FiShoppingBag', TRUE),
('Apparel', 'APPAREL', 'FiLayers', TRUE),
('Bags & Grips', 'ACCESSORIES', 'FiPackage', TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO sports_products (name, category_id, brand, sku, barcode, description, purchase_price, selling_price, stock_quantity, reorder_level, is_active, image_url, rating) VALUES
('Wilson Pro Staff 97 v14', 1, 'Wilson', 'SP-RKT-001', '887768910011', 'Pro-level precision tennis racket engineered with Braid 45 construction for maximum control.', 14000.00, 18500.00, 14, 4, TRUE, 'https://images.unsplash.com/photo-1617083934555-ac7d4fed881a?w=500', 4.9),
('Babolat Pure Aero 2023', 1, 'Babolat', 'SP-RKT-002', '887768910028', 'Massive spin generation and raw power engineered for baseline aggression.', 15500.00, 19999.00, 8, 3, TRUE, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500', 4.8),
('Yonex Astrox 88D Pro', 1, 'Yonex', 'SP-RKT-003', '887768910035', 'Steep attack badminton racket designed for powerful rear-court smashes.', 11000.00, 14500.00, 12, 4, TRUE, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500', 4.7),
('Head Tour XT Tennis Balls (Can of 4)', 2, 'Head', 'SP-BAL-001', '887768910042', 'Encore technology felt tennis balls for responsive touch and durable bounce.', 380.00, 550.00, 48, 10, TRUE, 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=500', 4.6),
('Dunlop Fort All Court (Can of 3)', 2, 'Dunlop', 'SP-BAL-002', '887768910059', 'Classic tournament all-court pressurized tennis balls.', 290.00, 420.00, 3, 10, TRUE, 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500', 4.5),
('Nike Court Air Zoom Vapor Pro 2', 3, 'Nike', 'SP-SHO-001', '887768910066', 'Low-to-the-ground tennis shoes built for swift direction changes.', 6800.00, 9995.00, 9, 3, TRUE, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 4.8),
('Adidas Barricade Tennis Shoes', 3, 'Adidas', 'SP-SHO-002', '887768910073', 'Intuitive lacing system with Geofit Sensepods for locked-in heel hold.', 8200.00, 11999.00, 4, 3, TRUE, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', 4.7),
('ClubSphere DryFit Performance Tee', 4, 'ClubSphere', 'SP-APP-001', '887768910080', 'Official club breathable athletic jersey with sweat-wicking tech.', 750.00, 1299.00, 25, 5, TRUE, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 4.7),
('Tourna Grip Original XL (Pack of 3)', 5, 'Tourna', 'SP-GRP-001', '887768910097', 'The legendary dry feel overgrip for supreme sweat absorption.', 280.00, 450.00, 32, 8, TRUE, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500', 4.9),
('Wilson Super Tour 9-Pack Bag', 5, 'Wilson', 'SP-BAG-001', '887768910103', 'Thermoguard racket compartment protects gear against extreme temperatures.', 5500.00, 7800.00, 2, 3, TRUE, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 4.8)
ON CONFLICT (sku) DO NOTHING;

-- Seed product variants for shoes & jerseys
INSERT INTO sports_product_variants (product_id, size, color, sku, stock_quantity, additional_price)
SELECT p.id, 'UK 8', 'White/Emerald', 'SP-SHO-001-UK8', 4, 0.00 FROM sports_products p WHERE p.sku = 'SP-SHO-001'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO sports_product_variants (product_id, size, color, sku, stock_quantity, additional_price)
SELECT p.id, 'UK 9', 'White/Emerald', 'SP-SHO-001-UK9', 3, 0.00 FROM sports_products p WHERE p.sku = 'SP-SHO-001'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO sports_product_variants (product_id, size, color, sku, stock_quantity, additional_price)
SELECT p.id, 'UK 10', 'White/Emerald', 'SP-SHO-001-UK10', 2, 0.00 FROM sports_products p WHERE p.sku = 'SP-SHO-001'
ON CONFLICT (sku) DO NOTHING;

-- Seed inventory movements
INSERT INTO sports_inventory_movements (product_id, movement_type, quantity, stock_before, stock_after, reason, performed_by)
SELECT p.id, 'RESTOCK', 10, 4, 14, 'Monthly scheduled club shipment delivery', (SELECT id FROM users WHERE email = 'sports.staff@clubsphere.com')
FROM sports_products p WHERE p.sku = 'SP-RKT-001'
LIMIT 1;

-- Seed sample sports orders across status lifecycle
INSERT INTO sports_orders (order_number, customer_name, customer_email, customer_phone, membership_tier, membership_discount_percent, subtotal, discount_amount, tax_amount, total_amount, payment_method, payment_status, order_status, fulfilment_type, assigned_staff_id, notes) VALUES
('SP-ORD-1001', 'Riya Kumari', 'riyakumari13@gmail.com', '+91 98765 43210', 'GOLD', 15.00, 18500.00, 2775.00, 0.00, 15725.00, 'UPI', 'COMPLETED', 'PACKING', 'PICKUP', (SELECT id FROM employees WHERE employee_code = 'SP001'), 'Gold member discount 15% applied. Customer picking up at 5 PM.'),
('SP-ORD-1002', 'Aarav Sharma', 'aarav.sharma@example.com', '+91 98111 22334', 'SILVER', 10.00, 1100.00, 110.00, 0.00, 990.00, 'CARD', 'COMPLETED', 'NEW', 'PICKUP', (SELECT id FROM employees WHERE employee_code = 'SP001'), 'Two cans of Head Tour XT balls.'),
('SP-ORD-1003', 'Swathi Raman', 'swathi.raman@example.com', '+91 97222 33445', 'NON_MEMBER', 0.00, 9995.00, 0.00, 0.00, 9995.00, 'ONLINE', 'COMPLETED', 'READY_FOR_PICKUP', 'PICKUP', (SELECT id FROM employees WHERE employee_code = 'SP002'), 'Ready at pickup counter rack A-2.'),
('SP-ORD-1004', 'Karan Patel', 'karan.patel@example.com', '+91 96333 44556', 'JUNIOR', 5.00, 14500.00, 725.00, 0.00, 13775.00, 'UPI', 'COMPLETED', 'COMPLETED', 'COUNTER', (SELECT id FROM employees WHERE employee_code = 'SP001'), 'In-store counter collection completed.')
ON CONFLICT (order_number) DO NOTHING;

-- Order items
INSERT INTO sports_order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
SELECT o.id, p.id, p.name, p.selling_price, 1, p.selling_price
FROM sports_orders o, sports_products p
WHERE o.order_number = 'SP-ORD-1001' AND p.sku = 'SP-RKT-001'
ON CONFLICT DO NOTHING;

INSERT INTO sports_order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
SELECT o.id, p.id, p.name, p.selling_price, 2, p.selling_price * 2
FROM sports_orders o, sports_products p
WHERE o.order_number = 'SP-ORD-1002' AND p.sku = 'SP-BAL-001'
ON CONFLICT DO NOTHING;

-- Seed sports return
INSERT INTO sports_returns (return_number, order_id, customer_name, reason, condition, status, refund_amount, reviewed_by, admin_notes)
SELECT 'SP-RET-101', o.id, 'Vikram Mehta', 'Size mismatch on shoes, requesting exchange for UK 9', 'SELLABLE', 'UNDER_REVIEW', 9995.00, (SELECT id FROM users WHERE email = 'sports.staff@clubsphere.com'), 'Shoes unworn with original tags attached.'
FROM sports_orders o WHERE o.order_number = 'SP-ORD-1003'
ON CONFLICT (return_number) DO NOTHING;

-- 5. SEED FOOD SHOP / CAFE DATA
INSERT INTO food_categories (name, code, icon, display_order, is_active) VALUES
('Breakfast & Bowls', 'BREAKFAST', 'FiSun', 1, TRUE),
('Artisan Sandwiches & Wraps', 'SANDWICHES', 'FiLayers', 2, TRUE),
('Healthy & Protein Bowls', 'HEALTHY', 'FiHeart', 3, TRUE),
('Fresh Juices & Smoothies', 'BEVERAGES', 'FiCoffee', 4, TRUE),
('Snacks & Desserts', 'DESSERTS', 'FiSmile', 5, TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO food_menu_items (name, category_id, description, price, is_vegetarian, is_available, prep_time_minutes, image_url, calories, allergens) VALUES
('Avocado Sourdough Toast', 1, 'Mashed Hass avocado on toasted sourdough with microgreens and pumpkin seeds.', 280.00, TRUE, TRUE, 10, 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=500', 380, 'Gluten'),
('Club Classic Omelette', 1, 'Three-egg fluffy omelette with spinach, mushrooms, aged cheddar and toast.', 240.00, FALSE, TRUE, 12, 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500', 420, 'Eggs, Dairy'),
('Grilled Pesto Chicken Sandwich', 2, 'Herb marinated chicken breast, basil pesto, sundried tomatoes in multigrain panini.', 340.00, FALSE, TRUE, 15, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500', 520, 'Gluten, Dairy'),
('Paneer Tikka Herb Wrap', 2, 'Spiced chargrilled cottage cheese, mint chutney, crispy peppers in wholewheat wrap.', 260.00, TRUE, TRUE, 12, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500', 450, 'Dairy, Gluten'),
('Post-Workout Whey Smoothie', 4, '30g Gold Standard whey isolate, banana, oats, almond butter and chilled milk.', 220.00, TRUE, TRUE, 5, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500', 310, 'Dairy, Nuts'),
('Cold Pressed Green Detox Juice', 4, 'Cucumber, green apple, spinach, celery, ginger and fresh lemon.', 180.00, TRUE, TRUE, 6, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500', 140, 'None'),
('Espresso Tonic / Americano', 4, 'Double shot single-origin Arabica espresso with chilled tonic or hot water.', 150.00, TRUE, TRUE, 5, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500', 25, 'None'),
('Quinoa Mediterranean Salad', 3, 'Organic quinoa, cherry tomatoes, kalamata olives, cucumber, feta cheese and lemon vinaigrette.', 310.00, TRUE, TRUE, 10, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500', 360, 'Dairy'),
('Greek Yogurt Protein Bowl', 3, 'Hung curd with seasonal berries, chia seeds, roasted almonds and forest honey.', 240.00, TRUE, TRUE, 8, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500', 290, 'Dairy, Nuts'),
('Blueberry Protein Cheesecake', 5, 'High protein baked cheesecake with wild blueberry coulis.', 290.00, TRUE, FALSE, 0, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500', 280, 'Dairy, Eggs')
ON CONFLICT DO NOTHING;

-- Seed Tables
INSERT INTO food_tables (table_number, capacity, section, status) VALUES
('T-01', 2, 'MAIN_CAFE', 'AVAILABLE'),
('T-02', 4, 'MAIN_CAFE', 'OCCUPIED'),
('T-03', 4, 'MAIN_CAFE', 'AVAILABLE'),
('T-04', 6, 'PATIO', 'OCCUPIED'),
('T-05', 4, 'PATIO', 'RESERVED'),
('T-06', 2, 'LOUNGE', 'AVAILABLE'),
('T-07', 4, 'LOUNGE', 'CLEANING'),
('T-08', 8, 'BALCONY', 'AVAILABLE')
ON CONFLICT (table_number) DO NOTHING;

-- Seed Ingredients
INSERT INTO food_ingredients (name, unit, current_stock, reorder_threshold, cost_per_unit, expiry_date, is_available) VALUES
('Multigrain Sourdough Bread', 'PIECES', 45.00, 15.00, 12.00, CURRENT_DATE + INTERVAL '4 days', TRUE),
('Chicken Breast (Fresh)', 'KG', 18.50, 5.00, 240.00, CURRENT_DATE + INTERVAL '2 days', TRUE),
('Farm Fresh Eggs', 'PIECES', 120.00, 30.00, 7.50, CURRENT_DATE + INTERVAL '10 days', TRUE),
('Whey Protein Isolate', 'KG', 8.00, 2.00, 2200.00, CURRENT_DATE + INTERVAL '180 days', TRUE),
('Almond Milk (Unsweetened)', 'LITERS', 14.00, 4.00, 160.00, CURRENT_DATE + INTERVAL '30 days', TRUE),
('Fresh Hass Avocados', 'PIECES', 3.00, 10.00, 65.00, CURRENT_DATE + INTERVAL '3 days', TRUE), -- LOW STOCK ALERT!
('Arabica Coffee Beans', 'KG', 12.00, 3.00, 850.00, CURRENT_DATE + INTERVAL '90 days', TRUE),
('Greek Yogurt', 'KG', 6.50, 2.00, 180.00, CURRENT_DATE + INTERVAL '7 days', TRUE)
ON CONFLICT DO NOTHING;

-- Seed Food Orders
INSERT INTO food_orders (order_number, customer_name, customer_email, customer_phone, order_type, table_number, membership_tier, membership_discount_percent, subtotal, discount_amount, tax_amount, total_amount, payment_method, payment_status, order_status, special_instructions, assigned_staff_id, accepted_at, preparing_at) VALUES
('FD-ORD-1025', 'Riya Kumari', 'riyakumari13@gmail.com', '+91 98765 43210', 'TABLE', 'T-02', 'GOLD', 10.00, 560.00, 56.00, 0.00, 504.00, 'UPI', 'COMPLETED', 'PREPARING', 'No extra sauce. Extra ice for smoothie.', (SELECT id FROM employees WHERE employee_code = 'FD001'), CURRENT_TIMESTAMP - INTERVAL '15 minutes', CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
('FD-ORD-1026', 'Devendra Singh', 'dev.singh@example.com', '+91 98333 11223', 'TABLE', 'T-04', 'SILVER', 5.00, 420.00, 21.00, 0.00, 399.00, 'CARD', 'COMPLETED', 'PENDING', 'Gluten-free preference if possible.', NULL, NULL, NULL),
('FD-ORD-1027', 'Pooja Reddy', 'pooja.r@example.com', '+91 97444 55667', 'COUNTER', NULL, 'NON_MEMBER', 0.00, 220.00, 0.00, 0.00, 220.00, 'CASH', 'COMPLETED', 'READY', 'Takeaway bag required.', (SELECT id FROM employees WHERE employee_code = 'FD002'), CURRENT_TIMESTAMP - INTERVAL '20 minutes', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
('FD-ORD-1028', 'Kavita Chawla', 'kavita.c@example.com', '+91 96555 66778', 'COUNTER', NULL, 'GOLD', 10.00, 400.00, 40.00, 0.00, 360.00, 'UPI', 'COMPLETED', 'COMPLETED', 'Served at counter.', (SELECT id FROM employees WHERE employee_code = 'FD001'), CURRENT_TIMESTAMP - INTERVAL '45 minutes', CURRENT_TIMESTAMP - INTERVAL '40 minutes')
ON CONFLICT (order_number) DO NOTHING;

-- Food Order Items
INSERT INTO food_order_items (order_id, menu_item_id, item_name, unit_price, quantity, special_note, total_price)
SELECT o.id, m.id, m.name, m.price, 1, 'Extra cold', m.price
FROM food_orders o, food_menu_items m
WHERE o.order_number = 'FD-ORD-1025' AND m.name = 'Post-Workout Whey Smoothie'
ON CONFLICT DO NOTHING;

INSERT INTO food_order_items (order_id, menu_item_id, item_name, unit_price, quantity, special_note, total_price)
SELECT o.id, m.id, m.name, m.price, 1, 'Well toasted', m.price
FROM food_orders o, food_menu_items m
WHERE o.order_number = 'FD-ORD-1025' AND m.name = 'Avocado Sourdough Toast'
ON CONFLICT DO NOTHING;

-- Food Bill
INSERT INTO food_bills (bill_number, order_id, table_number, subtotal, discount_amount, tax_amount, total_amount, is_split, split_parts, paid_amount, balance_amount, status, created_by)
SELECT 'BILL-2026-1025', o.id, 'T-02', 560.00, 56.00, 0.00, 504.00, FALSE, 1, 504.00, 0.00, 'PAID', (SELECT id FROM employees WHERE employee_code = 'FD001')
FROM food_orders o WHERE o.order_number = 'FD-ORD-1025'
ON CONFLICT (bill_number) DO NOTHING;

-- 6. SEED SUPPORT TICKETS
INSERT INTO support_tickets (ticket_number, user_id, employee_id, department_code, category, subject, description, priority, status)
SELECT 'TICK-SP-001', u.id, e.id, 'SPORTS_SHOP', 'INVENTORY', 'Barcode scanner not recognizing Dunlop Fort cans', 'The handheld laser scanner is failing on the curved surface of Dunlop Fort cans. Need calibration or replacement.', 'MEDIUM', 'IN_PROGRESS'
FROM users u, employees e
WHERE u.email = 'sports.staff@clubsphere.com' AND e.employee_code = 'SP001'
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO support_tickets (ticket_number, user_id, employee_id, department_code, category, subject, description, priority, status)
SELECT 'TICK-FD-001', u.id, e.id, 'FOOD_SHOP', 'EQUIPMENT', 'Blender jar #2 seal leaking in smoothie station', 'The Vitamix blender jar seal ring is worn out and leaking liquid into the motor base during high speed pulses.', 'HIGH', 'OPEN'
FROM users u, employees e
WHERE u.email = 'cafe.staff@clubsphere.com' AND e.employee_code = 'FD001'
ON CONFLICT (ticket_number) DO NOTHING;
