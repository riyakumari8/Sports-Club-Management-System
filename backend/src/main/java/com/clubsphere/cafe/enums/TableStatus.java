package com.clubsphere.cafe.enums;

/**
 * TableStatus — Represents the current availability state of a cafeteria table.
 *
 * AVAILABLE: The table is empty and ready for new guests.
 * OCCUPIED:  Guests are currently seated and dining.
 * RESERVED:  The table is held for an upcoming booking.
 * CLEANING:  Guests have left and the table is being sanitized/reset.
 */
public enum TableStatus {
    AVAILABLE,
    OCCUPIED,
    RESERVED,
    CLEANING
}
