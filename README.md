# ClubSphere – Sports Club Management System
> **College Project | Full Stack Web Application**  
> **Modules Owned by Riya:** Authentication & User Management, Membership Management, Staff Management, and Inter-Module Integration APIs.

---

## 1. Project Overview & Architectural Highlights

ClubSphere is a centralized sports club management platform developed for sports complexes, fitness clubs, and country clubs. It features a modern decoupled architecture:
- **Backend:** Java 21 LTS, Spring Boot 3.3.5, Spring Data JPA, Hibernate, Spring Security 6 (Stateless JWT + BCrypt), ZXing QR Code Generation, Swagger OpenAPI 3.
- **Frontend:** React 18 (Vite), React Router v6, Axios, Lucide React icons, and a custom Emerald Green (`#0F5132`) & Crisp White ClubSphere design system.
- **Database:** PostgreSQL 18 with 3NF normalized tables, relational foreign keys, unique constraints, and automated indexing.

---

## 2. Modules Implemented

### Module 1: Authentication & User Management
- **Member Registration:** Complete registration form with full name, email format check, unique phone validation, date of birth, address, and gender.
- **Role-Based Authentication:** Secured login using Spring Security and stateless JWT tokens with BCrypt password hashing.
- **Role Redirection:** Automatic routing based on assigned authorities:
  - `ROLE_ADMIN` $\rightarrow$ `/admin/dashboard`
  - `ROLE_STAFF` $\rightarrow$ `/staff/dashboard`
  - `ROLE_MEMBER` $\rightarrow$ `/member/dashboard`
- **User Directory & Management:** Admin can search across users by name/email/phone, filter by role and status (`ACTIVE`, `INACTIVE`, `SUSPENDED`), view detailed user profiles, edit information, and toggle account activation.
- **Member Self-Service:** Personal profile view and updates, secure password change with current password verification.

### Module 2: Membership Management
- **Three Configurable Plan Tiers:**
  - **Gold Membership:** Premium full club access, VIP court privileges, free court bookings, 15% sports shop discount, 10% cafe discount.
  - **Silver Membership:** Standard club access, 10% sports shop discount, 5% cafe discount.
  - **Junior Membership:** Youth discount membership for athletes under 18 years of age with automated backend age validation.
  - *All prices, durations in days, and perks are dynamically configurable by the administrator.*
- **Subscription & Automatic Duration Calculation:** Computes validity period (`startDate` to `endDate`), generates unique sequential Membership numbers (e.g. `CS-MEM-2026-00101`), and logs payment transactions.
- **Automated Expiry Detection:** Daily scheduled job and query filters identify expired memberships.
- **Membership Renewal:** Extends duration from the current expiry date (if active) or from today (if expired) and records renewal transactions.
- **Digital QR Membership Card:** Generates a cryptographic QR pass containing safe verification tokens. Renders a high-resolution ClubSphere membership card with one-click PNG download for members to present at court turnstiles.

### Module 3: Staff Management
- **Employee Directory:** Tracks employee code (e.g. `CS-EMP-001`), department, job designation, joining date, employment status, employment type, and confidential base salary.
- **Attendance Management:** Daily attendance punch logging (`PRESENT`, `ABSENT`, `HALF_DAY`, `ON_LEAVE`), punch in/out times, and individual attendance history.
- **Shift & Duty Scheduling:** Standard shifts (Morning, Evening, General) and daily employee shift allocation.
- **Leave Application & Approval Workflow:** Staff can apply for Casual, Sick, Annual, or Unpaid leaves with reason. Administrators review, approve, or reject applications with admin remarks and automatic duty status updates.
- **Salary Records:** Monthly payroll generation calculating `netSalary = baseSalary + allowances - deductions`, payment status tracking, and disbursement references.

### Module 4: Inter-Module Team Integration (Swathi, Balaji & Anish)
Riya's module serves as the central system of record, exposing clean, reusable micro-endpoints:
1. **Swathi (Court Booking):** `GET /api/integration/members/verify/{membershipNumberOrQrToken}` verifies active status, allowed advance booking days, and booking discounts without duplicate tables.
2. **Balaji (Sports Shop & Cafe):** `GET /api/integration/members/discount-eligibility/{memberId}` verifies plan category and returns active discount percentages.
3. **Anish (Finance Ledger & Executive Dashboard):**
   - `GET /api/integration/finance/membership-transactions`
   - `GET /api/integration/finance/salary-expenses`
   - `GET /api/integration/analytics/club-summary`
*(An interactive live testbed for these integrations is available directly under Admin $\rightarrow$ "Team Integrations".)*

---

## 3. Project Directory Structure

