package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeOrderByCreatedAtDesc(Employee employee);
    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<LeaveRequest> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'APPROVED' AND :today BETWEEN lr.startDate AND lr.endDate")
    long countEmployeesOnLeaveToday(@Param("today") LocalDate today);
}
