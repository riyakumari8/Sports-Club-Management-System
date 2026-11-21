package com.clubsphere.cafe.service;

import com.clubsphere.cafe.dto.*;
import com.clubsphere.cafe.entity.CafeteriaTab;
import com.clubsphere.cafe.entity.CafeteriaTable;
import com.clubsphere.cafe.repository.CafeteriaOrderRepository;
import com.clubsphere.cafe.repository.CafeteriaTabRepository;
import com.clubsphere.cafe.repository.CafeteriaTableRepository;
import com.clubsphere.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CafeTabService {

    private final CafeteriaTabRepository tabRepository;
    private final CafeteriaTableRepository tableRepository;
    private final CafeteriaOrderRepository orderRepository;

    @Transactional
    public CafeteriaTabDTO openTab(Long tableId, Long customerId) {
        CafeteriaTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found: " + tableId));

        // Check if table already has open tab
        if (tabRepository.findByTableIdAndIsOpenTrue(tableId).isPresent()) {
            throw new IllegalArgumentException("Table " + table.getTableNumber() + " already has an open tab");
        }

        CafeteriaTab tab = CafeteriaTab.builder()
                .tableId(tableId)
                .customerId(customerId)
                .runningTotal(BigDecimal.ZERO)
                .isOpen(true)
                .openedAt(LocalDateTime.now())
                .build();

        CafeteriaTab saved = tabRepository.save(tab);
        table.setStatus("OCCUPIED");
        tableRepository.save(table);

        log.info("Tab opened for table {}", table.getTableNumber());
        return mapToTabDTO(saved);
    }

    @Transactional(readOnly = true)
    public CafeteriaTabDTO getTab(Long tabId) {
        CafeteriaTab tab = tabRepository.findById(tabId)
                .orElseThrow(() -> new ResourceNotFoundException("Tab not found: " + tabId));
        return mapToTabDTO(tab);
    }

    @Transactional(readOnly = true)
    public List<CafeteriaTabDTO> getOpenTabs() {
        return tabRepository.findByIsOpenTrue().stream()
                .map(this::mapToTabDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CafeteriaTabDTO closeTab(Long tabId) {
        CafeteriaTab tab = tabRepository.findById(tabId)
                .orElseThrow(() -> new ResourceNotFoundException("Tab not found: " + tabId));

        if (!tab.getIsOpen()) {
            throw new IllegalArgumentException("Tab is already closed");
        }

        tab.setIsOpen(false);
        tab.setClosedAt(LocalDateTime.now());
        CafeteriaTab saved = tabRepository.save(tab);

        // Set table back to available
        if (tab.getTableId() != null) {
            tableRepository.findById(tab.getTableId()).ifPresent(table -> {
                table.setStatus("AVAILABLE");
                tableRepository.save(table);
            });
        }

        log.info("Tab {} closed. Total: {}", tabId, tab.getRunningTotal());
        return mapToTabDTO(saved);
    }

    private CafeteriaTabDTO mapToTabDTO(CafeteriaTab tab) {
        Integer tableNumber = null;
        if (tab.getTableId() != null) {
            tableNumber = tableRepository.findById(tab.getTableId())
                    .map(CafeteriaTable::getTableNumber).orElse(null);
        }

        return CafeteriaTabDTO.builder()
                .id(tab.getId())
                .tableId(tab.getTableId())
                .tableNumber(tableNumber)
                .customerId(tab.getCustomerId())
                .runningTotal(tab.getRunningTotal())
                .isOpen(tab.getIsOpen())
                .openedAt(tab.getOpenedAt())
                .closedAt(tab.getClosedAt())
                .build();
    }
}
