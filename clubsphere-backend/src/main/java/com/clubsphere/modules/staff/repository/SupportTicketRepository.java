package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByDepartmentCodeOrderByCreatedAtDesc(String departmentCode);
    List<SupportTicket> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SupportTicket> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
}
