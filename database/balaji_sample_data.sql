-- =============================================================================
-- ClubSphere: Balaji's Modules — Sample / Seed Data
-- File: balaji_sample_data.sql
-- Covers: Sports Shop, Inventory, Cafe & Bar
-- =============================================================================

-- =========================================================
-- SECTION 1: PRODUCT CATEGORIES (9 categories)
-- =========================================================

INSERT INTO product_categories (name, description, is_active) VALUES
    ('Sports Rackets',       'Badminton, squash, and table-tennis rackets for all skill levels', true),
    ('Cricket Equipment',    'Bats, pads, gloves, helmets and all cricket accessories',          true),
    ('Tennis Balls',         'Pressurised and pressureless tennis balls for training and match', true),
    ('Cricket Balls',        'Leather and rubber cricket balls for all formats and surfaces',    true),
    ('Sports Shoes',         'High-performance footwear for court, field, and gym use',         true),
    ('Sports Apparel',       'Jerseys, shorts, track pants, and sports inner-wear',             true),
    ('Accessories',          'Bags, grips, strings, sweatbands and other sports accessories',   true),
    ('Fitness Equipment',    'Weights, resistance bands, skipping ropes and home-gym essentials', true),
    ('Other Sports Products','Miscellaneous sporting goods not covered by the above categories', true);


-- =========================================================
-- SECTION 2: PRODUCTS (18 products)
-- category_id references: 1=Rackets, 2=Cricket Equip, 3=Tennis Balls,
--   4=Cricket Balls, 5=Shoes, 6=Apparel, 7=Accessories, 8=Fitness, 9=Other
-- =========================================================

INSERT INTO products (category_id, name, description, image_url, original_price, discount_percent, is_active) VALUES
-- Rackets (cat 1)
    (1, 'Yonex Astrox 88D Badminton Racket',
        'High-flex graphite shaft, ideal for attacking players. 4U weight.',
        '/images/products/yonex-astrox-88d.jpg',      3800.00, 5.00, true),

    (1, 'Victor Thruster K 9900 Squash Racket',
        'Nano technology frame with aerodynamic cross-section for speed.',
        '/images/products/victor-thruster-k9900.jpg', 4200.00, 0.00, true),

-- Cricket Equipment (cat 2)
    (2, 'SS Ton English Willow Cricket Bat',
        'Grade 1 English Willow, full-ready edges, traditional blade shape.',
        '/images/products/ss-ton-bat.jpg',            2500.00, 10.00, true),

    (2, 'SG RSD Xtreme Cricket Batting Pads',
        'Lightweight cane strut construction with velcro straps.',
        '/images/products/sg-rsd-pads.jpg',           1800.00, 0.00, true),

    (2, 'Kookaburra Cricket Helmet',
        'ABS shell with steel grille, moisture-wicking foam lining.',
        '/images/products/kookaburra-helmet.jpg',     3200.00, 8.00, true),

    (2, 'Spartan MSD 7 Kashmir Willow Bat',
        'Kashmir willow junior/beginner bat with full-size blade.',
        '/images/products/spartan-msd7-bat.jpg',       950.00, 0.00, true),

-- Tennis Balls (cat 3)
    (3, 'Dunlop Fort All Court Tennis Balls (4-Pack)',
        'ITF-approved, natural rubber core, durable felt cover.',
        '/images/products/dunlop-fort-balls.jpg',      650.00, 0.00, true),

    (3, 'Wilson Championship Extra Duty Tennis Balls (3-Pack)',
        'Hard-court optimised, controlled-fiber felt for durability.',
        '/images/products/wilson-championship-balls.jpg', 480.00, 5.00, true),

-- Cricket Balls (cat 4)
    (4, 'Kookaburra Turf Cricket Ball (Red)',
        'Premium 4-piece alum-tanned leather, hand-stitched seam.',
        '/images/products/kookaburra-turf-red.jpg',    780.00, 0.00, true),

    (4, 'SG Club Cricket Ball (White)',
        'Machine-stitched, suitable for training and limited-overs play.',
        '/images/products/sg-club-white.jpg',          320.00, 0.00, true),

-- Sports Shoes (cat 5)
    (5, 'Yonex Power Cushion 65 Z3 Badminton Shoes',
        'Round Sole technology for 360° quick movement, non-marking sole.',
        '/images/products/yonex-pc65z3.jpg',          2200.00, 10.00, true),

    (5, 'Nivia Marathon Running Shoes',
        'EVA mid-sole with mesh upper for breathability and cushioning.',
        '/images/products/nivia-marathon.jpg',        1450.00, 15.00, true),

