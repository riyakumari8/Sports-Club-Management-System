package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findByUser(User user);
    Optional<Employee> findByEmployeeCode(String employeeCode);
    boolean existsByEmployeeCode(String employeeCode);

    long countByEmploymentStatus(String status);
    long countByDepartmentId(Integer departmentId);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:query IS NULL OR LOWER(e.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.designation) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:departmentId IS NULL OR e.department.id = :departmentId) AND " +
           "(:status IS NULL OR e.employmentStatus = :status)")
    List<Employee> searchEmployees(
            @Param("query") String query,
            @Param("departmentId") Integer departmentId,
            @Param("status") String status
    );
}
