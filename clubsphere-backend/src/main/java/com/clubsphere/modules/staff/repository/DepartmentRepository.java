package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    List<Department> findByIsActiveTrue();
    Optional<Department> findByName(String name);
}
