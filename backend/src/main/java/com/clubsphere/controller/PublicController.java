package com.clubsphere.controller;

import com.clubsphere.model.Court;
import com.clubsphere.service.CourtService;
import com.clubsphere.service.MembershipClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class PublicController {

    private final CourtService courtService;
    private final MembershipClientService membershipClientService;

    public PublicController(CourtService courtService, MembershipClientService membershipClientService) {
        this.courtService = courtService;
        this.membershipClientService = membershipClientService;
    }

    @GetMapping("/facilities")
    public ResponseEntity<List<Court>> getPublicFacilities() {
        return ResponseEntity.ok(courtService.getAllActiveCourts());
    }

    @GetMapping("/membership-plans")
    public ResponseEntity<List<Map<String, Object>>> getMembershipPlans() {
        return ResponseEntity.ok(membershipClientService.getPublicMembershipPlans());
    }

    @GetMapping("/shop-preview")
    public ResponseEntity<List<Map<String, Object>>> getShopPreview() {
        // Balaji's Sports Shop integration preview
        return ResponseEntity.ok(List.of(
            Map.of(
                "id", 101,
                "name", "Wilson Pro Staff 97 v14",
                "category", "TENNIS",
                "price", 18999,
                "image", "https://images.unsplash.com/photo-1617083934555-ac7d4fedc6b6?w=600",
                "stock", "In Stock (Club Shop)",
                "badge", "Bestseller"
            ),
            Map.of(
                "id", 102,
                "name", "Babolat Pure Drive 2024",
                "category", "TENNIS",
                "price", 17499,
                "image", "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600",
                "stock", "In Stock (Club Shop)",
                "badge", "Trending"
            ),
            Map.of(
                "id", 103,
                "name", "SS Ton Reserve Edition English Willow Bat",
                "category", "CRICKET",
                "price", 24999,
                "image", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600",
                "stock", "5 Units Available",
                "badge", "Grade 1 Willow"
            ),
            Map.of(
                "id", 104,
                "name", "Kookaburra Turf Match Cricket Ball (Pack of 6)",
                "category", "CRICKET",
                "price", 7200,
                "image", "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600",
                "stock", "In Stock",
                "badge", "Match Grade"
            ),
            Map.of(
                "id", 105,
                "name", "Asics Gel-Resolution 9 Clay Court Shoes",
                "category", "APPAREL",
                "price", 12999,
                "image", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
                "stock", "Sizes 7 - 11",
                "badge", "Pro Performance"
            ),
            Map.of(
                "id", 106,
                "name", "ClubSphere Tournament Kit Bag",
                "category", "ACCESSORIES",
                "price", 4500,
                "image", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
                "stock", "In Stock",
                "badge", "Club Official"
            )
        ));
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<Map<String, Object>>> getTestimonials() {
        return ResponseEntity.ok(List.of(
            Map.of(
                "id", 1,
                "name", "Vikramaditya Sengupta",
                "role", "Gold Member, State Tennis Finalist",
                "avatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
                "content", "The court maintenance at ClubSphere is world-class. Booking Centre Court for our morning rallies takes less than 30 seconds online. The transparent slot system means zero waiting and no double-booking hassles!"
            ),
            Map.of(
                "id", 2,
                "name", "Ananya Deshmukh",
                "role", "Cricket Enthusiast & Junior Parent",
                "avatar", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
                "content", "The automated bowling machines and turf nets have drastically improved my son's stroke play. Friday Social Play is also the club's greatest community event—fun, welcoming, and high-energy."
            ),
            Map.of(
                "id", 3,
                "name", "Rohan Kulkarni",
                "role", "Silver Member",
                "avatar", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                "content", "QR code check-in at the front desk is so convenient! I just show the pass on my phone, tap in, and head straight to Clay Court 2. Excellent facilities and warm staff."
            )
        ));
    }

    @GetMapping("/faqs")
    public ResponseEntity<List<Map<String, Object>>> getFaqs() {
        return ResponseEntity.ok(List.of(
            Map.of(
                "category", "Court Bookings",
                "question", "How long is each booking session and how do slot timings work?",
                "answer", "Each regular court reservation lasts exactly 60 minutes. Booking slots open every 30 minutes (e.g. 8:00 AM, 8:30 AM, 9:00 AM). Staggered slots prevent overlap so two players never conflict on the same court."
            ),
            Map.of(
                "category", "Court Bookings",
                "question", "How many sessions can a member book per day?",
                "answer", "To ensure fair court access across all members, each member can reserve a maximum of two regular sessions per day. This limit is enforced directly by our backend booking engine."
            ),
            Map.of(
                "category", "Friday Social Play",
                "question", "What is Friday Social Play and how is it different from regular bookings?",
                "answer", "Friday Social Play is our weekly community mixer from 6:00 PM to 9:00 PM where up to 16 players join together on shared courts. It uses a dedicated group reservation model so members can easily register without individual court restrictions."
            ),
            Map.of(
                "category", "Cancellations & Rescheduling",
                "question", "Can I reschedule or cancel my court booking?",
                "answer", "Yes! You can reschedule your booking to any available future time slot via My Bookings. Eligible cancellations are processed instantly with coordinated refund records sent to our Finance desk."
            ),
            Map.of(
                "category", "Check-In",
                "question", "How does front desk check-in work?",
                "answer", "Once your booking is confirmed, a digital pass with a unique QR code is generated. Present this QR code to the staff at the front desk to check in instantly and verify your court reservation."
            )
        ));
    }
}
