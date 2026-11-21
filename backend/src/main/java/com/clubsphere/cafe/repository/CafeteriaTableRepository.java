package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.CafeteriaTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CafeteriaTableRepository — Data access operations for dining tables.
 */
@Repository
public interface CafeteriaTableRepository extends JpaRepository<CafeteriaTable, Long> {

    /**
     * Finds tables by their current operational status (e.g. AVAILABLE, OCCUPIED).
     *
     * @param status Table status string
     * @return List of matching CafeteriaTable entities
     */
    List<CafeteriaTable> findByStatus(String status);

    /**
     * Finds a table by its physical table number.
     *
     * @param tableNumber Unique table number
     * @return Optional CafeteriaTable
     */
    Optional<CafeteriaTable> findByTableNumber(int tableNumber);

    /**
     * Checks if a table number already exists.
     *
     * @param tableNumber Table number to test
     * @return true if exists, false otherwise
     */
    boolean existsByTableNumber(int tableNumber);
}
