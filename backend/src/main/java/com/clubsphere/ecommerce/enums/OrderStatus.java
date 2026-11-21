package com.clubsphere.ecommerce.enums;

/**
 * OrderStatus — Represents lifecycle stages of a shop order.
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PROCESSING,
    READY_FOR_PICKUP,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
