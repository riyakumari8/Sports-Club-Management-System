# ClubSphere – Sports Club Management System
## College B.Tech Capstone Project – Comprehensive Evaluation & Demonstration Guide

---

## 1. Project Overview & Architecture

**ClubSphere** is a unified, enterprise-grade digital ecosystem built for collegiate athletics, university sports complex operations, and student wellness management. Spanning across a **React.js single-page application**, a **Java 21 / Spring Boot 3.3.5 backend**, and a **PostgreSQL 18 database**, the system powers day-to-day operations with strict role-based access control, automated court reservations, cryptographic QR turnstiles, and an enforced single-active membership policy.

```
                    ┌────────────────────────────────────────────────┐
                    │          ClubSphere Unified Frontend           │
                    │        (React 19 + Vite 8 + Lucide Icons)      │
                    │    Emerald Green (#0F5132) + Gold (#D4AF37)    │
                    └───────┬──────────────┬──────────────┬──────────┘
                            │              │              │
                   Public Website    Student Portal   Admin / Staff
                  (8 Full Pages)     (QR, Bookings)   (Operations)
                            │              │              │
                            └───────┬──────┴──────────────┘
                                    │ REST APIs / JWT Auth
                    ┌───────────────▼────────────────────────────────┐
                    │          ClubSphere Spring Boot Backend        │
                    │         (Java 21, Spring Security, JPA)        │
                    └───────────────┬────────────────────────────────┘
                                    │ JPA / Hibernate 6
                    ┌───────────────▼────────────────────────────────┐
                    │          PostgreSQL 18 Database                │
                    │         Database: `clubsphere_db`              │
                    │   Constraint: `idx_one_active_membership`      │
                    └────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

- **Frontend:**
  - React.js (v19) with React Router (v7)
  - Vite (v8) lightning build engine
  - Lucide React iconography
  - Custom Emerald Green (`#0F5132`) & Gold (`#D4AF37`) Design System
  - QRCode.react & Html2Canvas for digital wallet card generation

- **Backend:**
  - Java 21 (LTS) & Spring Boot 3.3.5
  - Spring Security with Stateless JWT Token Filter & BCrypt password hashing
  - Spring Data JPA with Hibernate 6
  - RESTful micro-endpoints supporting inter-module team integrations

- **Database:**
  - PostgreSQL 18 on `localhost:5432` (`clubsphere_db`)
  - Partial Unique Index: `idx_one_active_membership`
  - Automated relational schemas for OTPs, Password Tokens, In-App Notifications, Promotions, Shop Products, Court Bookings, and Employee Shifts

---

## 3. Evaluation Demonstration Credentials

All accounts are pre-seeded in the database with BCrypt-hashed passwords for immediate viva demonstration. Evaluators may also use the floating **"Viva Sandbox Quick-Login"** button on the home page (`/`) for 1-click automatic authentication into any role.

### A. Administrators
| Name | Email / Username | Password | Role | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Dr. Rajesh Sharma** | `admin@clubsphere.com` | `Admin@123` | `ROLE_ADMIN` | Full System CRUD, Staff Directory, Leaves, Membership Plans, Financials & Integrations |
| **Sports Director** | `sports.director@clubsphere.com` | `Admin@123` | `ROLE_ADMIN` | Executive Athletic Council Control & Court Management |

> Dedicated Admin Portal URL: `http://localhost:5173/admin/login`

---

### B. Staff & Faculty (Across 5 Departments)
| Name | Email / Username | Password | Department | Primary Role |
| :--- | :--- | :--- | :--- | :--- |
| **Coach Rahul Sharma** | `coach.rahul@clubsphere.com` | `Staff@123` | Tennis | Head Tennis Coach, Duty Punch-In & Shift Rosters |
| **Coach Priya Verma** | `coach.priya@clubsphere.com` | `Staff@123` | Badminton | Badminton Director & Turnstile Gate Check-In |
| **Coach Amit Kulkarni** | `coach.amit@clubsphere.com` | `Staff@123` | Squash / Gym | Strength & Conditioning Trainer |
| **Sunil Yadav** | `maintenance.sunil@clubsphere.com` | `Staff@123` | Maintenance | Court Resurfacing & Floodlight Facility Lead |
| **Neha Gupta** | `frontdesk.neha@clubsphere.com` | `Staff@123` | Operations | Front Desk Attendant & QR Code Scanner Kiosk |

