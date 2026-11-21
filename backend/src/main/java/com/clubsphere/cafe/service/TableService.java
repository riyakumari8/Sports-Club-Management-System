package com.clubsphere.cafe.service;

import com.clubsphere.cafe.dto.CafeteriaTableDTO;
import com.clubsphere.cafe.entity.CafeteriaTable;
import com.clubsphere.cafe.enums.TableStatus;
import com.clubsphere.cafe.repository.CafeteriaTableRepository;
import com.clubsphere.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * TableService — Handles management and status tracking for cafeteria tables.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TableService {

    private final CafeteriaTableRepository tableRepository;

    /**
     * Retrieves all tables.
     *
     * @return List of all table DTOs
     */
    @Transactional(readOnly = true)
    public List<CafeteriaTableDTO> getAllTables() {
        log.debug("Fetching all cafeteria tables");
        return tableRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single table by its ID.
     *
     * @param id Table ID
     * @return CafeteriaTableDTO
     */
    @Transactional(readOnly = true)
    public CafeteriaTableDTO getTableById(Long id) {
        CafeteriaTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CafeteriaTable", "id", id));
        return mapToDTO(table);
    }

    /**
     * Retrieves all currently available dining tables.
     *
     * @return List of available tables
     */
    @Transactional(readOnly = true)
    public List<CafeteriaTableDTO> getAvailableTables() {
        log.debug("Fetching available cafeteria tables");
        return tableRepository.findByStatus(TableStatus.AVAILABLE.name()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CafeteriaTableDTO> getTablesByStatus(String status) {
        log.debug("Fetching cafeteria tables by status: {}", status);
        return tableRepository.findByStatus(status != null ? status.toUpperCase() : TableStatus.AVAILABLE.name()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new cafeteria table.
     *
     * @param dto Table details
     * @return Created CafeteriaTableDTO
     */
    public CafeteriaTableDTO createTable(CafeteriaTableDTO dto) {
        log.info("Creating new table with number: {}", dto.getTableNumber());
        if (tableRepository.existsByTableNumber(dto.getTableNumber())) {
            throw new IllegalArgumentException("Table number " + dto.getTableNumber() + " already exists");
        }

        String initialStatus = (dto.getStatus() != null && !dto.getStatus().isBlank())
                ? dto.getStatus().toUpperCase()
                : TableStatus.AVAILABLE.name();

        CafeteriaTable table = CafeteriaTable.builder()
                .tableNumber(dto.getTableNumber())
                .capacity(dto.getCapacity())
                .status(initialStatus)
                .location(dto.getLocation())
                .build();

        CafeteriaTable saved = tableRepository.save(table);
        return mapToDTO(saved);
    }

    /**
     * Updates an existing table's attributes.
     *
     * @param id  Table ID
     * @param dto Updated table details
     * @return Updated CafeteriaTableDTO
     */
    public CafeteriaTableDTO updateTable(Long id, CafeteriaTableDTO dto) {
        log.info("Updating table ID: {}", id);
        CafeteriaTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CafeteriaTable", "id", id));

        // If table number changed, check uniqueness
        if (!table.getTableNumber().equals(dto.getTableNumber())
                && tableRepository.existsByTableNumber(dto.getTableNumber())) {
            throw new IllegalArgumentException("Table number " + dto.getTableNumber() + " is already in use");
        }

        table.setTableNumber(dto.getTableNumber());
        table.setCapacity(dto.getCapacity());
        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            table.setStatus(dto.getStatus().toUpperCase());
        }
        table.setLocation(dto.getLocation());

        CafeteriaTable updated = tableRepository.save(table);
        return mapToDTO(updated);
    }

    /**
     * Updates the status of a specific table (e.g. AVAILABLE, OCCUPIED, RESERVED, CLEANING).
     *
     * @param id     Table ID
     * @param status New status string
     * @return Updated CafeteriaTableDTO
     */
    public CafeteriaTableDTO updateTableStatus(Long id, String status) {
        log.info("Updating table ID {} status to {}", id, status);
        CafeteriaTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CafeteriaTable", "id", id));

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        table.setStatus(status.toUpperCase().trim());
        CafeteriaTable updated = tableRepository.save(table);
        return mapToDTO(updated);
    }

    /**
     * Maps CafeteriaTable entity to its DTO representation.
     */
    public CafeteriaTableDTO mapToDTO(CafeteriaTable table) {
        if (table == null) return null;
        return CafeteriaTableDTO.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .capacity(table.getCapacity())
                .status(table.getStatus())
                .location(table.getLocation())
                .build();
    }
}
