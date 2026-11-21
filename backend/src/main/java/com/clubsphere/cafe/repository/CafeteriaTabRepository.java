package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.CafeteriaTab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CafeteriaTabRepository — Data access operations for running table tabs.
 */
@Repository
public interface CafeteriaTabRepository extends JpaRepository<CafeteriaTab, Long> {

    /**
     * Finds the open tab for a given table, if one exists.
     *
     * @param tableId Table ID
     * @return Optional open CafeteriaTab
     */
    Optional<CafeteriaTab> findByTableIdAndIsOpenTrue(Long tableId);

    /**
     * Finds all currently open tabs across the cafe.
     *
     * @return List of open CafeteriaTabs
     */
    List<CafeteriaTab> findByIsOpenTrue();
}
