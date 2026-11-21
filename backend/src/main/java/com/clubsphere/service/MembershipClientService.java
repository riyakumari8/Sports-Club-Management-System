package com.clubsphere.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

/**
 * Service simulating and integrating with Riya's Authentication, User and Membership Module.
 * Avoids duplicate membership tables while strictly honoring Gold, Silver, Junior benefits.
 */
@Service
public class MembershipClientService {

    public record MembershipDiscount(String tierName, BigDecimal discountPercentage, String description) {}

    public MembershipDiscount getMemberDiscount(String tier) {
        if (tier == null) {
            return new MembershipDiscount("GUEST", BigDecimal.ZERO, "Standard Guest Rate (No discount)");
        }
        return switch (tier.toUpperCase()) {
            case "GOLD" -> new MembershipDiscount("GOLD", new BigDecimal("100.00"), "Gold Plan: 100% Free Court Access Quota");
            case "SILVER" -> new MembershipDiscount("SILVER", new BigDecimal("25.00"), "Silver Plan: 25% Member Discount");
            case "JUNIOR" -> new MembershipDiscount("JUNIOR", new BigDecimal("50.00"), "Junior Plan: 50% Youth Training Discount");
            default -> new MembershipDiscount("GUEST", BigDecimal.ZERO, "Guest: Standard Rack Rate");
        };
    }

    public BigDecimal calculateDiscountedPrice(BigDecimal baseRate, String tier) {
        MembershipDiscount discount = getMemberDiscount(tier);
        BigDecimal discountFraction = discount.discountPercentage().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal discountAmount = baseRate.multiply(discountFraction);
        BigDecimal finalAmount = baseRate.subtract(discountAmount);
        return finalAmount.max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Membership plans preview for Public Website (consumed from Riya's APIs)
     */
    public List<Map<String, Object>> getPublicMembershipPlans() {
        return List.of(
            Map.of(
                "id", 1,
                "name", "Gold Membership",
                "tier", "GOLD",
                "price", "₹ 4,999 / month",
                "badge", "Most Popular",
                "highlight", "Full, unlimited access with zero court booking fees",
                "features", List.of(
                    "Free booking on all Tennis & Cricket courts",
                    "7 days advance slot reservation window",
                    "Complimentary access to Friday Social Play",
                    "20% discount on Pro Shop gear & Cafe bills",
                    "Free locker and guest pass (2 per month)"
                )
            ),
            Map.of(
                "id", 2,
                "name", "Silver Membership",
                "tier", "SILVER",
                "price", "₹ 2,499 / month",
                "badge", "Standard",
                "highlight", "Ideal for regular club players and weekend enthusiasts",
                "features", List.of(
                    "25% discount on all regular court booking fees",
                    "4 days advance slot reservation window",
                    "Priority entry to Friday Social Play sessions",
                    "10% discount on Pro Shop accessories",
                    "Access to cafeteria lounge"
                )
            ),
            Map.of(
                "id", 3,
                "name", "Junior Membership",
                "tier", "JUNIOR",
                "price", "₹ 1,499 / month",
                "badge", "Under 18",
                "highlight", "Tailored for young aspiring athletes and students",
                "features", List.of(
                    "50% discount on daytime practice court bookings",
                    "Access to certified junior coaching clinics",
                    "Free entry to weekend junior ladder tournaments",
                    "15% discount on youth racket restringing",
                    "Supervised training court access"
                )
            )
        );
    }
}