> Dedicated Staff Portal URL: `http://localhost:5173/staff/login`

---

### C. Sample Student Accounts (20 Realistic Profiles Across All 5 States)

#### 1. Active Paid Members (Gold, Silver, Junior)
| Student Name | Email | Password | Tier | Status / Perks |
| :--- | :--- | :--- | :--- | :--- |
| **Vikram Singh** | `vikram.singh@example.com` | `Member@123` | **Gold** | Free court bookings, 7-day advance booking, QR Pass |
| **Ananya Sharma** | `ananya.sharma@example.com` | `Member@123` | **Gold** | Active Gold Plan, in-app notifications, cafe discounts |
| **Rohan Verma** | `rohan.verma@example.com` | `Member@123` | **Silver** | 50% court discount, 3-day booking window |
| **Sneha Patel** | `sneha.patel@example.com` | `Member@123` | **Silver** | Badminton player, digital pass enabled |
| **Aarav Mehta** | `aarav.mehta@example.com` | `Member@123` | **Junior** | Youth member (< 18 yrs), coaching clinic access |

#### 2. Active 7-Day Free Trial Users
| Student Name | Email | Password | Trial Status | Days Remaining |
| :--- | :--- | :--- | :--- | :--- |
| **Kavya Nair** | `kavya.nair@example.com` | `Member@123` | `ACTIVE` | 6 Days Remaining (Countdown badge active) |
| **Arjun Reddy** | `arjun.reddy@example.com` | `Member@123` | `ACTIVE` | 5 Days Remaining (Court bookings unlocked) |
| **Priya Iyer** | `priya.iyer@example.com` | `Member@123` | `ACTIVE` | 7 Days Remaining (Freshly activated) |
| **Dev Sharma** | `dev.sharma@example.com` | `Member@123` | `ACTIVE` | 4 Days Remaining |
| **Tanvi Joshi** | `tanvi.joshi@example.com` | `Member@123` | `ACTIVE` | 3 Days Remaining |

#### 3. Expired Members (Shows Warning & Renewal Workflow)
| Student Name | Email | Password | State | Demonstration Feature |
| :--- | :--- | :--- | :--- | :--- |
| **Manish Kumar** | `manish.kumar@example.com` | `Member@123` | `EXPIRED` | Expired warning banner, paused bookings, 1-click renewal CTA |
| **Pooja Chopra** | `pooja.chopra@example.com` | `Member@123` | `EXPIRED` | Previous Silver membership expired |
| **Rahul Deshmukh** | `rahul.deshmukh@example.com` | `Member@123` | `EXPIRED` | Trial expired state |

#### 4. Registered Students (No Membership Yet)
| Student Name | Email | Password | State | Demonstration Feature |
| :--- | :--- | :--- | :--- | :--- |
| **Simran Kaur** | `simran.kaur@example.com` | `Member@123` | `NO_MEMBERSHIP` | Prominent 1-click "Claim 7-Day Free Trial" Banner |
| **Varun Gupta** | `varun.gupta@example.com` | `Member@123` | `NO_MEMBERSHIP` | Explore plans catalog, trial unactivated |
| **Meera Sen** | `meera.sen@example.com` | `Member@123` | `NO_MEMBERSHIP` | Fresh university student account |

#### 5. Inactive / Suspended Students
| Student Name | Email | Password | State | Demonstration Feature |
| :--- | :--- | :--- | :--- | :--- |
| **Karan Singh** | `karan.singh@example.com` | `Member@123` | `INACTIVE` | Account suspended by athletic discipline committee |
| **Neha Bose** | `neha.bose@example.com` | `Member@123` | `INACTIVE` | Inactive status demonstration |

> Student Login URL: `http://localhost:5173/login`  
> Multi-Step Signup URL: `http://localhost:5173/signup`

---

## 4. Key Functional Features Implemented

