# ClubSphere – Sports Club Management System
> **College Project | Full Stack Web Application**  
> An integrated Sports Club Management System developed to manage authentication, memberships, court bookings, sports facilities, staff operations, public enquiry CRM, and business analytics.

---

## 1. Project Overview & Architecture

ClubSphere is a centralized sports club management platform developed for sports complexes, fitness clubs, and country clubs. It features a modern decoupled architecture:
- **Backend:** Java 21 LTS, Spring Boot 3.3.5, Spring Data JPA, Hibernate, Spring Security 6 (Stateless JWT + BCrypt), ZXing QR Code Generation, Swagger OpenAPI 3.
- **Frontend:** React 18, React Router v6, Axios, Lucide React icons, and a custom Emerald Green (`#0F5132`) & Crisp White ClubSphere design system.
- **Database:** PostgreSQL with 3NF normalized tables, relational foreign keys, unique constraints, and automated indexing.

---

## 2. Integrated Modules Breakdown

### Module 1: Authentication & User Management (Riya)
- Member registration with validation checks (email, unique phone, age/DOB, address, gender).
- Stateless JWT-based authentication with BCrypt encryption.
- Role-based routing: `ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_MEMBER`.
- User directory search, status updates (`ACTIVE`, `INACTIVE`, `SUSPENDED`), profile management, password updates.

### Module 2: Membership Management (Riya)
- Configurable membership tiers: **Gold**, **Silver**, and **Junior** (under 18 age validation).
- Automated membership code generator (e.g. `CS-MEM-2026-00101`) and validity period computation.
- Automated expiry detection and membership renewals.
- Cryptographic digital QR Membership Pass with high-resolution card view and PNG download.

### Module 3: Staff Management (Riya)
- Complete employee directory with codes (e.g. `CS-EMP-001`), designations, departments, and payroll.
- Daily attendance punch-in/punch-out logging and personal logs.
- Work shift allocation and standard shift roster.
- Leave application and administrative review workflow.
- Monthly salary records and compensation ledger.

### Module 4: Court Management & Booking Engine (Swathi)
- Real-time court availability, slot scheduling, and online court reservation.
- Front desk check-in, trial bookings, and Friday social play session signups.
- Enquiry CRM for visitor leads and tour follow-ups.
- Public club website with facilities tour, testimonials gallery, and contact desk.

### Module 5: Inter-Module Integration APIs
The system exposes dedicated inter-module REST micro-endpoints:
1. **Court Booking Integration (`GET /api/integration/members/verify/{token}`):** Checks member active tier, booking discount, and priority reservation window.
2. **Shop & Cafe Integration (`GET /api/integration/members/discount-eligibility/{memberId}`):** Returns active member discount rates.
3. **Finance & Executive Summary:** Exposes ledger transactions, salary expenses, and club-wide KPI analytics.

---

## 3. Project Directory Structure

```
ClubSphere/
├── docs/                                  # Database schemas, Postman collection & team integration guide
│   ├── database/                          # PostgreSQL 3NF schema & seed data
│   ├── postman/                           # Complete Postman API testing collection
│   └── integration/                       # Inter-module API contracts
│
├── clubsphere-backend/                    # Riya's Spring Boot 3 + Java 21 REST API
│   ├── pom.xml
│   └── src/main/java/com/clubsphere/
│       ├── common/                        # ApiResponse envelope, GlobalExceptionHandler, QrCodeUtil
│       ├── config/                        # SecurityConfig, WebMvcConfig, OpenApiConfig, DataInitializer
│       ├── security/                      # JwtUtils, JwtAuthFilter, UserDetailsServiceImpl
│       └── modules/                       # Auth, User, Membership, Staff, and Integration APIs
│
├── clubsphere-frontend/                   # Riya's React 18 (Vite) Single Page Application
│   ├── package.json
│   └── src/                               # Dashboards for Admin, Staff, Member, and Integration Demo
│
├── backend/                               # Swathi's Court Booking & Enquiry Spring Boot Backend
│   ├── pom.xml
│   └── src/main/java/com/clubsphere/      # Court & Booking Controllers, Services, Entities
│
├── frontend/                              # Swathi's Court Booking & Public Club React Frontend
│   ├── package.json
│   └── src/                               # Public website, booking flow, court dashboard
│
└── schema.sql                             # Court booking SQL schema
```

---

## 4. Setup & Running Instructions

### Prerequisites
- Java 21 LTS installed (`java -version`)
- Apache Maven 3.9+ installed (`mvn -version`)
- Node.js v20+ & npm installed (`node -v`, `npm -v`)
- PostgreSQL running on port `5432`

### 1. Database Setup
```bash
psql -U postgres -c "CREATE DATABASE clubsphere_db;"
psql -U postgres -d clubsphere_db -f docs/database/01_schema.sql
psql -U postgres -d clubsphere_db -f docs/database/02_seed_data.sql
```

### 2. Run Riya's Backend (Auth, Membership, Staff & Integration APIs)
```bash
cd clubsphere-backend
mvn spring-boot:run
```
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Run Riya's Frontend
```bash
cd clubsphere-frontend
npm install
npm run dev
```
- Frontend app: `http://localhost:5173`

---

## 5. Demo Credentials

| Role | Email | Password | Primary Accessible Features |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@clubsphere.com` | `Admin@123` | User directory, Membership dashboard, Staff management, Team Integrations |
| **Staff Member** | `coach.rahul@clubsphere.com` | `Staff@123` | Staff portal, Daily attendance punch, Shift schedules, Leave requests |
| **Club Member** | `vikram.singh@example.com` | `Member@123` | Gold membership, Digital QR card pass, Plan renewals |
