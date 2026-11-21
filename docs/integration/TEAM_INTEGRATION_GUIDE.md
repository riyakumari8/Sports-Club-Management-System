# ClubSphere Team Integration Guide
**Author:** Riya (Authentication, User Management, Membership Management, Staff Management)  
**Target Collaborators:** Swathi, Balaji, Anish  
**Base URL:** `http://localhost:8080/api`  

---

## 1. Overview for Team Members

Riya's module manages the foundational database and authentication for the entire ClubSphere system.  
**Important Rule:** Do **not** create duplicate `users`, `members`, `memberships`, or `employees` tables in your modules. All your modules can access Riya's secure endpoints described below.

---

## 2. Integration with Swathi (Court Management, Booking & Website)

### 2.1 Verify Active Membership Before Court Reservation
Before confirming any court booking, verify whether the user holds an active membership, check their allowed advance booking window, and apply their court booking discount.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/integration/members/verify/{membershipNumberOrQrToken}`
- **Example URL:** `http://localhost:8080/api/integration/members/verify/CS-MEM-2026-00101`
- **Authentication:** Public / Internal (No Bearer token required for gateway check)

#### Successful Response (`200 OK`):
```json
{
  "success": true,
  "message": "Verification complete",
  "data": {
    "valid": true,
    "memberId": 1,
    "memberCode": "CS-MB-2026-0001",
    "memberName": "Vikram Singh",
    "memberEmail": "vikram.singh@example.com",
    "membershipNumber": "CS-MEM-2026-00101",
    "planCategory": "GOLD",
    "planName": "Gold Membership",
    "status": "ACTIVE",
    "expiryDate": "2027-11-06",
    "isCourtAccessAllowed": true,
    "maxBookingDaysInAdvance": 7,
    "courtBookingDiscountPercent": 100.0,
    "message": "Member is verified with active membership"
  }
}
```

#### Inactive or Non-existent Member Response:
```json
{
  "success": true,
  "data": {
    "valid": false,
    "message": "No membership found matching identifier: INVALID_ID"
  }
}
```

#### Frontend Example for Swathi (React / Axios):
```javascript
import axios from 'axios';

export const checkMemberForBooking = async (membershipIdOrQr) => {
  const res = await axios.get(`http://localhost:8080/api/integration/members/verify/${membershipIdOrQr}`);
  if (res.data.data.valid) {
    const { maxBookingDaysInAdvance, courtBookingDiscountPercent } = res.data.data;
    // Apply advance booking restrictions and pricing discounts
    return res.data.data;
  } else {
    throw new Error('Court reservation requires an active ClubSphere membership.');
  }
};
```

---

## 3. Integration with Balaji (Sports Shop, Inventory & Cafe/Bar)

### 3.1 Check Member Discount Eligibility
When a member makes a purchase at the Sports Shop or orders food/beverages at the Cafe & Bar, scan their member ID or QR pass to retrieve their tier discount percentage.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/integration/members/discount-eligibility/{memberId}`
- **Example URL:** `http://localhost:8080/api/integration/members/discount-eligibility/1`

#### Successful Response (`200 OK`):
```json
{
  "success": true,
  "message": "Discounts calculated",
  "data": {
    "eligible": true,
    "memberId": 1,
    "memberName": "Vikram Singh",
    "planCategory": "GOLD",
    "sportsShopDiscountPercent": 15.0,
    "cafeBarDiscountPercent": 10.0,
    "status": "ACTIVE"
  }
}
```

#### Tier Discount Rules:
- **GOLD:** 15% discount on Sports Shop gear, 10% discount on Cafe & Bar bills.
- **SILVER:** 10% discount on Sports Shop gear, 5% discount on Cafe & Bar bills.
- **JUNIOR:** 5% discount on Sports Shop gear.

---

## 4. Integration with Anish (Finance, Reports & Executive Dashboard)

### 4.1 Membership Payment Ledger Feed
Retrieve all membership subscriptions, renewals, and upgrade transactions for financial audits and balance sheet reporting.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/integration/finance/membership-transactions`
- **Parameters:** `startDate` (optional), `endDate` (optional)
- **Example URL:** `http://localhost:8080/api/integration/finance/membership-transactions?startDate=2026-11-01T00:00:00`

### 4.2 Staff Payroll Expenses Feed
Retrieve employee salary disbursement records for monthly expense tracking.

- **HTTP Method:** `GET`
- **Endpoint:** `/api/integration/finance/salary-expenses`
- **Parameters:** `month` (e.g. 11), `year` (e.g. 2026)
- **Example URL:** `http://localhost:8080/api/integration/finance/salary-expenses?month=11&year=2026`

### 4.3 Central KPI Feed for Executive Dashboard
Retrieve aggregate club statistics for the main dashboard:
- **HTTP Method:** `GET`
- **Endpoint:** `/api/integration/analytics/club-summary`

#### Response:
```json
{
  "success": true,
  "data": {
    "totalUsers": 4,
    "totalMembers": 2,
    "activeMembers": 2,
    "expiredMembers": 0,
    "totalEmployees": 1,
    "activeEmployees": 1,
    "monthlyMembershipRevenue": 20000.00,
    "monthlyPayrollExpense": 45000.00
  }
}
```

---

## 5. Security & Authentication
For protected administrative endpoints, pass the JWT token in the HTTP Authorization header:
```http
Authorization: Bearer <token>
```
To obtain a token, call `POST /api/auth/login` with email and password.
