package com.clubsphere.integration;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.integration.dto.ClubIntegrationSummary;
import com.clubsphere.integration.dto.MemberDiscountResponse;
import com.clubsphere.integration.dto.MemberVerificationResponse;
import com.clubsphere.modules.membership.entity.Member;
import com.clubsphere.modules.membership.entity.Membership;
import com.clubsphere.modules.membership.entity.MembershipTransaction;
import com.clubsphere.modules.membership.repository.MemberRepository;
import com.clubsphere.modules.membership.repository.MembershipRepository;
import com.clubsphere.modules.membership.repository.MembershipTransactionRepository;
import com.clubsphere.modules.staff.dto.SalaryResponseDto;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.staff.repository.SalaryRecordRepository;
import com.clubsphere.modules.staff.service.SalaryService;
import com.clubsphere.modules.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/integration")
@RequiredArgsConstructor
@Tag(name = "Team Integration APIs", description = "Reusable endpoints for Swathi (Courts), Balaji (Shop/Cafe), and Anish (Finance/Dashboard)")
public class IntegrationController {

    private final MembershipRepository membershipRepository;
    private final MemberRepository memberRepository;
    private final MembershipTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryRecordRepository salaryRecordRepository;
    private final SalaryService salaryService;

    // =========================================================================
    // SWATHI'S INTEGRATION: Court Management & Booking Verification
    // =========================================================================

    @GetMapping("/members/verify/{identifier}")
    @Operation(summary = "Swathi: Verify member active status & booking privileges by Membership Number or QR Token")
    public ResponseEntity<ApiResponse<MemberVerificationResponse>> verifyMemberForCourtBooking(@PathVariable String identifier) {
        String query = identifier.replace("CLUBSPHERE:MEMBER:", "").trim();
        Optional<Membership> membershipOpt = membershipRepository.findByNumberOrQrToken(query);

        if (membershipOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success("Verification check complete",
                    MemberVerificationResponse.builder()
                            .valid(false)
                            .message("No membership found matching identifier: " + identifier)
                            .build()));
        }

        Membership m = membershipOpt.get();
        boolean isActive = m.isCurrentlyActive();
        String cat = m.getPlan().getCategory();

        int advanceDays = "GOLD".equalsIgnoreCase(cat) ? 7 : ("SILVER".equalsIgnoreCase(cat) ? 3 : 2);
        double courtDiscount = "GOLD".equalsIgnoreCase(cat) ? 100.0 : ("SILVER".equalsIgnoreCase(cat) ? 50.0 : 25.0);

        MemberVerificationResponse response = MemberVerificationResponse.builder()
                .valid(isActive)
                .memberId(m.getMember().getId())
                .memberCode(m.getMember().getMemberCode())
                .memberName(m.getMember().getUser().getFullName())
                .memberEmail(m.getMember().getUser().getEmail())
                .membershipNumber(m.getMembershipNumber())
                .planCategory(cat)
                .planName(m.getPlan().getName())
                .status(m.getStatus())
                .expiryDate(m.getEndDate())
                .isCourtAccessAllowed(isActive)
                .maxBookingDaysInAdvance(advanceDays)
                .courtBookingDiscountPercent(courtDiscount)
                .message(isActive ? "Member is verified with active membership" : "Membership is not active (Status: " + m.getStatus() + ")")
                .build();

