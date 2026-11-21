package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.EmployeeShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeShiftRepository extends JpaRepository<EmployeeShift, Integer> {
    Optional<EmployeeShift> findByName(String name);
}