```
ClubSphere/
├── docs/
│   ├── database/
│   │   ├── 01_schema.sql                  # PostgreSQL table definitions
│   │   └── 02_seed_data.sql                # Default roles, plans, shifts, departments
│   ├── postman/
│   │   └── ClubSphere_APIs.postman_collection.json # Complete API testing collection
│   └── integration/
│       └── TEAM_INTEGRATION_GUIDE.md      # API contracts for Swathi, Balaji & Anish
│
├── clubsphere-backend/                    # Spring Boot 3 + Java 21 REST API
│   ├── pom.xml
│   └── src/main/java/com/clubsphere/
│       ├── common/                        # ApiResponse envelope, GlobalExceptionHandler, QrCodeUtil
│       ├── config/                        # SecurityConfig, WebMvcConfig, OpenApiConfig, DataInitializer
│       ├── security/                      # JwtUtils, JwtAuthFilter, UserDetailsServiceImpl
│       ├── modules/
│       │   ├── auth/                      # Controllers, Services, DTOs
│       │   ├── user/                      # User & Role entities, repositories, admin services
│       │   ├── membership/                # Plans, Members, Memberships, QR Generator, Transactions
│       │   └── staff/                     # Departments, Employees, Shifts, Attendance, Leaves, Salaries
│       └── integration/                   # Reusable endpoints for Swathi, Balaji & Anish
│
└── clubsphere-frontend/                   # Modern React (Vite) Single Page Application
    ├── package.json
    └── src/
        ├── components/                    # Cards, Modals, Navbar, Sidebar, StatCard, QR Pass
        ├── context/                       # AuthContext (JWT, session, role guards)
        ├── pages/
        │   ├── auth/                      # Login, Register, Forgot Password
        │   ├── admin/                     # Admin Dashboard, User Mgmt, Memberships, Plans, Staff, Attendance, Leaves, Shifts, Salary, Integration Demo
        │   ├── member/                    # Member Hub, Profile, Plans Catalog, My Membership, QR Pass
        │   └── staff/                     # Staff Portal, Profile, My Attendance, Apply Leave, Shifts
        ├── routes/                        # Role-based ProtectedRoute definitions
        └── styles/                        # Custom Emerald Green Theme (variables.css, globals.css, dashboard.css)
```

---

## 4. Setup & Execution Guide

### Prerequisites
- Java 21 LTS installed (`java -version`)
- Apache Maven 3.9+ installed (`mvn -version`)
- Node.js v20+ & npm installed (`node -v`, `npm -v`)
- PostgreSQL 18 running on port `5432` (`psql -U postgres`)

---

### Step 1: Database Setup (PostgreSQL)

Connect to PostgreSQL and create the database `clubsphere_db`:
```bash
# In PowerShell / Terminal:
psql -U postgres -c "CREATE DATABASE clubsphere_db;"
```

Run the schema and seed scripts:
```bash
psql -U postgres -d clubsphere_db -f docs/database/01_schema.sql
psql -U postgres -d clubsphere_db -f docs/database/02_seed_data.sql
```

*(Note: Spring Boot's built-in `DataInitializer.java` will also automatically ensure roles, initial admin, default plans, departments, shifts, and sample data are populated if starting fresh.)*

---

### Step 2: Start the Spring Boot Backend

Navigate to `clubsphere-backend`:
```bash
cd clubsphere-backend
mvn spring-boot:run
```
- The backend will start on **`http://localhost:8080`**.
- Interactive Swagger OpenAPI Documentation: **`http://localhost:8080/swagger-ui.html`**.

---

### Step 3: Start the React Frontend

In a separate terminal, navigate to `clubsphere-frontend`:
```bash
cd clubsphere-frontend
npm install
npm run dev
```
- The frontend will launch at **`http://localhost:5173`**.

---

## 5. College Viva Demo & Test Credentials

The application includes convenient **Quick Demo Shortcuts** on the login page for rapid evaluator demonstrations:

| User Role | Email | Password | Primary Accessible Features |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@clubsphere.com` | `Admin@123` | Complete User Management, Membership Dashboard, Plan Pricing, Staff Directory, Attendance, Leave Approvals, Payroll, Team Integration Hub |
| **Staff Member** | `coach.rahul@clubsphere.com` | `Staff@123` | Staff Portal, Daily Punch-in, Duty Hours, Apply Leave, My Shift Roster |
| **Club Member** | `vikram.singh@example.com` | `Member@123` | Active Gold Membership, Digital QR Gate Pass (with PNG download), Plan Renewals, Profile Management |
| **Junior Member** | `aarav.mehta@example.com` | `Member@123` | Junior Youth Membership (<18), Coaching Clinics Access, Digital Pass |

---

## 6. API Testing with Postman

1. Open Postman.
2. Click **Import** $\rightarrow$ select `docs/postman/ClubSphere_APIs.postman_collection.json`.
3. The collection includes pre-configured requests with standard sample bodies for all 5 endpoint groups.
4. Execute `Login (Admin)` to obtain a JWT token, paste it into the `token` collection variable, and test any administrative endpoint.
