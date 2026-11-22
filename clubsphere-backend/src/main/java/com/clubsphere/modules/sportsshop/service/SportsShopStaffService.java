package com.clubsphere.modules.sportsshop.service;

import com.clubsphere.exception.BadRequestException;
import com.clubsphere.exception.ResourceNotFoundException;
import com.clubsphere.modules.membership.entity.Membership;
import com.clubsphere.modules.membership.repository.MembershipRepository;
import com.clubsphere.modules.sportsshop.entity.*;
import com.clubsphere.modules.sportsshop.repository.*;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SportsShopStaffService {

    private final SportsProductRepository productRepository;
    private final SportsProductVariantRepository variantRepository;
    private final SportsCategoryRepository categoryRepository;
    private final SportsInventoryMovementRepository movementRepository;
    private final SportsOrderRepository orderRepository;
    private final SportsOrderItemRepository orderItemRepository;
    private final SportsReturnRepository returnRepository;
    private final SportsCounterSaleRepository counterSaleRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    @Transactional(readOnly = true)
    public List<SportsProduct> getProducts(Integer categoryId, String search) {
        List<SportsProduct> list = productRepository.findAll();
        return list.stream()
                .filter(p -> categoryId == null || (p.getCategory() != null && p.getCategory().getId().equals(categoryId)))
                .filter(p -> search == null || search.isBlank() ||
                        (p.getName() != null && p.getName().toLowerCase().contains(search.toLowerCase())) ||
                        (p.getBrand() != null && p.getBrand().toLowerCase().contains(search.toLowerCase())) ||
                        (p.getSku() != null && p.getSku().toLowerCase().contains(search.toLowerCase())))
                .sorted(Comparator.comparing(SportsProduct::getName))
                .toList();
    }

    @Transactional(readOnly = true)
    public SportsProduct getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sports product not found: " + id));
    }

    @Transactional
    public SportsProduct updateProduct(Long id, Map<String, Object> req, Long userId) {
        SportsProduct product = getProductById(id);
        if (req.containsKey("isActive")) {
            product.setIsActive(Boolean.valueOf(req.get("isActive").toString()));
        }
        if (req.containsKey("reorderLevel")) {
            product.setReorderLevel(Integer.parseInt(req.get("reorderLevel").toString()));
        }
        if (req.containsKey("description")) {
            product.setDescription(req.get("description").toString());
        }
        if (req.containsKey("sellingPrice")) {
            product.setSellingPrice(new BigDecimal(req.get("sellingPrice").toString()));
        }
        product.setUpdatedAt(OffsetDateTime.now());
        return productRepository.save(product);
    }

    @Transactional
    public SportsInventoryMovement adjustStock(Long productId, Integer quantityChange, String movementType, String reason, Long userId) {
        SportsProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sports product not found: " + productId));

        int before = product.getStockQuantity();
        int after = before + quantityChange;
        if (after < 0) {
            throw new BadRequestException("Insufficient stock! Available: " + before + ", change: " + quantityChange);
        }

        product.setStockQuantity(after);
        product.setUpdatedAt(OffsetDateTime.now());
        productRepository.save(product);

        User user = userRepository.findById(userId).orElse(null);

        SportsInventoryMovement movement = SportsInventoryMovement.builder()
                .product(product)
                .movementType(movementType != null ? movementType : "CORRECTION")
                .quantity(quantityChange)
                .stockBefore(before)
                .stockAfter(after)
                .reason(reason != null ? reason : "Manual staff stock adjustment")
                .performedBy(user)
                .createdAt(OffsetDateTime.now())
                .build();

        return movementRepository.save(movement);
    }

    @Transactional(readOnly = true)
    public List<SportsInventoryMovement> getRecentMovements() {
        return movementRepository.findTop30ByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<SportsOrder> getOrders(String status, String search) {
        List<SportsOrder> list = orderRepository.findAll();
        return list.stream()
                .filter(o -> status == null || status.isBlank() || o.getOrderStatus().equalsIgnoreCase(status))
                .filter(o -> search == null || search.isBlank() ||
                        (o.getOrderNumber() != null && o.getOrderNumber().toLowerCase().contains(search.toLowerCase())) ||
                        (o.getCustomerName() != null && o.getCustomerName().toLowerCase().contains(search.toLowerCase())) ||
                        (o.getCustomerPhone() != null && o.getCustomerPhone().contains(search)))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public SportsOrder getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sports order not found: " + id));
    }

    /**
     * Atomic status transition with concurrency protection.
     * Prevents two staff members from simultaneously accepting the same order.
     */
    @Transactional
    public synchronized SportsOrder updateOrderStatus(Long orderId, String newStatus, String notes, Long userId) {
        SportsOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sports order not found: " + orderId));

        String currentStatus = order.getOrderStatus();
        String targetStatus = newStatus.trim().toUpperCase();

        if (currentStatus.equalsIgnoreCase(targetStatus)) {
            return order; // No-op idempotent
        }

        // Validate allowed workflow progression
        boolean validTransition = false;
        switch (currentStatus) {
            case "NEW":
            case "PLACED":
                validTransition = List.of("ACCEPTED", "REJECTED", "CANCELLED").contains(targetStatus);
                break;
            case "ACCEPTED":
                validTransition = List.of("PACKING", "CANCELLED").contains(targetStatus);
                break;
            case "PACKING":
                validTransition = List.of("READY_FOR_PICKUP", "DISPATCHED", "CANCELLED").contains(targetStatus);
                break;
            case "READY_FOR_PICKUP":
                validTransition = List.of("DISPATCHED", "COMPLETED").contains(targetStatus);
                break;
            case "DISPATCHED":
                validTransition = "COMPLETED".equals(targetStatus);
                break;
            default:
                validTransition = false;
        }

        if (!validTransition) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + targetStatus);
        }

        Employee emp = employeeRepository.findByUserId(userId).orElse(null);
        order.setOrderStatus(targetStatus);
        order.setAssignedStaff(emp);
        order.setUpdatedAt(OffsetDateTime.now());

        if (notes != null && !notes.isBlank()) {
            order.setNotes(order.getNotes() != null ? order.getNotes() + " | " + notes : notes);
        }

        return orderRepository.save(order);
    }

    /**
     * Server-side in-store counter sale POS.
     * Validates active membership for discount (Gold 15%, Silver 10%, Junior 5%).
     * Atomically deducts product stock.
     */
    @Transactional
    public Map<String, Object> createCounterSale(Map<String, Object> req, Long userId) {
        String customerName = req.getOrDefault("customerName", "Walk-in Customer").toString();
        String customerEmail = (String) req.get("customerEmail");
        String customerPhone = (String) req.get("customerPhone");
        String paymentMethod = req.getOrDefault("paymentMethod", "CASH").toString();

        List<Map<String, Object>> itemsList = (List<Map<String, Object>>) req.get("items");
        if (itemsList == null || itemsList.isEmpty()) {
            throw new BadRequestException("Sale must contain at least one item");
        }

        // Membership discount determination (strictly server-side)
        String membershipTier = "NON_MEMBER";
        BigDecimal discountPercent = BigDecimal.ZERO;

        if (customerEmail != null && !customerEmail.isBlank()) {
            Optional<Membership> activeMembership = membershipRepository.findActiveByMemberEmail(customerEmail.trim().toLowerCase());
            if (activeMembership.isPresent()) {
                Membership m = activeMembership.get();
                String planName = m.getPlan().getName().toUpperCase();
                if (planName.contains("GOLD")) {
                    membershipTier = "GOLD";
                    discountPercent = BigDecimal.valueOf(15.0);
                } else if (planName.contains("SILVER")) {
                    membershipTier = "SILVER";
                    discountPercent = BigDecimal.valueOf(10.0);
                } else if (planName.contains("JUNIOR")) {
                    membershipTier = "JUNIOR";
                    discountPercent = BigDecimal.valueOf(5.0);
                }
            }
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<SportsOrderItem> orderItems = new ArrayList<>();

        // Generate Order Number
        String orderNumber = "SP-POS-" + System.currentTimeMillis() % 1000000;
        Employee emp = employeeRepository.findByUserId(userId).orElse(null);

        SportsOrder order = SportsOrder.builder()
                .orderNumber(orderNumber)
                .customerName(customerName)
                .customerEmail(customerEmail)
                .customerPhone(customerPhone)
                .membershipTier(membershipTier)
                .membershipDiscountPercent(discountPercent)
                .paymentMethod(paymentMethod)
                .paymentStatus("COMPLETED")
                .orderStatus("COMPLETED")
                .fulfilmentType("COUNTER")
                .assignedStaff(emp)
                .subtotal(BigDecimal.ZERO) // updated below
                .totalAmount(BigDecimal.ZERO)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        SportsOrder savedOrder = orderRepository.save(order);

        for (Map<String, Object> itemData : itemsList) {
            Long productId = Long.parseLong(itemData.get("productId").toString());
            int qty = Integer.parseInt(itemData.get("quantity").toString());

            SportsProduct product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

            if (product.getStockQuantity() < qty) {
                throw new BadRequestException("Not enough stock for " + product.getName() + " (Available: " + product.getStockQuantity() + ")");
            }

            // Deduct stock atomically
            int newStock = product.getStockQuantity() - qty;
            product.setStockQuantity(newStock);
            productRepository.save(product);

            // Record inventory movement
            movementRepository.save(SportsInventoryMovement.builder()
                    .product(product)
                    .movementType("CUSTOMER_PURCHASE")
                    .quantity(-qty)
                    .stockBefore(newStock + qty)
                    .stockAfter(newStock)
                    .reason("Counter POS Sale #" + orderNumber)
                    .performedBy(userRepository.findById(userId).orElse(null))
                    .createdAt(OffsetDateTime.now())
                    .build());

            BigDecimal itemTotal = product.getSellingPrice().multiply(BigDecimal.valueOf(qty));
            subtotal = subtotal.add(itemTotal);

            SportsOrderItem orderItem = SportsOrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .productName(product.getName())
                    .unitPrice(product.getSellingPrice())
                    .quantity(qty)
                    .totalPrice(itemTotal)
                    .build();
            orderItems.add(orderItemRepository.save(orderItem));
        }

        BigDecimal discountAmount = subtotal.multiply(discountPercent).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.subtract(discountAmount);

        savedOrder.setSubtotal(subtotal);
        savedOrder.setDiscountAmount(discountAmount);
        savedOrder.setTotalAmount(totalAmount);
        savedOrder.setItems(orderItems);
        orderRepository.save(savedOrder);

        // Record Counter Sale
        String saleNumber = "CS-SALE-" + System.currentTimeMillis() % 1000000;
        String receiptNumber = "RCP-SP-" + (100000 + new Random().nextInt(900000));
        SportsCounterSale counterSale = SportsCounterSale.builder()
                .saleNumber(saleNumber)
                .order(savedOrder)
                .staff(emp)
                .totalAmount(totalAmount)
                .paymentMethod(paymentMethod)
                .receiptNumber(receiptNumber)
                .createdAt(OffsetDateTime.now())
                .build();
        counterSaleRepository.save(counterSale);

        Map<String, Object> result = new HashMap<>();
        result.put("orderNumber", orderNumber);
        result.put("saleNumber", saleNumber);
        result.put("receiptNumber", receiptNumber);
        result.put("customerName", customerName);
        result.put("membershipTier", membershipTier);
        result.put("discountPercent", discountPercent);
        result.put("subtotal", subtotal);
        result.put("discountAmount", discountAmount);
        result.put("totalAmount", totalAmount);
        result.put("paymentMethod", paymentMethod);
        result.put("timestamp", OffsetDateTime.now());
        return result;
    }

    @Transactional(readOnly = true)
    public List<SportsReturn> getReturns() {
        return returnRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public SportsReturn reviewReturn(Long returnId, String status, String condition, String notes, Long userId) {
        SportsReturn sportsReturn = returnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return not found: " + returnId));

        sportsReturn.setStatus(status.toUpperCase());
        if (condition != null) sportsReturn.setCondition(condition.toUpperCase());
        if (notes != null) sportsReturn.setAdminNotes(notes);
        sportsReturn.setReviewedBy(userRepository.findById(userId).orElse(null));
        sportsReturn.setUpdatedAt(OffsetDateTime.now());

        // If returned in SELLABLE condition and APPROVED, restock automatically
        if ("APPROVED".equalsIgnoreCase(status) && "SELLABLE".equalsIgnoreCase(condition)) {
            if (sportsReturn.getOrderItem() != null && sportsReturn.getOrderItem().getProduct() != null) {
                SportsProduct p = sportsReturn.getOrderItem().getProduct();
                int qty = sportsReturn.getOrderItem().getQuantity();
                int before = p.getStockQuantity();
                int after = before + qty;
                p.setStockQuantity(after);
                productRepository.save(p);

                movementRepository.save(SportsInventoryMovement.builder()
                        .product(p)
                        .movementType("SELLABLE_RETURN")
                        .quantity(qty)
                        .stockBefore(before)
                        .stockAfter(after)
                        .reason("Return #" + sportsReturn.getReturnNumber() + " approved in sellable condition")
                        .performedBy(userRepository.findById(userId).orElse(null))
                        .createdAt(OffsetDateTime.now())
                        .build());
            }
        }

        return returnRepository.save(sportsReturn);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSalesReport() {
        OffsetDateTime todayStart = LocalDate.now().atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime weekStart = LocalDate.now().minusDays(7).atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime monthStart = LocalDate.now().minusDays(30).atStartOfDay().atOffset(ZoneOffset.UTC);

        Map<String, Object> report = new HashMap<>();
        report.put("todaySales", orderRepository.sumTotalSalesSince(todayStart));
        report.put("todayOrders", orderRepository.countOrdersSince(todayStart));
        report.put("weeklySales", orderRepository.sumTotalSalesSince(weekStart));
        report.put("weeklyOrders", orderRepository.countOrdersSince(weekStart));
        report.put("monthlySales", orderRepository.sumTotalSalesSince(monthStart));
        report.put("monthlyOrders", orderRepository.countOrdersSince(monthStart));
        report.put("allTimeSales", orderRepository.sumTotalSalesAllTime());
        report.put("allTimeOrders", orderRepository.count());

        report.put("completedOrders", orderRepository.countByOrderStatus("COMPLETED"));
        report.put("pendingOrders", orderRepository.countByOrderStatus("NEW") + orderRepository.countByOrderStatus("PACKING"));
        report.put("lowStockCount", productRepository.findLowStockProducts().size());

        return report;
    }
}
