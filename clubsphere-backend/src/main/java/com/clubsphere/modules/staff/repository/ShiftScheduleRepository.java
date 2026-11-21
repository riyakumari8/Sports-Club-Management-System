package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.EmployeeShiftSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftScheduleRepository extends JpaRepository<EmployeeShiftSchedule, Long> {
    List<EmployeeShiftSchedule> findByEmployeeAndScheduleDateBetween(Employee employee, LocalDate start, LocalDate end);
    List<EmployeeShiftSchedule> findByScheduleDate(LocalDate scheduleDate);
}