### 4.1. 18 Distinct Home Page (`/`) Sections
1. **Hero Section:** Headline, subheadline, 3 CTA buttons ("Claim 7-Day Free Trial", "Explore Sports", "View Membership Plans"), and metric counters.
2. **Quick Category Bar:** Direct discipline navigation (Tennis, Badminton, Squash, Swimming, Gym, Yoga).
3. **About the Club Snippet:** Institutional overview + "Read More" redirecting to `/about`.
4. **Featured Sports Grid:** Multi-discipline cards with specifications and booking links.
5. **7-Day Free Trial Banner:** Highlighting zero upfront cost student passes.
6. **Court Showcase:** Interactive previews of all 6 campus courts with surface and lighting details.
7. **Membership Plans Preview:** Side-by-side Gold, Silver, and Junior comparison.
8. **Live Promotions Carousel/Grid:** Dynamic backend coupon cards with copy-code buttons.
9. **Why Choose ClubSphere:** 6 core competitive advantages (Olympic courts, certified coaches, instant QR access).
10. **Facilities & Amenities Grid:** Floodlit courts, Pro Shop, Cafe, Locker rooms, Physio room.
11. **Friday Social Play Teaser:** Upcoming doubles mixer details and RSVP call-to-action.
12. **Pro Shop & Cafe Spotlight:** Highlights original gear and post-workout nutritional shakes.
13. **Student Reviews & Testimonials:** 4 real student quotes with avatars and branch credentials.
14. **Certified Coaches Spotlight:** Biographies and certifications of head faculty mentors.
15. **Upcoming Tournaments Ticker:** Inter-branch badminton, Tennis open, and Swimming galas.
16. **Interactive FAQ Accordion:** 6 collapsible answers to student inquiries.
17. **Viva Sandbox Modal:** 1-click floating launcher to demo any account instantly.
18. **Comprehensive Footer:** 4-column campus directory, hours, copyright, and discrete evaluator portal links.

### 4.2. Multi-Step Student Signup Workflow (`/signup`)
- **Stage 1 (Personal Details):** Validates Name, Email, Phone, DOB, Gender, and Emergency Contact. Submits to `/api/auth/student/signup/stage1`. Generates a 6-digit OTP with a 5-minute expiry in `signup_otps`.
- **Stage 2 (Email OTP Verification):** 6-digit OTP input with live 5-minute countdown clock and "Resend OTP" button. Includes a **discreet Development Helper button** displaying the generated OTP for instantaneous local evaluator testing without needing an external SMTP mail server.
- **Stage 3 (Password & Terms):** Password field enforcing minimum 10 characters with an animated **Visual Strength Meter** (Weak / Moderate / Strong), password match confirmation, and Terms & Conditions checkbox. Upon completion, the student is automatically authenticated and routed to `/student/dashboard`.

### 4.3. 7-Day Free Trial Engine
- Built-in 1-click trial start endpoint (`/api/auth/student/trial/start`).
- Database tracking for `trial_status`, `trial_start_date`, and `trial_end_date`.
- Strictly **ONE trial per student account**.
- Trial status dashboard widget dynamically computing remaining countdown days.

### 4.4. Strict "One Active Membership" Principle
- Enforced at the Spring Boot service level (`MembershipService.java`) and the PostgreSQL database level via partial unique index:
  ```sql
  CREATE UNIQUE INDEX idx_one_active_membership ON memberships (member_id) WHERE status = 'ACTIVE';
  ```
- Members upgrading (e.g., from Silver to Gold) have their prior active record transitioned to `SUPERSEDED` status, preserving complete audit trails.

### 4.5. Centralized Alert and Notification Management System (`/notifications`)
- Centralized notification tray accessible from the Navbar bell and dedicated page `/notifications`.
- Filter alerts across tabs: `All`, `Unread`, `Read`, with category filtering (`FINANCE`, `MEMBERSHIP`, `BOOKING`, `TRIAL`, `SYSTEM`) and severity (`CRITICAL`, `HIGH`, `MEDIUM`, `INFO`).
- Single-click action routing: direct jump to `/member/payments`, `/member/my-bookings`, or `/admin/finance`.
- Spring Boot `@Scheduled` daily task (`ScheduledTasks.java`) checking trial deadlines and sending automated membership renewal reminders at 7, 3, and 1 days before expiry.
- Manual trigger button on `/notifications`: **"Run Expiry Reminders Engine (Demo)"** allows evaluators to simulate the scheduled midnight expiry engine on demand.

