-- ClubSphere Schema for Swathi's Modules
-- 1. Court & Facility Management
-- 2. Court Booking Management
-- 3. Public Website & Enquiry Management

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. COURTS TABLE
DROP TABLE IF EXISTS booking_waitlist CASCADE;
DROP TABLE IF EXISTS booking_checkins CASCADE;
DROP TABLE IF EXISTS court_bookings CASCADE;
DROP TABLE IF EXISTS court_maintenance CASCADE;
DROP TABLE IF EXISTS court_schedules CASCADE;
DROP TABLE IF EXISTS social_play_participants CASCADE;
DROP TABLE IF EXISTS social_play_sessions CASCADE;
DROP TABLE IF EXISTS enquiry_followups CASCADE;
DROP TABLE IF EXISTS trial_bookings CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS courts CASCADE;

CREATE TABLE courts (
    court_id BIGSERIAL PRIMARY KEY,
    court_name VARCHAR(100) NOT NULL,
    sport_type VARCHAR(50) NOT NULL, -- 'TENNIS', 'CRICKET', 'PADEL', 'BADMINTON'
    court_description TEXT,
    location VARCHAR(100),
    surface_type VARCHAR(50) DEFAULT 'Synthetic / Turf',
    capacity INT DEFAULT 4,
    opening_time TIME NOT NULL DEFAULT '06:00:00',
    closing_time TIME NOT NULL DEFAULT '22:00:00',
    standard_hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 500.00,
    guest_hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 750.00,
    court_status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'BOOKED', 'UNDER_MAINTENANCE', 'TEMPORARILY_CLOSED'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. COURT MAINTENANCE TABLE
CREATE TABLE court_maintenance (
    maintenance_id BIGSERIAL PRIMARY KEY,
    court_id BIGINT NOT NULL REFERENCES courts(court_id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_by VARCHAR(100) DEFAULT 'Club Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURT BOOKINGS TABLE
CREATE TABLE court_bookings (
    booking_id BIGSERIAL PRIMARY KEY,
    booking_reference VARCHAR(30) UNIQUE NOT NULL,
    court_id BIGINT NOT NULL REFERENCES courts(court_id) ON DELETE RESTRICT,
    member_id BIGINT, -- NULL for guest bookings
    guest_name VARCHAR(100),
    guest_email VARCHAR(100),
    guest_phone VARCHAR(20),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_start_utc TIMESTAMP WITH TIME ZONE NOT NULL,
    slot_end_utc TIMESTAMP WITH TIME ZONE NOT NULL,
    base_amount NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    final_amount NUMERIC(10,2) NOT NULL,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED', -- 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PAID', -- 'PENDING', 'PAID', 'REFUNDED'
    payment_reference VARCHAR(100),
    qr_code_hash VARCHAR(255),
    checked_in_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GIST EXCLUSION CONSTRAINT to mathematically prevent overlapping bookings in PostgreSQL
ALTER TABLE court_bookings 
ADD CONSTRAINT no_overlapping_court_bookings 
EXCLUDE USING gist (
    court_id WITH =,
    tstzrange(slot_start_utc, slot_end_utc) WITH &&
) WHERE (booking_status IN ('CONFIRMED', 'PENDING'));

-- Indexes for performance
CREATE INDEX idx_bookings_court_date ON court_bookings (court_id, booking_date);
CREATE INDEX idx_bookings_member ON court_bookings (member_id);
CREATE INDEX idx_bookings_status ON court_bookings (booking_status);
CREATE INDEX idx_bookings_reference ON court_bookings (booking_reference);

-- 4. FRIDAY SOCIAL PLAY SESSIONS TABLE
CREATE TABLE social_play_sessions (
    session_id BIGSERIAL PRIMARY KEY,
    court_id BIGINT NOT NULL REFERENCES courts(court_id) ON DELETE RESTRICT,
    title VARCHAR(100) NOT NULL DEFAULT 'Friday Social Play',
    session_date DATE NOT NULL,
    start_time TIME NOT NULL DEFAULT '18:00:00',
    end_time TIME NOT NULL DEFAULT '21:00:00',
    max_participants INT NOT NULL DEFAULT 16,
    current_participants INT NOT NULL DEFAULT 0,
    entry_fee NUMERIC(10,2) NOT NULL DEFAULT 150.00,
    session_status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'FULL', 'COMPLETED', 'CANCELLED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SOCIAL PLAY PARTICIPANTS TABLE
CREATE TABLE social_play_participants (
    participant_id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES social_play_sessions(session_id) ON DELETE CASCADE,
    member_id BIGINT,
    participant_name VARCHAR(100) NOT NULL,
    participant_email VARCHAR(100),
    payment_status VARCHAR(30) DEFAULT 'PAID',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_session_participant UNIQUE (session_id, participant_name)
);

-- 6. BOOKING WAITLIST TABLE
CREATE TABLE booking_waitlist (
    waitlist_id BIGSERIAL PRIMARY KEY,
    court_id BIGINT NOT NULL REFERENCES courts(court_id) ON DELETE CASCADE,
    desired_date DATE NOT NULL,
    desired_start_time TIME NOT NULL,
    member_id BIGINT NOT NULL,
    member_name VARCHAR(100) NOT NULL,
    member_phone VARCHAR(20),
    queue_position INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'WAITING', -- 'WAITING', 'NOTIFIED', 'CLAIMED', 'EXPIRED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ENQUIRIES TABLE
CREATE TABLE enquiries (
    enquiry_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    interested_sport VARCHAR(50),
    interested_plan VARCHAR(50), -- 'GOLD', 'SILVER', 'JUNIOR'
    enquiry_message TEXT,
    preferred_contact_method VARCHAR(30) DEFAULT 'PHONE', -- 'PHONE', 'EMAIL', 'WHATSAPP'
    status VARCHAR(30) NOT NULL DEFAULT 'NEW', -- 'NEW', 'CONTACTED', 'FOLLOW_UP_REQUIRED', 'CONVERTED', 'CLOSED'
    assigned_staff_id BIGINT,
    assigned_staff_name VARCHAR(100),
    converted_member_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ENQUIRY FOLLOW-UPS TABLE
CREATE TABLE enquiry_followups (
    followup_id BIGSERIAL PRIMARY KEY,
    enquiry_id BIGINT NOT NULL REFERENCES enquiries(enquiry_id) ON DELETE CASCADE,
    notes TEXT NOT NULL,
    contact_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_followup_date DATE,
    created_by_staff VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TRIAL BOOKINGS TABLE
CREATE TABLE trial_bookings (
    trial_id BIGSERIAL PRIMARY KEY,
    court_id BIGINT REFERENCES courts(court_id),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    preferred_sport VARCHAR(50) NOT NULL,
    trial_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'
    staff_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED INITIAL REALISTIC COURTS & DATA
INSERT INTO courts (court_name, sport_type, court_description, location, surface_type, capacity, opening_time, closing_time, standard_hourly_rate, guest_hourly_rate, court_status, image_url) VALUES
('Centre Court 1', 'TENNIS', 'Championship-grade acrylic hard court with professional floodlighting and spectator seating.', 'Outdoor Pavilion A', 'Hard Court (Plexipave)', 4, '06:00:00', '22:00:00', 600.00, 900.00, 'AVAILABLE', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800'),
('Clay Court 2', 'TENNIS', 'Traditional European red clay court maintained daily for optimal slide and bounce.', 'Outdoor Pavilion B', 'Red Clay', 4, '06:00:00', '21:00:00', 700.00, 1000.00, 'AVAILABLE', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'),
('Indoor Grass Court 3', 'TENNIS', 'All-weather climate-controlled indoor synthetic grass court.', 'Indoor Arena 1', 'Synthetic Grass', 4, '07:00:00', '23:00:00', 800.00, 1200.00, 'AVAILABLE', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'),
('Main Cricket Pitch', 'CRICKET', 'Full-size natural turf cricket oval with sight screens, boundary ropes, and scoreboard.', 'Main Oval', 'Natural Turf', 22, '06:00:00', '20:00:00', 2500.00, 3500.00, 'AVAILABLE', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'),
('Indoor Cricket Nets (Lane A)', 'CRICKET', 'High-speed automated bowling machine net lane with video stroke analysis.', 'Indoor Cricket Center', 'AstroTurf', 6, '06:00:00', '22:00:00', 500.00, 750.00, 'AVAILABLE', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'),
('Indoor Cricket Nets (Lane B)', 'CRICKET', 'Standard practice net with run-up area for pacers and spinners.', 'Indoor Cricket Center', 'AstroTurf', 6, '06:00:00', '22:00:00', 450.00, 700.00, 'AVAILABLE', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800');

-- SAMPLE ENQUIRIES
INSERT INTO enquiries (full_name, email, phone, interested_sport, interested_plan, enquiry_message, preferred_contact_method, status) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', '+91 98765 43210', 'TENNIS', 'GOLD', 'Interested in weekend coaching and Gold membership court access for my family.', 'PHONE', 'NEW'),
('Priya Verma', 'priya.v@example.com', '+91 98123 45678', 'CRICKET', 'SILVER', 'Looking for regular evening practice nets availability on weekdays.', 'WHATSAPP', 'CONTACTED'),
('Arjun Mehta', 'arjun.mehta@example.com', '+91 99887 76655', 'TENNIS', 'JUNIOR', 'Enquiring about junior summer camp and training courts for my 14-year-old son.', 'EMAIL', 'FOLLOW_UP_REQUIRED');