-- Sports Apparel (cat 6)
    (6, 'Nivia Dri-Fit Cricket Jersey (Full Sleeve)',
        'Moisture-wicking polyester, club-cut, available in multiple colours.',
        '/images/products/nivia-cricket-jersey.jpg',   750.00, 0.00, true),

    (6, 'Puma Sports Track Pants',
        'Lightweight with side pockets and elasticated drawstring waist.',
        '/images/products/puma-track-pants.jpg',       1200.00, 10.00, true),

-- Accessories (cat 7)
    (7, 'Yonex Badminton Kitbag (Large)',
        'Thermo-protected main compartment, holds 3 rackets.',
        '/images/products/yonex-kitbag-large.jpg',    2800.00, 5.00, true),

    (7, 'Tourna Grip Original Overgrip (30-Pack)',
        'Dry-feel, ultra-absorbent, blue overgrip for all racket sports.',
        '/images/products/tourna-grip-30pk.jpg',       680.00, 0.00, true),

-- Fitness Equipment (cat 8)
    (8, 'Cockatoo Adjustable Dumbbell Set (5-25kg)',
        'Cast-iron plates with chrome dumbbell bar and spring collars.',
        '/images/products/cockatoo-dumbbell-set.jpg', 3500.00, 12.00, true),

    (8, 'Boldfit Resistance Band Set (5 bands)',
        'Latex loop bands from 5 lb to 150 lb resistance levels.',
        '/images/products/boldfit-resistance-bands.jpg', 850.00, 0.00, true);


-- =========================================================
-- SECTION 3: INVENTORY
-- Stock status is auto-managed by trigger after first UPDATE,
-- but we set an initial meaningful state here.
-- Most: IN_STOCK | 2: LOW_STOCK | 1: OUT_OF_STOCK
-- =========================================================

INSERT INTO inventory (product_id, quantity_in_stock, minimum_stock_threshold, stock_status) VALUES
-- Rackets
    (1,  45, 5,  'IN_STOCK'),       -- Yonex Astrox 88D
    (2,  30, 5,  'IN_STOCK'),       -- Victor Thruster K9900
-- Cricket Equipment
    (3,  60, 10, 'IN_STOCK'),       -- SS Ton Bat
    (4,  25, 5,  'IN_STOCK'),       -- SG RSD Pads
    (5,  18, 5,  'IN_STOCK'),       -- Kookaburra Helmet
    (6,  3,  5,  'LOW_STOCK'),      -- Spartan MSD7 Bat  ← LOW (qty ≤ threshold)
-- Tennis Balls
    (7,  80, 10, 'IN_STOCK'),       -- Dunlop Fort 4-pack
    (8,  55, 10, 'IN_STOCK'),       -- Wilson Championship 3-pack
-- Cricket Balls
    (9,  40, 8,  'IN_STOCK'),       -- Kookaburra Turf Red
    (10, 0,  5,  'OUT_OF_STOCK'),   -- SG Club White      ← OUT OF STOCK (qty=0)
-- Sports Shoes
    (11, 22, 5,  'IN_STOCK'),       -- Yonex PC65Z3
    (12, 4,  5,  'LOW_STOCK'),      -- Nivia Marathon     ← LOW (qty ≤ threshold)
-- Apparel
    (13, 90, 10, 'IN_STOCK'),       -- Nivia Cricket Jersey
    (14, 35, 5,  'IN_STOCK'),       -- Puma Track Pants
-- Accessories
    (15, 20, 5,  'IN_STOCK'),       -- Yonex Kitbag
    (16, 65, 10, 'IN_STOCK'),       -- Tourna Grip 30-pack
-- Fitness
    (17, 15, 5,  'IN_STOCK'),       -- Cockatoo Dumbbells
    (18, 50, 8,  'IN_STOCK');       -- Boldfit Resistance Bands


-- =========================================================
-- SECTION 4: MENU CATEGORIES (6 categories)
-- =========================================================

INSERT INTO menu_categories (name, description, is_active) VALUES
    ('Snacks',          'Light bites and finger food — perfect between games',           true),
    ('Beverages',       'Hot and cold drinks, fresh juices, and energy drinks',         true),
    ('Food',            'Main course meals and hearty options for a full refuel',       true),
    ('Desserts',        'Sweet treats to end your meal on a high note',                true),
    ('Combo Meals',     'Value combos pairing a main dish with a side and a drink',    true),
    ('Other Menu Items','Seasonal specials and items not classified above',             true);


