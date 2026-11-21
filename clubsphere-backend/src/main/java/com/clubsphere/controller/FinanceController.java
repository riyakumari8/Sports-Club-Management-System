package com.clubsphere.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.dto.finance.*;
import com.clubsphere.model.Expense;
import com.clubsphere.model.Payment;
import com.clubsphere.security.UserDetailsImpl;
import com.clubsphere.service.FinanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@Slf4j
@Tag(name = "Finance & Accounting", description = "Finance dashboard, unified payment tracking, expenses, 12 reports, and reconciliation")
public class FinanceController {

    private final FinanceService financeService;

    // =========================================================================
    // 1. FINANCE DASHBOARD
    // =========================================================================

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get aggregated finance metrics and summaries")
    public ResponseEntity<ApiResponse<FinanceDashboardDto>> getDashboard(
            @RequestParam(required = false, defaultValue = "THIS_MONTH") String filter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        FinanceDashboardDto dto = financeService.getFinanceDashboard(filter, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Finance dashboard data retrieved", dto));
    }

    // =========================================================================
    // 2. PAYMENT TRACKING
    // =========================================================================

    @GetMapping("/payments")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Search and filter unified payment transactions across all modules")
    public ResponseEntity<ApiResponse<List<Payment>>> searchPayments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String method,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<Payment> list = financeService.searchPayments(search, source, method, status, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved", list));
    }

    @GetMapping("/payments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get full details of a specific payment")
    public ResponseEntity<ApiResponse<Payment>> getPaymentById(@PathVariable Long id) {
        Payment payment = financeService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success("Payment details retrieved", payment));
    }

    @PostMapping("/payments/{id}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Process full or partial refund for a payment")
    public ResponseEntity<ApiResponse<Payment>> processRefund(
            @PathVariable Long id,
            @Valid @RequestBody RefundRequestDto request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String adminUsername = userDetails != null ? userDetails.getUsername() : "admin";
        Payment refunded = financeService.processRefund(id, request, adminUsername);
        return ResponseEntity.ok(ApiResponse.success("Refund processed successfully", refunded));
    }

    @PostMapping("/payments/simulate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Simulate a demo payment transaction across any module for evaluation")
    public ResponseEntity<ApiResponse<Payment>> simulatePayment(
            @RequestBody Payment payment,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        Payment simulated = financeService.simulatePayment(payment, username);
        return ResponseEntity.ok(ApiResponse.success("Demo payment created successfully", simulated));
    }

    // =========================================================================
    // 3. OPERATIONAL EXPENSES
    // =========================================================================

    @GetMapping("/expenses")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "List expenses filtered by category, method, date, or search term")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search
    ) {
        List<Expense> expenses = financeService.getExpenses(category, paymentMethod, startDate, endDate, search);
        return ResponseEntity.ok(ApiResponse.success("Expenses retrieved", expenses));
    }

    @PostMapping("/expenses")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Record a new operational expense")
    public ResponseEntity<ApiResponse<Expense>> createExpense(
            @Valid @RequestBody ExpenseDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        String username = userDetails != null ? userDetails.getUsername() : "admin";
        Expense expense = financeService.createExpense(dto, userId, username);
        return ResponseEntity.ok(ApiResponse.success("Expense recorded successfully", expense));
    }

    @PutMapping("/expenses/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Update an existing operational expense")
    public ResponseEntity<ApiResponse<Expense>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "admin";
        Expense updated = financeService.updateExpense(id, dto, username);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", updated));
    }

    @DeleteMapping("/expenses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an operational expense record")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "admin";
        financeService.deleteExpense(id, username);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }

    // =========================================================================
    // 4. FINANCIAL REPORTS (12 DISTINCT REPORTS)
    // =========================================================================

    @GetMapping("/reports/{reportType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Generate one of 12 distinct financial reports with aggregated KPIs and transaction rows")
    public ResponseEntity<ApiResponse<FinancialReportDto>> getReport(
            @PathVariable String reportType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category
    ) {
        FinancialReportDto report = financeService.generateReport(reportType, startDate, endDate, category);
        return ResponseEntity.ok(ApiResponse.success("Report generated successfully", report));
    }

    // =========================================================================
    // 5. PAYMENT RECONCILIATION
    // =========================================================================

    @GetMapping("/reconciliation")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get daily & monthly payment reconciliation (Online vs Cash vs Discrepancies)")
    public ResponseEntity<ApiResponse<ReconciliationDto>> getReconciliation() {
        ReconciliationDto dto = financeService.getReconciliationData();
        return ResponseEntity.ok(ApiResponse.success("Reconciliation data retrieved", dto));
    }

    // =========================================================================
    // 6. STUDENT PORTAL (MY PAYMENTS & RECEIPTS)
    // =========================================================================

    @GetMapping("/my-payments")
    @Operation(summary = "Get logged in user's payment history and digital receipts")
    public ResponseEntity<ApiResponse<List<Payment>>> getMyPayments(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.ok(ApiResponse.success("No active user", List.of()));
        }
        List<Payment> list = financeService.getStudentPayments(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Payment history retrieved", list));
    }
}
