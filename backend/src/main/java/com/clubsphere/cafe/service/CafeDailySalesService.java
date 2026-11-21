package com.clubsphere.cafe.service;

import com.clubsphere.cafe.dto.DailySalesDTO;
import com.clubsphere.cafe.dto.PopularItemDTO;
import com.clubsphere.cafe.entity.CafeteriaOrder;
import com.clubsphere.cafe.entity.CafeteriaOrderItem;
import com.clubsphere.cafe.repository.CafeteriaOrderItemRepository;
import com.clubsphere.cafe.repository.CafeteriaOrderRepository;
import com.clubsphere.cafe.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CafeDailySalesService {

    private final CafeteriaOrderRepository orderRepository;
    private final CafeteriaOrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional(readOnly = true)
    public DailySalesDTO getDailySales(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        List<CafeteriaOrder> orders = orderRepository.findByCreatedAtBetween(startOfDay, endOfDay);

        int totalOrders = orders.size();
        int completedOrders = (int) orders.stream()
                .filter(o -> "COMPLETED".equals(o.getOrderStatus())).count();
        int pendingOrders = (int) orders.stream()
                .filter(o -> "PENDING".equals(o.getOrderStatus()) || "PREPARING".equals(o.getOrderStatus())).count();

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> "COMPLETED".equals(o.getOrderStatus()) || "SERVED".equals(o.getOrderStatus()))
                .map(CafeteriaOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Find popular items
        Map<Long, Integer> itemCounts = new HashMap<>();
        for (CafeteriaOrder order : orders) {
            List<CafeteriaOrderItem> items = orderItemRepository.findByOrderId(order.getId());
            for (CafeteriaOrderItem item : items) {
                itemCounts.merge(item.getMenuItemId(), item.getQuantity(), Integer::sum);
            }
        }

        List<PopularItemDTO> popularItems = itemCounts.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    String name = menuItemRepository.findById(entry.getKey())
                            .map(mi -> mi.getName()).orElse("Unknown");
                    return PopularItemDTO.builder()
                            .menuItemName(name)
                            .quantitySold(entry.getValue().longValue())
                            .build();
                })
                .collect(Collectors.toList());

        return DailySalesDTO.builder()
                .date(date)
                .totalOrders((long) totalOrders)
                .completedOrders((long) completedOrders)
                .pendingOrders((long) pendingOrders)
                .totalRevenue(totalRevenue)
                .popularItems(popularItems)
                .build();
    }
}
