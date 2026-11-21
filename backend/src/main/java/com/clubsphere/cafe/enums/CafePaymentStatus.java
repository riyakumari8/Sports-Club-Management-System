package com.clubsphere.cafe.enums;

/**
 * CafePaymentStatus — Represents the settlement status of a cafeteria payment.
 *
 * PENDING:   Payment has been initiated or invoice presented, awaiting completion.
 * COMPLETED: Payment has been verified and fully collected.
 * FAILED:    Transaction failed or declined by payment provider.
 * REFUNDED:  Payment was reversed back to the customer.
 */
public enum CafePaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
}
