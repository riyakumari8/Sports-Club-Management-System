package com.clubsphere.ecommerce.enums;

/**
 * PaymentMethod — Represents accepted payment modes for shop orders and counter sales.
 *
 * CASH: Cash on delivery or at the physical counter.
 * CARD: Credit/Debit card payment.
 * UPI: Unified Payments Interface (digital mobile payments).
 * ONLINE: Online payment gateway processing.
 */
public enum PaymentMethod {
    CASH,
    CARD,
    UPI,
    ONLINE
}
