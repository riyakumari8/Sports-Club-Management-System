# 🎾 ClubSphere – Sports Club Management System

[![Java](https://img.shields.io/badge/Java-24-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.6-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![Maven](https://img.shields.io/badge/Maven-3.9.6-red.svg)](https://maven.apache.org/)
[![License](https://img.shields.io/badge/License-Academic%20Project-lightgrey.svg)]()

> **Centralized Sports Club Management Platform**  
> **Student Developer:** Swathi Challakonda (B.Tech Computer Science & Engineering)  
> **Assigned Modules:** 
> 1. Court & Facility Management  
> 2. Court Booking Management (Staggered Scheduling Engine, Overlap Prevention & QR Check-In)  
> 3. Public Website & Enquiry CRM  

---

## 📌 1. Project Overview

**ClubSphere** connects sporting operations across membership, court reservation, pro shop, cafeteria, and finance into an integrated enterprise platform.

This repository branch contains the complete frontend, backend, database schema, and test suite for the **Court & Facility Management**, **Court Booking Engine**, and **Public Website** developed independently by **Swathi Challakonda**.

---

## 🏗️ 2. System Architecture

```
                       ┌─────────────────────────────────────────┐
                       │           React.js Frontend             │
                       │     (Port 3000 / SPA / Lucide Icons)     │
                       └────────────────────┬────────────────────┘
                                            │ HTTP / JSON REST
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │          Spring Boot Backend            │
                       │        (Port 8080 / Java 24)            │
                       │  - CourtService   - BookingService      │
                       │  - SocialPlaySvc  - EnquiryCRMService   │
                       └────────────────────┬────────────────────┘
                                            │ JPA / Hibernate ORM
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │           PostgreSQL Database           │
                       │          (Port 5433 / btree_gist)       │
                       │  - GiST Range Exclusion Constraint      │
                       │  - Pessimistic Concurrency Locking      │
                       └─────────────────────────────────────────┘
```

---

## 🌟 3. Features Implemented

### Module 1: Court & Facility Management
- **Court Administration:** Full CRUD capability to add, edit, search, filter, and deactivate courts. Pre-configured for Championship Tennis courts (Plexipave Hard Court, Red Clay, Indoor Grass) and Cricket facilities (Natural Turf Oval, Automated Net Lanes).
- **Dynamic Pricing:** Configurable base hourly rate, guest hourly rate, and tier-based discounts. No prices are hardcoded.
- **Operating Hours:** Set opening and closing hours per court (e.g., 06:00 to 22:00) with validation preventing bookings outside working schedules.
- **Status Lifecycle:** `AVAILABLE`, `BOOKED`, `UNDER_MAINTENANCE`, `TEMPORARILY_CLOSED`.
- **Maintenance Blackouts:** Schedule maintenance intervals that automatically shield and blackout all intersecting booking slots.

### Module 2: Court Booking Management
- **60-Minute Duration:** Every regular booking session is strictly 1 hour long.
- **30-Minute Staggered Slots:** Slots open every 30 minutes (08:00–09:00, 08:30–09:30, 09:00–10:00), maximizing court utilization.
- **Two-Tier Overlap Prevention:**
  1. *Application Layer:* Spring Data JPA Pessimistic Write Locking (`PESSIMISTIC_WRITE`) and boundary condition checks (`startTime < reqEnd && endTime > reqStart`).
  2. *Database Storage Layer:* PostgreSQL `btree_gist` exclusion constraint:
     ```sql
     ALTER TABLE court_bookings 
     ADD CONSTRAINT no_overlapping_court_bookings 
     EXCLUDE USING gist (
         court_id WITH =,
         tstzrange(slot_start_utc, slot_end_utc) WITH &&
     ) WHERE (booking_status IN ('CONFIRMED', 'PENDING'));
     ```
- **Strict Daily Limit:** Backend validation enforcing a maximum of **two regular sessions per member per day**.
- **Digital QR Code Check-In:** Generates unique Base64-encoded PNG QR codes via Google ZXing. Front-desk staff scan or enter codes at `/staff/check-in`, updating status to `COMPLETED` and blocking duplicate check-ins.
- **Friday Social Play:** Dedicated multi-participant shared mixer model (`social_play_sessions` & `social_play_participants`) allowing up to 16 players to join the same session without triggering single-court conflict rules.
- **Rescheduling & Cancellations:** Instant slot rescheduling with conflict validation, audit-backed cancellations, and automated waitlist tracking.

### Module 3: Public Website & Enquiry CRM
- **Modern Landing Page (`Home.jsx`):**
  - Left side: Hero branding, value proposition, and quick action buttons.
  - Right side: Cleaned high-resolution tennis court equipment photograph (`clubsphere-tennis-hero.webp`) with rounded corners and subtle drop shadows.
  - Interactive touches: Subtle tennis court SVG doodles and floating glassmorphism animated badges (`🎾 Championship Courts`, `⚡ 30-Min Staggered Slots`).
- **Public Informational Pages:** About Us, Sports Facilities, Membership Plans, Live Availability Calendar, Pro Shop Preview, Testimonials, FAQ, and Contact Us.
- **Enquiry CRM Pipeline:** Tracks leads (`NEW` → `CONTACTED` → `IN_PROGRESS` → `CONVERTED`) with staff follow-up history notes and a one-click **"Convert to Member"** button that issues a new Member ID and sets tier privileges.

---

## 🤝 4. Inter-Team Integration

| Peer Developer | Module | Integration Interface |
| :--- | :--- | :--- |
| **Riya** | Membership Management & Auth | `MembershipClientService`: Fetches membership tier (`GOLD`: 100% discount, `SILVER`: 25% discount, `JUNIOR`: 50% discount, `GUEST`: 0%). |
| **Balaji** | Sports Shop & Cafeteria | `PublicController /api/public/shop-preview`: Displays curated equipment catalog with member discounts and stock availability. |
| **Anish** | Finance & Accounting | `BookingService`: Synchronizes booking reference, gross fees, discounts, and payment status (`PAY-...`), generating refund records on cancellation. |

---

## 🚀 5. How to Run Locally

### Prerequisites
- Java JDK 21 or Java 24 installed
- Apache Maven 3.9+
- Node.js 18+ and npm
- PostgreSQL 16+ (running on port 5433 or configured in `application.properties`)

### Step 1: Database Setup
1. Create a database named `clubsphere` in PostgreSQL.
2. Execute the schema script located at:
   ```powershell
   psql -U postgres -p 5433 -d clubsphere -f schema.sql
   ```

### Step 2: Run the Backend (Spring Boot)
```powershell
cd backend
mvn clean package -DskipTests
java -jar target/clubsphere-backend-1.0.0.jar
```
*The Spring Boot server will start on [http://localhost:8080](http://localhost:8080).*

### Step 3: Run the Frontend (React.js)
```powershell
cd frontend
npm install
npm start
```
*The React application will open on [http://localhost:3000](http://localhost:3000).*

---

## 🧪 6. Automated Testing

The backend includes comprehensive integration tests verifying business rules, concurrency, and quota enforcement:

```powershell
cd backend
mvn test
```

### Test Coverage Highlights:
- `testSuccessfulBookingWithMemberDiscount`: Validates Silver tier 25% discount calculation and digital QR code hash generation.
- `testOverlapPrevention_RejectsConflictingSlot`: Confirms 409 Conflict rejection for overlapping slots on the same court.
- `testDailyBookingLimit_EnforcesMaxTwoSessions`: Verifies strict rejection of a third booking attempt per member on the same day.
- `testMaintenanceWindow_BlocksCourtBooking`: Verifies that maintenance blackout periods block bookings.

---

## 📡 7. API Reference Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/courts` | List active courts with search and filter parameters |
| `GET` | `/api/courts/{id}/availability?date=YYYY-MM-DD` | Returns 30-min staggered 60-min slots with live availability status |
| `POST` | `/api/courts` | Admin adds a new court facility |
| `POST` | `/api/courts/{id}/maintenance` | Schedule court maintenance blackout interval |
| `POST` | `/api/bookings` | Create court reservation (validates overlap, quota, pricing, and generates QR code) |
| `POST` | `/api/bookings/check-in` | Front-desk staff QR check-in (prevents duplicate check-ins) |
| `PUT` | `/api/bookings/{id}/reschedule` | Reschedule booking to a new time slot |
| `PATCH` | `/api/bookings/{id}/cancel` | Cancel booking and trigger refund workflow |
| `GET` | `/api/social-play` | List upcoming Friday Social Play group mixer sessions |
| `POST` | `/api/social-play/{id}/join` | Member joins Friday Social Play session |
| `POST` | `/api/enquiries` | Submit public contact/trial enquiry |
| `POST` | `/api/enquiries/{id}/convert` | Convert CRM lead into active club member |
