package com.clubsphere.cafe.service;

import com.clubsphere.cafe.dto.CafeOrderStatusUpdateDTO;
import com.clubsphere.cafe.dto.CafeteriaOrderDTO;
import com.clubsphere.cafe.dto.CafeteriaOrderItemDTO;
import com.clubsphere.cafe.dto.CreateCafeOrderDTO;
import com.clubsphere.cafe.dto.CreateCafeOrderItemDTO;
import com.clubsphere.cafe.entity.CafeteriaOrder;
import com.clubsphere.cafe.entity.CafeteriaOrderItem;
import com.clubsphere.cafe.entity.CafeteriaOrderStatusHistory;
import com.clubsphere.cafe.entity.CafeteriaTab;
import com.clubsphere.cafe.entity.CafeteriaTable;
import com.clubsphere.cafe.entity.MenuItem;
import com.clubsphere.cafe.enums.CafeOrderStatus;
import com.clubsphere.cafe.enums.CafeOrderType;
import com.clubsphere.cafe.enums.TableStatus;
import com.clubsphere.cafe.repository.CafeteriaOrderItemRepository;
import com.clubsphere.cafe.repository.CafeteriaOrderRepository;
import com.clubsphere.cafe.repository.CafeteriaOrderStatusHistoryRepository;
import com.clubsphere.cafe.repository.CafeteriaTabRepository;
import com.clubsphere.cafe.repository.CafeteriaTableRepository;
import com.clubsphere.cafe.repository.MenuItemRepository;
import com.clubsphere.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * CafeOrderService — Manages cafe and bar order lifecycle, status tracking, item validation, and table occupancy.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CafeOrderService {

    private final CafeteriaOrderRepository orderRepository;
    private final CafeteriaOrderItemRepository orderItemRepository;
    private final CafeteriaOrderStatusHistoryRepository orderStatusHistoryRepository;
    private final CafeteriaTableRepository tableRepository;
    private final CafeteriaTabRepository tabRepository;
    private final MenuItemRepository menuItemRepository;
    private final MenuService menuService;
    private final TableService tableService;

    /**
     * Creates a new cafe/bar order.
     *
     * @param dto Order creation details
     * @return Created CafeteriaOrderDTO
     */
    public CafeteriaOrderDTO createOrder(CreateCafeOrderDTO dto) {
        log.info("Creating new cafe order with orderType: {}", dto.getOrderType());

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // 1. Generate unique orderNumber: CAFE-{timestamp}-{random4digits}
        int random4Digits = ThreadLocalRandom.current().nextInt(1000, 10000);
        String orderNumber = "CAFE-" + System.currentTimeMillis() + "-" + random4Digits;

        // 2. Fetch table if tableId provided
        CafeteriaTable table = null;
        if (dto.getTableId() != null) {
            table = tableRepository.findById(dto.getTableId())
                    .orElseThrow(() -> new ResourceNotFoundException("CafeteriaTable", "id", dto.getTableId()));
        }

        // 3. Fetch tab if tabId provided
        CafeteriaTab tab = null;
        if (dto.getTabId() != null) {
            tab = tabRepository.findById(dto.getTabId())
                    .orElseThrow(() -> new ResourceNotFoundException("CafeteriaTab", "id", dto.getTabId()));
            if (table == null && tab.getTable() != null) {
                table = tab.getTable();
            }
        }

        String orderType = dto.getOrderType() != null ? dto.getOrderType().toUpperCase().trim() : CafeOrderType.DINE_IN.name();

        // 4. Validate each menuItem exists and isAvailable, calculate prices
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;
        List<CafeteriaOrderItem> orderItems = new ArrayList<>();

        for (CreateCafeOrderItemDTO itemDto : dto.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemDto.getMenuItemId()));

            if (Boolean.FALSE.equals(menuItem.getIsAvailable())) {
                throw new IllegalArgumentException("Menu item '" + menuItem.getName() + "' is currently unavailable");
            }

            BigDecimal price = menuItem.getPrice() != null ? menuItem.getPrice() : BigDecimal.ZERO;
            BigDecimal discountPercent = menuItem.getDiscountPercent() != null ? menuItem.getDiscountPercent() : BigDecimal.ZERO;

            // effectivePrice = price * (1 - discountPercent / 100)
            BigDecimal effectivePrice = menuService.calculateEffectivePrice(price, discountPercent);
            int qty = itemDto.getQuantity() != null ? itemDto.getQuantity() : 1;
            BigDecimal lineTotal = effectivePrice.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal rawLineTotal = price.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);

            subtotal = subtotal.add(rawLineTotal);
            discountAmount = discountAmount.add(rawLineTotal.subtract(lineTotal));

            CafeteriaOrderItem orderItem = CafeteriaOrderItem.builder()
                    .menuItem(menuItem)
                    .menuItemId(menuItem.getId())
                    .quantity(qty)
                    .unitPrice(effectivePrice)
                    .lineTotal(lineTotal)
                    .specialNote(itemDto.getSpecialNote())
                    .build();

            orderItems.add(orderItem);
        }

        BigDecimal taxAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(taxAmount).setScale(2, RoundingMode.HALF_UP);

        // 5. Build CafeteriaOrder with PENDING status
        CafeteriaOrder order = CafeteriaOrder.builder()
                .orderNumber(orderNumber)
                .table(table)
                .tableId(table != null ? table.getId() : null)
                .tab(tab)
                .tabId(tab != null ? tab.getId() : null)
                .customerId(dto.getCustomerId())
                .orderType(orderType)
                .orderStatus(CafeOrderStatus.PENDING.name())
                .subtotal(subtotal.setScale(2, RoundingMode.HALF_UP))
                .discountAmount(discountAmount.setScale(2, RoundingMode.HALF_UP))
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .specialInstructions(dto.getSpecialInstructions())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        for (CafeteriaOrderItem item : orderItems) {
            order.addItem(item);
        }

        // 6. Save order
        CafeteriaOrder savedOrder = orderRepository.save(order);

        // 7. If DINE_IN and tableId provided: set table status to OCCUPIED via TableService
        if (CafeOrderType.DINE_IN.name().equalsIgnoreCase(orderType) && table != null) {
            tableService.updateTableStatus(table.getId(), TableStatus.OCCUPIED.name());
        }

        // 8. If tabId provided: add to tab running total
        if (tab != null) {
            BigDecimal currentRunningTotal = tab.getRunningTotal() != null ? tab.getRunningTotal() : BigDecimal.ZERO;
            tab.setRunningTotal(currentRunningTotal.add(totalAmount).setScale(2, RoundingMode.HALF_UP));
            tabRepository.save(tab);
        }

        // 9. Record status history
        CafeteriaOrderStatusHistory history = CafeteriaOrderStatusHistory.builder()
                .orderId(savedOrder.getId())
                .status(CafeOrderStatus.PENDING.name())
                .changedBy("SYSTEM")
                .notes("Order created with status PENDING")
                .changedAt(LocalDateTime.now())
                .build();
        orderStatusHistoryRepository.save(history);

        log.info("Created cafe order ID: {} with orderNumber: {}", savedOrder.getId(), savedOrder.getOrderNumber());
        return mapOrderToDTO(savedOrder);
    }

    /**
     * Retrieves an order by its unique database ID.
     *
     * @param id Order ID
     * @return CafeteriaOrderDTO
     */
    @Transactional(readOnly = true)
    public CafeteriaOrderDTO getOrderById(Long id) {
        log.debug("Fetching order with ID: {}", id);
        CafeteriaOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CafeteriaOrder", "id", id));
        return mapOrderToDTO(order);
    }

    /**
     * Retrieves all cafe orders.
     *
     * @return List of all CafeteriaOrderDTOs
     */
    @Transactional(readOnly = true)
    public List<CafeteriaOrderDTO> getAllOrders() {
        log.debug("Fetching all cafe orders");
        return orderRepository.findAll().stream()
                .map(this::mapOrderToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves orders filtered by status.
     *
     * @param status Status name (e.g., PENDING, PREPARING, COMPLETED)
     * @return List of matching CafeteriaOrderDTOs
     */
    @Transactional(readOnly = true)
    public List<CafeteriaOrderDTO> getOrdersByStatus(String status) {
        log.debug("Fetching cafe orders with status: {}", status);
        if (status == null || status.isBlank()) {
            return getAllOrders();
        }
        return orderRepository.findByOrderStatus(status.toUpperCase().trim()).stream()
                .map(this::mapOrderToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all orders for a specific cafeteria table.
     *
     * @param tableId Table ID
     * @return List of orders placed for that table
     */
    @Transactional(readOnly = true)
    public List<CafeteriaOrderDTO> getOrdersByTable(Long tableId) {
        log.debug("Fetching cafe orders for table ID: {}", tableId);
        return orderRepository.findByTableId(tableId).stream()
                .map(this::mapOrderToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves active kitchen orders (PENDING, PREPARING, READY).
     *
     * @return List of kitchen-facing orders
     */
    @Transactional(readOnly = true)
    public List<CafeteriaOrderDTO> getKitchenOrders() {
        log.debug("Fetching active kitchen orders");
        List<String> kitchenStatuses = List.of(
                CafeOrderStatus.PENDING.name(),
                CafeOrderStatus.PREPARING.name(),
                CafeOrderStatus.READY.name()
        );
        return orderRepository.findByOrderStatusIn(kitchenStatuses).stream()
                .map(this::mapOrderToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Updates an order's status and logs the transition in audit history.
     * If the order reaches COMPLETED and was DINE_IN, releases the table to AVAILABLE
     * if no other active orders remain.
     *
     * @param orderId Order ID to update
     * @param dto     Status update payload
     * @return Updated CafeteriaOrderDTO
     */
    public CafeteriaOrderDTO updateOrderStatus(Long orderId, CafeOrderStatusUpdateDTO dto) {
        log.info("Updating order ID {} status to {}", orderId, dto.getStatus());
        CafeteriaOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("CafeteriaOrder", "id", orderId));

        String newStatus = dto.getStatus().toUpperCase().trim();
        order.setOrderStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        CafeteriaOrder updatedOrder = orderRepository.save(order);

        // Record history
        CafeteriaOrderStatusHistory history = CafeteriaOrderStatusHistory.builder()
                .orderId(order.getId())
                .status(newStatus)
                .changedBy(dto.getChangedBy() != null ? dto.getChangedBy() : "STAFF")
                .notes(dto.getNotes())
                .changedAt(LocalDateTime.now())
                .build();
        orderStatusHistoryRepository.save(history);

        // If COMPLETED and DINE_IN: check if table has no other active orders, if so set table AVAILABLE
        if (CafeOrderStatus.COMPLETED.name().equalsIgnoreCase(newStatus)
                && CafeOrderType.DINE_IN.name().equalsIgnoreCase(order.getOrderType())) {
            Long tableId = order.getTable() != null ? order.getTable().getId() : order.getTableId();
            if (tableId != null) {
                List<CafeteriaOrder> activeOrders = orderRepository.findByTableIdAndOrderStatusNotIn(
                        tableId,
                        List.of(CafeOrderStatus.COMPLETED.name(), CafeOrderStatus.CANCELLED.name())
                );
                boolean hasOtherActiveOrders = activeOrders.stream()
                        .anyMatch(o -> !o.getId().equals(order.getId()));
                if (!hasOtherActiveOrders) {
                    log.info("No remaining active orders for table ID {}. Setting status to AVAILABLE.", tableId);
                    tableService.updateTableStatus(tableId, TableStatus.AVAILABLE.name());
                }
            }
        }

        return mapOrderToDTO(updatedOrder);
    }

    // =========================================================================
    // DTO MAPPERS
    // =========================================================================

    public CafeteriaOrderDTO mapOrderToDTO(CafeteriaOrder order) {
        if (order == null) return null;

        Integer tableNumber = null;
        if (order.getTable() != null) {
            tableNumber = order.getTable().getTableNumber();
        } else if (order.getTableId() != null) {
            tableNumber = tableRepository.findById(order.getTableId())
                    .map(CafeteriaTable::getTableNumber)
                    .orElse(null);
        }

        List<CafeteriaOrderItemDTO> itemDTOs = Collections.emptyList();
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            itemDTOs = order.getItems().stream()
                    .map(this::mapOrderItemToDTO)
                    .collect(Collectors.toList());
        } else if (order.getId() != null) {
            itemDTOs = orderItemRepository.findByOrderId(order.getId()).stream()
                    .map(this::mapOrderItemToDTO)
                    .collect(Collectors.toList());
        }

        return CafeteriaOrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .tableNumber(tableNumber)
                .tabId(order.getTabId())
                .customerId(order.getCustomerId())
                .orderType(order.getOrderType())
                .orderStatus(order.getOrderStatus())
                .items(itemDTOs)
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .specialInstructions(order.getSpecialInstructions())
                .createdAt(order.getCreatedAt())
                .build();
    }

    public CafeteriaOrderItemDTO mapOrderItemToDTO(CafeteriaOrderItem item) {
        if (item == null) return null;

        Long menuItemId = item.getMenuItemId();
        String menuItemName = null;
        if (item.getMenuItem() != null) {
            menuItemId = item.getMenuItem().getId();
            menuItemName = item.getMenuItem().getName();
        } else if (menuItemId != null) {
            menuItemName = menuItemRepository.findById(menuItemId)
                    .map(MenuItem::getName)
                    .orElse(null);
        }

        return CafeteriaOrderItemDTO.builder()
                .id(item.getId())
                .menuItemId(menuItemId)
                .menuItemName(menuItemName)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .lineTotal(item.getLineTotal())
                .specialNote(item.getSpecialNote())
                .build();
    }
}
