package com.clubsphere.service;

import com.clubsphere.dto.finance.*;
import com.clubsphere.model.AuditLog;
import com.clubsphere.model.Expense;
import com.clubsphere.model.Notification;
import com.clubsphere.model.Payment;
import com.clubsphere.repository.AuditLogRepository;
import com.clubsphere.repository.ExpenseRepository;
import com.clubsphere.repository.NotificationRepository;
import com.clubsphere.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceService {

    private final PaymentRepository paymentRepository;
    private final ExpenseRepository expenseRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    // =========================================================================
    // 1. FINANCE DASHBOARD
    // =========================================================================

    public FinanceDashboardDto getFinanceDashboard(String filter, LocalDate customStart, LocalDate customEnd) {
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate;

        String period = filter != null ? filter.toUpperCase() : "THIS_MONTH";
        switch (period) {
            case "TODAY" -> {
                startDate = today;
                endDate = today;
            }
            case "THIS_WEEK" -> {
                startDate = today.with(DayOfWeek.MONDAY);
                endDate = today.with(DayOfWeek.SUNDAY);
            }
            case "THIS_MONTH" -> {
                startDate = today.withDayOfMonth(1);
                endDate = today.withDayOfMonth(today.lengthOfMonth());
            }
            case "THIS_YEAR" -> {
                startDate = today.withDayOfYear(1);
                endDate = today.withDayOfYear(today.lengthOfYear());
            }
            case "CUSTOM" -> {
                startDate = customStart != null ? customStart : today.minusMonths(1);
                endDate = customEnd != null ? customEnd : today;
            }
            default -> {
                period = "THIS_MONTH";
                startDate = today.withDayOfMonth(1);
                endDate = today.withDayOfMonth(today.lengthOfMonth());
            }
        }

        OffsetDateTime startOffset = startDate.atStartOfDay().atOffset(ZoneOffset.ofHoursMinutes(5, 30));
        OffsetDateTime endOffset = endDate.atTime(LocalTime.MAX).atOffset(ZoneOffset.ofHoursMinutes(5, 30));

        // Period Metrics
        BigDecimal totalRevenue = paymentRepository.sumRevenueBetween(startOffset, endOffset);
        BigDecimal totalExpenses = expenseRepository.sumExpensesBetween(startDate, endDate);
        BigDecimal netProfit = totalRevenue.subtract(totalExpenses);
        BigDecimal pendingAmount = paymentRepository.sumPendingAmountBetween(startOffset, endOffset);
        BigDecimal totalRefunds = paymentRepository.sumRefundsBetween(startOffset, endOffset);

        // Today & Monthly Revenue
        OffsetDateTime todayStart = today.atStartOfDay().atOffset(ZoneOffset.ofHoursMinutes(5, 30));
        OffsetDateTime todayEnd = today.atTime(LocalTime.MAX).atOffset(ZoneOffset.ofHoursMinutes(5, 30));
        BigDecimal todayRevenue = paymentRepository.sumRevenueBetween(todayStart, todayEnd);

        OffsetDateTime monthStart = today.withDayOfMonth(1).atStartOfDay().atOffset(ZoneOffset.ofHoursMinutes(5, 30));
        OffsetDateTime monthEnd = today.withDayOfMonth(today.lengthOfMonth()).atTime(LocalTime.MAX).atOffset(ZoneOffset.ofHoursMinutes(5, 30));
        BigDecimal monthlyRevenue = paymentRepository.sumRevenueBetween(monthStart, monthEnd);

        // Payments in period for breakdowns & counts
        List<Payment> periodPayments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset);

        long completedCount = periodPayments.stream().filter(p -> "COMPLETED".equalsIgnoreCase(p.getPaymentStatus())).count();
        long pendingCount = periodPayments.stream().filter(p -> "PENDING".equalsIgnoreCase(p.getPaymentStatus())).count();
        long failedCount = periodPayments.stream().filter(p -> "FAILED".equalsIgnoreCase(p.getPaymentStatus())).count();
        long refundedCount = periodPayments.stream().filter(p -> "REFUNDED".equalsIgnoreCase(p.getPaymentStatus()) || "PARTIALLY_REFUNDED".equalsIgnoreCase(p.getPaymentStatus())).count();

        // Revenue by Module Breakdown (Completed only)
        Map<String, BigDecimal> revenueByModule = periodPayments.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                .collect(Collectors.groupingBy(
                        Payment::getSourceModule,
                        Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)
                ));

        // Revenue by Payment Method Breakdown
        Map<String, BigDecimal> revenueByMethod = periodPayments.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                .collect(Collectors.groupingBy(
                        Payment::getPaymentMethod,
                        Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)
                ));

        // Expenses by Category Breakdown
        List<Object[]> expenseRows = expenseRepository.sumExpensesGroupedByCategoryBetween(startDate, endDate);
        Map<String, BigDecimal> expensesByCategory = new HashMap<>();
        for (Object[] row : expenseRows) {
            expensesByCategory.put((String) row[0], (BigDecimal) row[1]);
        }

        // Recent 5 payments
        List<Payment> recentPayments = paymentRepository.findAllByOrderByPaymentDateDesc().stream().limit(6).toList();

        // Active Finance Alerts (from Notifications)
        List<Notification> activeAlerts = notificationRepository.findAllOrderByCreatedAtDesc().stream()
                .filter(n -> "FINANCE".equalsIgnoreCase(n.getCategory()))
                .limit(5)
                .toList();

        return FinanceDashboardDto.builder()
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .monthlyRevenue(monthlyRevenue)
                .totalExpenses(totalExpenses)
                .netProfit(netProfit)
                .pendingAmount(pendingAmount)
                .totalRefunds(totalRefunds)
                .totalCompletedCount(completedCount)
                .totalPendingCount(pendingCount)
                .totalFailedCount(failedCount)
                .totalRefundedCount(refundedCount)
                .filterPeriod(period)
                .startDate(startDate)
                .endDate(endDate)
                .revenueByModule(revenueByModule)
                .revenueByPaymentMethod(revenueByMethod)
                .expensesByCategory(expensesByCategory)
                .recentPayments(recentPayments)
                .activeAlerts(activeAlerts)
                .build();
    }

    // =========================================================================
    // 2. PAYMENT TRACKING
    // =========================================================================

    public List<Payment> searchPayments(String search, String source, String method, String status, LocalDate startDate, LocalDate endDate) {
        OffsetDateTime startOffset = startDate != null ? startDate.atStartOfDay().atOffset(ZoneOffset.ofHoursMinutes(5, 30)) : null;
        OffsetDateTime endOffset = endDate != null ? endDate.atTime(LocalTime.MAX).atOffset(ZoneOffset.ofHoursMinutes(5, 30)) : null;

        List<Payment> list = paymentRepository.findAllByOrderByPaymentDateDesc();

        return list.stream().filter(p -> {
            if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase(p.getPaymentStatus())) return false;
            if (source != null && !source.trim().isEmpty() && !source.equalsIgnoreCase(p.getSourceModule())) return false;
            if (method != null && !method.trim().isEmpty() && !method.equalsIgnoreCase(p.getPaymentMethod())) return false;
            if (startOffset != null && p.getPaymentDate() != null && p.getPaymentDate().isBefore(startOffset)) return false;
            if (endOffset != null && p.getPaymentDate() != null && p.getPaymentDate().isAfter(endOffset)) return false;
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean match = (p.getPaymentReference() != null && p.getPaymentReference().toLowerCase().contains(q)) ||
                                (p.getTransactionId() != null && p.getTransactionId().toLowerCase().contains(q)) ||
                                (p.getPayerName() != null && p.getPayerName().toLowerCase().contains(q)) ||
                                (p.getPayerEmail() != null && p.getPayerEmail().toLowerCase().contains(q)) ||
                                (p.getNotes() != null && p.getNotes().toLowerCase().contains(q));
                if (!match) return false;
            }
            return true;
        }).toList();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found with id: " + id));
    }

    @Transactional
    public Payment processRefund(Long paymentId, RefundRequestDto request, String adminUsername) {
        Payment payment = getPaymentById(paymentId);

        if ("REFUNDED".equalsIgnoreCase(payment.getPaymentStatus())) {
            throw new IllegalStateException("Payment has already been fully refunded.");
        }

        BigDecimal refundAmt = request.getRefundAmount() != null ? request.getRefundAmount() : payment.getAmount();
        if (refundAmt.compareTo(payment.getAmount()) > 0) {
            throw new IllegalArgumentException("Refund amount cannot exceed payment amount of ₹" + payment.getAmount());
        }

        boolean isPartial = refundAmt.compareTo(payment.getAmount()) < 0;
        payment.setRefundAmount(refundAmt);
        payment.setRefundReason(request.getRefundReason() != null ? request.getRefundReason() : "Administrative refund approved");
        payment.setPaymentStatus(isPartial ? "PARTIALLY_REFUNDED" : "REFUNDED");
        payment.setUpdatedAt(OffsetDateTime.now());

        Payment saved = paymentRepository.save(payment);

        // Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action(isPartial ? "PROCESS_PARTIAL_REFUND" : "PROCESS_REFUND")
                .entityName("Payment")
                .entityId(payment.getId())
                .performedBy(adminUsername)
                .details(String.format("Processed %s refund of ₹%s for reference %s. Reason: %s",
                        isPartial ? "partial" : "full", refundAmt, payment.getPaymentReference(), payment.getRefundReason()))
                .ipAddress("127.0.0.1")
                .createdAt(OffsetDateTime.now())
                .build());

        // Notifications
        if (payment.getUserId() != null) {
            notificationService.createNotification(
                    payment.getUserId(),
                    "ROLE_MEMBER",
                    "Refund Processed",
                    String.format("A refund of ₹%s for transaction %s has been credited back to your account.", refundAmt, payment.getTransactionId()),
                    "REFUND",
                    "FINANCE",
                    "MEDIUM",
                    "Payment",
                    payment.getId(),
                    "/member/payments"
            );
        }

        notificationService.notifyAdmins(
                "Refund Issued: " + payment.getPaymentReference(),
                String.format("Admin %s issued ₹%s refund for %s (%s)", adminUsername, refundAmt, payment.getPayerName(), payment.getSourceModule()),
                "REFUND",
                "FINANCE",
                "HIGH",
                "Payment",
                payment.getId(),
                "/admin/payments"
        );

        return saved;
    }

    @Transactional
    public Payment simulatePayment(Payment payment, String username) {
        String ref = "PAY-2026-" + String.format("%05d", (int)(Math.random() * 90000 + 10000));
        String txn = "TXN-DEMO-" + System.currentTimeMillis();

        payment.setPaymentReference(ref);
        payment.setTransactionId(txn);
        payment.setIsDemo(true);
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(OffsetDateTime.now());
        }
        if (payment.getPaymentStatus() == null) {
            payment.setPaymentStatus("COMPLETED");
        }

        Payment saved = paymentRepository.save(payment);

        auditLogRepository.save(AuditLog.builder()
                .action("SIMULATE_PAYMENT")
                .entityName("Payment")
                .entityId(saved.getId())
                .performedBy(username != null ? username : "System")
                .details(String.format("Simulated DEMO payment of ₹%s via %s for %s", saved.getAmount(), saved.getPaymentMethod(), saved.getSourceModule()))
                .ipAddress("127.0.0.1")
                .createdAt(OffsetDateTime.now())
                .build());

        return saved;
    }

    // =========================================================================
    // 3. EXPENSE MANAGEMENT
    // =========================================================================

    public List<Expense> getExpenses(String category, String method, LocalDate start, LocalDate end, String search) {
        List<Expense> list = expenseRepository.findAllByOrderByExpenseDateDesc();

        return list.stream().filter(e -> {
            if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase(e.getCategory())) return false;
            if (method != null && !method.trim().isEmpty() && !method.equalsIgnoreCase(e.getPaymentMethod())) return false;
            if (start != null && e.getExpenseDate() != null && e.getExpenseDate().isBefore(start)) return false;
            if (end != null && e.getExpenseDate() != null && e.getExpenseDate().isAfter(end)) return false;
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean match = (e.getDescription() != null && e.getDescription().toLowerCase().contains(q)) ||
                                (e.getExpenseReference() != null && e.getExpenseReference().toLowerCase().contains(q)) ||
                                (e.getVendorName() != null && e.getVendorName().toLowerCase().contains(q));
                if (!match) return false;
            }
            return true;
        }).toList();
    }

    @Transactional
    public Expense createExpense(ExpenseDto dto, Long userId, String username) {
        String ref = "EXP-2026-" + String.format("%03d", (int)(Math.random() * 900 + 100));

        Expense expense = Expense.builder()
                .expenseReference(ref)
                .category(dto.getCategory() != null ? dto.getCategory() : "OTHER")
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .expenseDate(dto.getExpenseDate() != null ? dto.getExpenseDate() : LocalDate.now())
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "BANK_TRANSFER")
                .vendorName(dto.getVendorName())
                .receiptUrl(dto.getReceiptUrl())
                .recordedByUserId(userId)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        Expense saved = expenseRepository.save(expense);

        auditLogRepository.save(AuditLog.builder()
                .action("CREATE_EXPENSE")
                .entityName("Expense")
                .entityId(saved.getId())
                .performedBy(username)
                .details(String.format("Recorded expense %s of ₹%s for %s (%s)", saved.getExpenseReference(), saved.getAmount(), saved.getCategory(), saved.getDescription()))
                .ipAddress("127.0.0.1")
                .createdAt(OffsetDateTime.now())
                .build());

        notificationService.notifyAdmins(
                "New Expense Logged: " + saved.getExpenseReference(),
                String.format("Recorded ₹%s for %s (%s)", saved.getAmount(), saved.getCategory(), saved.getDescription()),
                "EXPENSE",
                "FINANCE",
                "MEDIUM",
                "Expense",
                saved.getId(),
                "/admin/expenses"
        );

        return saved;
    }

    @Transactional
    public Expense updateExpense(Long id, ExpenseDto dto, String username) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found with id: " + id));

        expense.setCategory(dto.getCategory());
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        if (dto.getExpenseDate() != null) expense.setExpenseDate(dto.getExpenseDate());
        if (dto.getPaymentMethod() != null) expense.setPaymentMethod(dto.getPaymentMethod());
        expense.setVendorName(dto.getVendorName());
        expense.setReceiptUrl(dto.getReceiptUrl());
        expense.setUpdatedAt(OffsetDateTime.now());

        Expense saved = expenseRepository.save(expense);

        auditLogRepository.save(AuditLog.builder()
                .action("UPDATE_EXPENSE")
                .entityName("Expense")
                .entityId(saved.getId())
                .performedBy(username)
                .details(String.format("Updated expense %s to ₹%s", saved.getExpenseReference(), saved.getAmount()))
                .ipAddress("127.0.0.1")
                .createdAt(OffsetDateTime.now())
                .build());

        return saved;
    }

    @Transactional
    public void deleteExpense(Long id, String username) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found with id: " + id));

        auditLogRepository.save(AuditLog.builder()
                .action("DELETE_EXPENSE")
                .entityName("Expense")
                .entityId(expense.getId())
                .performedBy(username)
                .details(String.format("Deleted expense %s of ₹%s (%s)", expense.getExpenseReference(), expense.getAmount(), expense.getCategory()))
                .ipAddress("127.0.0.1")
                .createdAt(OffsetDateTime.now())
                .build());

        expenseRepository.delete(expense);
    }

    // =========================================================================
    // 4. FINANCIAL REPORTS (12 DISTINCT REPORTS)
    // =========================================================================

    public FinancialReportDto generateReport(String reportType, LocalDate startDate, LocalDate endDate, String category) {
        LocalDate today = LocalDate.now();
        LocalDate start = startDate != null ? startDate : today.withDayOfMonth(1);
        LocalDate end = endDate != null ? endDate : today;

        OffsetDateTime startOffset = start.atStartOfDay().atOffset(ZoneOffset.ofHoursMinutes(5, 30));
        OffsetDateTime endOffset = end.atTime(LocalTime.MAX).atOffset(ZoneOffset.ofHoursMinutes(5, 30));

        String type = reportType != null ? reportType.toUpperCase() : "PROFIT_AND_LOSS";
        List<?> rows;
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        BigDecimal totalRefunds = BigDecimal.ZERO;
        BigDecimal pendingAmt = BigDecimal.ZERO;
        String title;

        switch (type) {
            case "DAILY_REVENUE" -> {
                title = "Daily Revenue Audit Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "WEEKLY_REVENUE" -> {
                title = "Weekly Revenue Consolidated Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "MONTHLY_REVENUE" -> {
                title = "Monthly Revenue Breakdown Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "YEARLY_REVENUE" -> {
                title = "Annual Comprehensive Revenue Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "MEMBERSHIP_REVENUE" -> {
                title = "Membership Subscriptions & Renewals Revenue Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> p.getSourceModule().startsWith("MEMBERSHIP") && "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "COURT_BOOKING_REVENUE" -> {
                title = "Court Booking & Green Fee Revenue Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "COURT_BOOKING".equalsIgnoreCase(p.getSourceModule()) && "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "SPORTS_SHOP_SALES" -> {
                title = "Pro Sports Shop Equipment Sales Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "SPORTS_SHOP".equalsIgnoreCase(p.getSourceModule()) && "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "FOOD_SHOP_SALES" -> {
                title = "Club Cafe & Nutrition Lounge Sales Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "FOOD_BEVERAGE".equalsIgnoreCase(p.getSourceModule()) && "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "EXPENSE_REPORT" -> {
                title = "Comprehensive Operational Expenses Report";
                List<Expense> expenses = expenseRepository.filterExpenses(category, null, start, end);
                totalExpense = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = expenses;
            }
            case "PENDING_PAYMENTS" -> {
                title = "Outstanding & Pending Payments Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "PENDING".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                pendingAmt = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            case "REFUND_REPORT" -> {
                title = "Customer Refunds & Adjustments Report";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "REFUNDED".equalsIgnoreCase(p.getPaymentStatus()) || "PARTIALLY_REFUNDED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                totalRefunds = payments.stream().map(Payment::getRefundAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
            default -> { // PROFIT_AND_LOSS
                type = "PROFIT_AND_LOSS";
                title = "Consolidated Statement of Profit and Loss";
                List<Payment> payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOffset, endOffset).stream()
                        .filter(p -> "COMPLETED".equalsIgnoreCase(p.getPaymentStatus()))
                        .toList();
                List<Expense> expenses = expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(start, end);

                totalIncome = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                totalExpense = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                rows = payments;
            }
        }

        BigDecimal netProfit = totalIncome.subtract(totalExpense);

        return FinancialReportDto.builder()
                .reportType(type)
                .reportTitle(title)
                .startDate(start)
                .endDate(end)
                .category(category)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netProfit(netProfit)
                .totalRefunds(totalRefunds)
                .pendingAmount(pendingAmt)
                .totalRecordsCount(rows.size())
                .detailedRows(rows)
                .build();
    }

    // =========================================================================
    // 5. PAYMENT RECONCILIATION
    // =========================================================================

    public ReconciliationDto getReconciliationData() {
        List<Payment> all = paymentRepository.findAllByOrderByPaymentDateDesc();

        List<Payment> online = all.stream().filter(p -> !"CASH".equalsIgnoreCase(p.getPaymentMethod()) && "COMPLETED".equalsIgnoreCase(p.getPaymentStatus())).toList();
        List<Payment> cash = all.stream().filter(p -> "CASH".equalsIgnoreCase(p.getPaymentMethod()) && "COMPLETED".equalsIgnoreCase(p.getPaymentStatus())).toList();
        List<Payment> refunds = all.stream().filter(p -> "REFUNDED".equalsIgnoreCase(p.getPaymentStatus()) || "PARTIALLY_REFUNDED".equalsIgnoreCase(p.getPaymentStatus())).toList();
        List<Payment> pendingReview = all.stream().filter(p -> "PENDING".equalsIgnoreCase(p.getPaymentStatus()) || "FAILED".equalsIgnoreCase(p.getPaymentStatus())).toList();

        BigDecimal onlineTotal = online.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal cashTotal = cash.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal refundTotal = refunds.stream().map(Payment::getRefundAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        return ReconciliationDto.builder()
                .totalOnlinePayments(onlineTotal)
                .totalCashPayments(cashTotal)
                .totalRefunds(refundTotal)
                .totalDiscrepancy(BigDecimal.ZERO)
                .totalOnlineCount(online.size())
                .totalCashCount(cash.size())
                .totalRefundedCount(refunds.size())
                .pendingReviewCount(pendingReview.size())
                .cashTransactions(cash)
                .pendingOrDiscrepantTransactions(pendingReview)
                .build();
    }

    // =========================================================================
    // 6. STUDENT PORTAL (OWN PAYMENTS & RECEIPTS)
    // =========================================================================

    public List<Payment> getStudentPayments(Long userId) {
        return paymentRepository.findByUserIdOrderByPaymentDateDesc(userId);
    }
}