### 4.6. Pro Shop & Sports Cafe (`/shops`)
- **Pro Sports Shop Tab:** 25 catalog items (Tennis racquets, badminton gear, footwear, apparel, accessories) with regular and discounted member prices.
- **Club Cafe Tab:** 15 healthy dining items (Protein shakes, acai bowls, sandwiches, beverages) with nutritional calorie counts.
- **Order Simulator Modal:** Interactive checkout popup allowing evaluators to simulate ordering for demo verification.

### 4.7. Finance, Accounting, Payment Tracking and Reports (Section 20)
- **Finance Dashboard (`/admin/finance`):**
  - Live calculations from database transactions: Total Recognized Revenue, Today's Revenue, Monthly Revenue, Operating Expenses, Net Operating Profit, Pending Payments, Completed Payments, Failed Payments, and Refunds.
  - Period filter buttons: `Today`, `This Week`, `This Month`, `This Year`, and `Custom Date Range`.
  - Visual breakdown cards: Revenue by Module (Membership, Court Booking, Sports Shop, Cafe), Collections by Payment Method (UPI, Cash, Card, Net Banking), Operating Expenses by Category.
  - Recent transactions stream and real-time audit alerts.
- **Unified Payment Tracking Ledger (`/admin/payments`):**
  - Unified tracking across 6 sources: Membership Purchases, Renewals, Upgrades, Court Bookings, Pro Sports Shop, and Club Cafe.
  - Search by payment reference, transaction ID, payer name, or notes.
  - Multi-criteria filters: Source module, payment method, status, date range.
  - Transaction Record Details Modal with complete service breakdown.
  - Customer Refund Processing Modal: issue full or partial refund with audit logging.
  - **"Simulate Demo Payment"** action button for evaluation viva demonstration.
  - One-click CSV export of filtered ledger items.
- **Operational Expense Management (`/admin/expenses`):**
  - Full CRUD operations across 7 operational categories: Staff Salary, Equipment, Maintenance, Utilities, Inventory, Events, and Other.
  - Add and edit expense modals with validation, disbursement dates, payment modes, and vendor tracking.
  - Audit logs and administrator alerts triggered on expense operations.
- **12 Distinct Financial Accounting Reports (`/admin/finance-reports`):**
  - Generates 12 individual audit reports: Statement of Profit and Loss (P&L), Daily Revenue, Weekly Revenue, Monthly Revenue, Yearly Revenue, Membership Subscriptions, Court Bookings & Green Fees, Pro Shop Sales, Club Cafe Sales, Comprehensive Expenses, Outstanding Payments, and Customer Refunds.
  - Aggregated KPI cards, date range filtering, detailed transaction table.
  - Export to CSV and print-ready PDF view (`window.print()`).
- **Payment Reconciliation & Cash Audit (`/admin/reconciliation`):**
  - Daily settlement protocol auditing Online settlements vs Front desk cash receipts vs Refunds deducted.
  - Front Desk Cash Drawer Audit Table: logs cashier staff employee ID and timestamp for every cash receipt.
  - Discrepancy & Unreconciled Review Queue for reviewing dropped or disputed payments.
  - "Run Balance Verification" one-click cashier settlement check.
- **Student Payment History & Digital Receipts (`/member/payments`):**
  - Strict Authorization: Student accesses only their personal payment records; no club revenue or profit figures are exposed.
  - Official printable Tax Invoice / Receipt modal with ClubSphere GSTIN header, transaction details, amount breakdown, refund credit, and verification QR code.

---

## 5. Verification & Testing Instructions

### Step 1: Start the Spring Boot Backend
```bash
cd clubsphere-backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

### Step 2: Start the React Frontend
```bash
cd clubsphere-frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

### Step 3: Run the Public Website & Portals
- Open browser at `http://localhost:5173/`
- Click **"Viva Sandbox Quick-Login"** at bottom right to jump directly into Admin, Staff, or Student dashboards.
- Test new student registration at `http://localhost:5173/signup` using the Dev OTP autofill button.
- Check court reservation availability at `http://localhost:5173/courts`.
- Test notifications by booking a court or activating the 7-day free trial.

---

&copy; 2026 ClubSphere. College B.Tech Capstone Project. Developed by Riya Kumari & Team.
