package com.clubsphere.cafe.enums;

/**
 * CafeOrderStatus — Represents the progression of a cafe/bar order lifecycle.
 *
 * PENDING:   Order placed by customer/waiter, waiting for kitchen acceptance.
 * PREPARING: Kitchen staff is actively cooking or preparing beverages.
 * READY:     Items are prepared and waiting to be served or picked up.
 * SERVED:    Order has been delivered to the customer table or handed over.
 * COMPLETED: Order is fulfilled and fully paid.
 * CANCELLED: Order was cancelled before preparation or fulfillment.
 */
public enum CafeOrderStatus {
    PENDING,
    PREPARING,
    READY,
    SERVED,
    COMPLETED,
    CANCELLED
}