        return ResponseEntity.ok(ApiResponse.success("Verification complete", response));
    }

    // =========================================================================
    // BALAJI'S INTEGRATION: Sports Shop, Inventory & Cafe/Bar Discounts
    // =========================================================================

    @GetMapping("/members/discount-eligibility/{memberId}")
    @Operation(summary = "Balaji: Check member plan discounts for Sports Shop and Cafe/Bar")
    public ResponseEntity<ApiResponse<MemberDiscountResponse>> getMemberDiscounts(@PathVariable Long memberId) {
        Member member = memberRepository.findById(memberId).orElse(null);
        if (member == null) {
            return ResponseEntity.ok(ApiResponse.success("Member not found",
                    MemberDiscountResponse.builder().eligible(false).build()));
        }

        Optional<Membership> activeMemOpt = membershipRepository.findFirstByMemberAndStatusOrderByEndDateDesc(member, "ACTIVE");
        if (activeMemOpt.isEmpty() || !activeMemOpt.get().isCurrentlyActive()) {
            return ResponseEntity.ok(ApiResponse.success("Member has no active membership",
                    MemberDiscountResponse.builder()
                            .eligible(false)
                            .memberId(memberId)
                            .memberName(member.getUser().getFullName())
                            .status("INACTIVE")
                            .build()));
        }

        Membership m = activeMemOpt.get();
        String cat = m.getPlan().getCategory();

        double shopDiscount = "GOLD".equalsIgnoreCase(cat) ? 15.0 : ("SILVER".equalsIgnoreCase(cat) ? 10.0 : 5.0);
        double cafeDiscount = "GOLD".equalsIgnoreCase(cat) ? 10.0 : ("SILVER".equalsIgnoreCase(cat) ? 5.0 : 0.0);

        MemberDiscountResponse response = MemberDiscountResponse.builder()
                .eligible(true)
                .memberId(memberId)
                .memberName(member.getUser().getFullName())
                .planCategory(cat)
                .sportsShopDiscountPercent(shopDiscount)
                .cafeBarDiscountPercent(cafeDiscount)
                .status("ACTIVE")
                .build();

        return ResponseEntity.ok(ApiResponse.success("Discounts calculated", response));
    }

    // =========================================================================
    // ANISH'S INTEGRATION: Finance, Payroll Expenses, & Analytics Dashboard
    // =========================================================================

    @GetMapping("/finance/membership-transactions")
    @Operation(summary = "Anish: Retrieve membership payment transactions for financial ledger")
    public ResponseEntity<ApiResponse<List<MembershipTransaction>>> getTransactionsForPeriod(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        LocalDateTime start = (startDate != null) ? startDate : LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = (endDate != null) ? endDate : LocalDateTime.now();

        List<MembershipTransaction> list = transactionRepository.findByPaidAtBetween(start, end);
        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved", list));
    }

    @GetMapping("/finance/salary-expenses")
    @Operation(summary = "Anish: Retrieve monthly payroll expense records for finance reporting")
    public ResponseEntity<ApiResponse<List<SalaryResponseDto>>> getPayrollExpenses(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year != null) ? year : LocalDate.now().getYear();

        List<SalaryResponseDto> records = salaryService.getSalaryRecordsForPeriod(m, y);
        return ResponseEntity.ok(ApiResponse.success("Payroll records retrieved", records));
    }

    @GetMapping("/analytics/club-summary")
    @Operation(summary = "Anish: Retrieve club-wide KPI counts for centralized Admin Dashboard")
    public ResponseEntity<ApiResponse<ClubIntegrationSummary>> getClubSummary() {
        long totalUsers = userRepository.count();
        long totalMembers = memberRepository.count();
        long activeMembers = membershipRepository.countByStatus("ACTIVE");
        long expiredMembers = membershipRepository.countByStatus("EXPIRED");
        long totalStaff = employeeRepository.count();
        long activeStaff = employeeRepository.countByEmploymentStatus("ACTIVE");

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        BigDecimal monthlyRev = transactionRepository.sumRevenueBetween(startOfMonth, LocalDateTime.now());
        BigDecimal monthlyPayroll = salaryRecordRepository.sumPaidSalaryForPeriod(LocalDate.now().getMonthValue(), LocalDate.now().getYear());

        ClubIntegrationSummary summary = ClubIntegrationSummary.builder()
                .totalUsers(totalUsers)
                .totalMembers(totalMembers)
                .activeMembers(activeMembers)
                .expiredMembers(expiredMembers)
                .totalEmployees(totalStaff)
                .activeEmployees(activeStaff)
                .monthlyMembershipRevenue(monthlyRev)
                .monthlyPayrollExpense(monthlyPayroll)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Club summary retrieved", summary));
    }
}