-- =========================================================
-- SECTION 5: MENU ITEMS (14 items)
-- cat: 1=Snacks, 2=Beverages, 3=Food, 4=Desserts, 5=Combos, 6=Other
-- =========================================================

INSERT INTO menu_items (category_id, name, description, image_url, price, discount_percent, is_available) VALUES
-- Snacks (cat 1)
    (1, 'Veg Samosa (2 pcs)',
        'Crispy golden samosas stuffed with spiced potato and peas. Served with mint chutney.',
        '/images/menu/veg-samosa.jpg',       60.00,  0.00, true),

    (1, 'Paneer Tikka Skewers',
        'Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions.',
        '/images/menu/paneer-tikka.jpg',    180.00,  0.00, true),

    (1, 'Cheese Garlic Bread',
        'Toasted baguette with garlic butter and melted mozzarella.',
        '/images/menu/cheese-garlic-bread.jpg', 120.00, 0.00, true),

-- Beverages (cat 2)
    (2, 'Fresh Lime Soda (Sweet / Salt)',
        'Chilled lime juice topped with soda — the perfect thirst quencher after a game.',
        '/images/menu/lime-soda.jpg',        50.00,  0.00, true),

    (2, 'Mango Lassi',
        'Thick and creamy yoghurt blended with Alphonso mangoes. Chilled and refreshing.',
        '/images/menu/mango-lassi.jpg',      90.00,  0.00, true),

    (2, 'Masala Chai',
        'Freshly brewed tea with ginger, cardamom, cinnamon and milk.',
        '/images/menu/masala-chai.jpg',      40.00,  0.00, true),

    (2, 'Cold Coffee (Frappe)',
        'Blended cold coffee with milk and ice cream, topped with chocolate drizzle.',
        '/images/menu/cold-coffee.jpg',     110.00,  5.00, true),

-- Food (cat 3)
    (3, 'Grilled Chicken Sandwich',
        'Soft multigrain bun with grilled chicken, lettuce, tomato and chipotle mayo.',
        '/images/menu/grilled-chicken-sandwich.jpg', 220.00, 0.00, true),

    (3, 'Dal Makhani with Butter Naan',
        'Slow-cooked black lentils in rich tomato gravy, served with 2 butter naans.',
        '/images/menu/dal-makhani.jpg',     250.00, 10.00, true),

    (3, 'Veg Fried Rice',
        'Wok-tossed basmati rice with seasonal vegetables, soya sauce and sesame oil.',
        '/images/menu/veg-fried-rice.jpg',  160.00,  0.00, true),

-- Desserts (cat 4)
    (4, 'Gulab Jamun (2 pcs)',
        'Soft khoya dumplings soaked in rose-flavoured sugar syrup. Served warm.',
        '/images/menu/gulab-jamun.jpg',      80.00,  0.00, true),

    (4, 'Chocolate Brownie with Ice Cream',
        'Warm fudge brownie paired with a scoop of vanilla ice cream.',
        '/images/menu/brownie-icecream.jpg', 150.00,  0.00, true),

-- Combo Meals (cat 5)
    (5, 'Player Power Combo',
        'Grilled Chicken Sandwich + Veg Fried Rice + Fresh Lime Soda. Best value post-game meal.',
        '/images/menu/player-power-combo.jpg', 380.00, 10.00, true),

    (5, 'Veg Delight Combo',
        'Paneer Tikka Skewers + Dal Makhani with Butter Naan + Mango Lassi.',
        '/images/menu/veg-delight-combo.jpg',  450.00,  8.00, true);


-- =========================================================
-- SECTION 6: CAFETERIA TABLES (8 tables)
-- capacity: 2, 4, or 6 | locations: Indoor, Outdoor, Poolside
-- =========================================================

INSERT INTO cafeteria_tables (table_number, capacity, status, location) VALUES
    (1, 4, 'AVAILABLE', 'Indoor'),
    (2, 4, 'AVAILABLE', 'Indoor'),
    (3, 6, 'AVAILABLE', 'Indoor'),
    (4, 2, 'AVAILABLE', 'Outdoor'),
    (5, 4, 'AVAILABLE', 'Outdoor'),
    (6, 6, 'AVAILABLE', 'Outdoor'),
    (7, 2, 'AVAILABLE', 'Poolside'),
    (8, 6, 'AVAILABLE', 'Poolside');


-- =============================================================================
-- END OF SAMPLE DATA
-- =============================================================================
